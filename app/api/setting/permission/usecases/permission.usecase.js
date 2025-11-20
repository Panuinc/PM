import { PermissionService } from "@/app/api/setting/permission/core/permission.service";
import {
  permissionPostSchema,
  permissionPutSchema,
} from "@/app/api/setting/permission/core/permission.schema";
import { PermissionValidator } from "@/app/api/setting/permission/core/permission.validator";
import { getLocalNow } from "@/lib/getLocalNow";
import logger from "@/lib/logger.node";

export async function GetAllPermissionUseCase(page = 1, limit = 1000000) {
  const skip = (page - 1) * limit;
  const permissions = await PermissionService.getAllPaginated(skip, limit);
  const total = await PermissionService.countAll();

  return { permissions, total };
}

export async function GetPermissionByIdUseCase(permissionId) {
  if (!permissionId || typeof permissionId !== "string") {
    throw { status: 400, message: "Invalid permission ID" };
  }

  const permission = await PermissionService.getById(permissionId);
  if (!permission) {
    throw { status: 404, message: "Permission not found" };
  }

  return permission;
}

export async function CreatePermissionUseCase(data) {
  logger.info({
    message: "CreatePermissionUseCase start",
    permissionName: data?.permissionName,
    permissionCreatedBy: data?.permissionCreatedBy,
  });

  const parsed = permissionPostSchema.safeParse(data);
  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;

    logger.warn({
      message: "CreatePermissionUseCase validation failed",
      errors: fieldErrors,
    });

    throw {
      status: 422,
      message: "Invalid input",
      details: fieldErrors,
    };
  }

  const normalizedPermissionName = parsed.data.permissionName.trim().toLowerCase();

  const duplicate = await PermissionValidator.isDuplicatePermissionName(normalizedPermissionName);
  if (duplicate) {
    logger.warn({
      message: "CreatePermissionUseCase duplicate permissionName",
      permissionName: normalizedPermissionName,
    });

    throw {
      status: 409,
      message: `permissionName '${normalizedPermissionName}' already exists`,
    };
  }

  try {
    const permission = await PermissionService.create({
      ...parsed.data,
      permissionName: normalizedPermissionName,
      permissionCreatedAt: getLocalNow(),
    });

    logger.info({
      message: "CreatePermissionUseCase success",
      permissionId: permission.permissionId,
    });

    return permission;
  } catch (error) {
    if (error && typeof error === "object" && error.code === "P2002") {
      logger.warn({
        message:
          "CreatePermissionUseCase unique constraint violation on permissionName (P2002)",
        permissionName: normalizedPermissionName,
      });

      throw {
        status: 409,
        message: `permissionName '${normalizedPermissionName}' already exists`,
      };
    }

    logger.error({
      message: "CreatePermissionUseCase error",
      error,
    });

    throw error;
  }
}

export async function UpdatePermissionUseCase(data) {
  logger.info({
    message: "UpdatePermissionUseCase start",
    permissionId: data?.permissionId,
    permissionName: data?.permissionName,
    permissionUpdatedBy: data?.permissionUpdatedBy,
  });

  const parsed = permissionPutSchema.safeParse(data);
  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;

    logger.warn({
      message: "UpdatePermissionUseCase validation failed",
      errors: fieldErrors,
    });

    throw {
      status: 422,
      message: "Invalid input",
      details: fieldErrors,
    };
  }

  const existing = await PermissionService.getById(parsed.data.permissionId);
  if (!existing) {
    logger.warn({
      message: "UpdatePermissionUseCase permission not found",
      permissionId: parsed.data.permissionId,
    });

    throw { status: 404, message: "Permission not found" };
  }

  const normalizedPermissionName = parsed.data.permissionName.trim().toLowerCase();
  const existingPermissionNameNormalized = existing.permissionName
    ? existing.permissionName.trim().toLowerCase()
    : "";

  if (normalizedPermissionName !== existingPermissionNameNormalized) {
    const duplicate = await PermissionValidator.isDuplicatePermissionName(normalizedPermissionName);
    if (duplicate) {
      logger.warn({
        message: "UpdatePermissionUseCase duplicate permissionName",
        permissionName: normalizedPermissionName,
      });

      throw {
        status: 409,
        message: `permissionName '${normalizedPermissionName}' already exists`,
      };
    }
  }

  const { permissionId, ...rest } = parsed.data;

  try {
    const updatedPermission = await PermissionService.update(permissionId, {
      ...rest,
      permissionName: normalizedPermissionName,
      permissionUpdatedAt: getLocalNow(),
    });

    logger.info({
      message: "UpdatePermissionUseCase success",
      permissionId,
    });

    return updatedPermission;
  } catch (error) {
    if (error && typeof error === "object" && error.code === "P2002") {
      logger.warn({
        message:
          "UpdatePermissionUseCase unique constraint violation on permissionName (P2002)",
        permissionName: normalizedPermissionName,
      });

      throw {
        status: 409,
        message: `permissionName '${normalizedPermissionName}' already exists`,
      };
    }

    logger.error({
      message: "UpdatePermissionUseCase error",
      error,
    });

    throw error;
  }
}

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
  logger.info({ message: "GetAllPermissionUseCase success", total });
  return { permissions, total };
}

export async function GetPermissionByIdUseCase(permissionId) {
  if (!permissionId || typeof permissionId !== "string")
    throw { status: 400, message: "Invalid permission ID" };

  const permission = await PermissionService.getById(permissionId);
  if (!permission) throw { status: 404, message: "Permission not found" };

  logger.info({ message: "GetPermissionByIdUseCase success", permissionId });
  return permission;
}

export async function CreatePermissionUseCase(data) {
  logger.info({ message: "CreatePermissionUseCase start", data });

  const parsed = permissionPostSchema.safeParse(data);
  if (!parsed.success) {
    logger.warn({
      message: "Validation failed",
      errors: parsed.error.flatten().fieldErrors,
    });
    throw {
      status: 422,
      message: "Invalid input",
      details: parsed.error.flatten().fieldErrors,
    };
  }

  const duplicateKey = await PermissionValidator.isDuplicatePermissionKey(
    parsed.data.permissionKey
  );
  if (duplicateKey)
    throw {
      status: 409,
      message: `Permission key '${parsed.data.permissionKey}' already exists`,
    };

  const permission = await PermissionService.create({
    permissionName: parsed.data.permissionName.trim(),
    permissionKey: parsed.data.permissionKey.trim(),
    permissionCreatedBy: parsed.data.permissionCreatedBy,
    permissionCreatedAt: getLocalNow(),
  });

  logger.info({
    message: "Permission created successfully",
    permissionId: permission.permissionId,
  });

  return permission;
}

export async function UpdatePermissionUseCase(data) {
  logger.info({ message: "UpdatePermissionUseCase start", data });

  const parsed = permissionPutSchema.safeParse(data);
  if (!parsed.success) {
    logger.warn({
      message: "Validation failed",
      errors: parsed.error.flatten().fieldErrors,
    });
    throw {
      status: 422,
      message: "Invalid input",
      details: parsed.error.flatten().fieldErrors,
    };
  }

  const existing = await PermissionService.getById(parsed.data.permissionId);
  if (!existing) throw { status: 404, message: "Permission not found" };

  if (
    parsed.data.permissionKey.trim().toLowerCase() !==
    existing.permissionKey.trim().toLowerCase()
  ) {
    const duplicateKey = await PermissionValidator.isDuplicatePermissionKey(
      parsed.data.permissionKey
    );
    if (duplicateKey)
      throw {
        status: 409,
        message: `Permission key '${parsed.data.permissionKey}' already exists`,
      };
  }

  const updatedPermission = await PermissionService.update(
    parsed.data.permissionId,
    {
      permissionName: parsed.data.permissionName.trim(),
      permissionKey: parsed.data.permissionKey.trim(),
      permissionStatus: parsed.data.permissionStatus.trim(),
      permissionUpdatedBy: parsed.data.permissionUpdatedBy,
      permissionUpdatedAt: getLocalNow(),
    }
  );

  logger.info({
    message: "Permission updated successfully",
    permissionId: parsed.data.permissionId,
  });

  return updatedPermission;
}

import { RolePermissionService } from "@/app/api/setting/rolePermission/core/rolePermission.service";
import {
  rolePermissionPostSchema,
  rolePermissionPutSchema,
} from "@/app/api/setting/rolePermission/core/rolePermission.schema";
import { RolePermissionValidator } from "@/app/api/setting/rolePermission/core/rolePermission.validator";
import { getLocalNow } from "@/lib/getLocalNow";
import logger from "@/lib/logger.node";

export async function GetAllRolePermissionUseCase(page = 1, limit = 1000000) {
  const skip = (page - 1) * limit;
  logger.info({
    message: "GetAllRolePermissionUseCase start",
    page,
    limit,
    skip,
  });

  const rolePermissions = await RolePermissionService.getAllPaginated(
    skip,
    limit
  );
  const total = await RolePermissionService.countAll();

  logger.info({
    message: "GetAllRolePermissionUseCase success",
    total,
    count: rolePermissions.length,
  });

  return { rolePermissions, total };
}

export async function GetRolePermissionByIdUseCase(rolePermissionId) {
  logger.info({
    message: "GetRolePermissionByIdUseCase start",
    rolePermissionId,
  });

  if (!rolePermissionId || typeof rolePermissionId !== "string") {
    logger.warn({
      message: "Invalid RolePermission ID",
      rolePermissionId,
    });
    throw { status: 400, message: "Invalid RolePermission ID" };
  }

  const rolePermission = await RolePermissionService.getById(rolePermissionId);
  if (!rolePermission) {
    logger.warn({
      message: "RolePermission not found",
      rolePermissionId,
    });
    throw { status: 404, message: "RolePermission not found" };
  }

  logger.info({
    message: "GetRolePermissionByIdUseCase success",
    rolePermissionId,
  });

  return rolePermission;
}

export async function CreateRolePermissionUseCase(data) {
  logger.info({ message: "CreateRolePermissionUseCase start", data });

  const parsed = rolePermissionPostSchema.safeParse(data);
  if (!parsed.success) {
    logger.warn({
      message: "RolePermission validation failed",
      errors: parsed.error.flatten().fieldErrors,
    });
    throw {
      status: 422,
      message: "Invalid input",
      details: parsed.error.flatten().fieldErrors,
    };
  }

  const duplicate = await RolePermissionValidator.isDuplicate(
    parsed.data.rolePermissionRoleId,
    parsed.data.rolePermissionPermissionId
  );

  if (duplicate) {
    logger.warn({
      message: "Duplicate RolePermission pair detected",
      roleId: parsed.data.rolePermissionRoleId,
      permissionId: parsed.data.rolePermissionPermissionId,
    });
    throw {
      status: 409,
      message: "This Role and Permission pair already exists",
    };
  }

  const rolePermission = await RolePermissionService.create({
    rolePermissionRoleId: parsed.data.rolePermissionRoleId,
    rolePermissionPermissionId: parsed.data.rolePermissionPermissionId,
    rolePermissionStatus: "Enable",
    rolePermissionCreatedBy: parsed.data.rolePermissionCreatedBy,
    rolePermissionCreatedAt: getLocalNow(),
  });

  logger.info({
    message: "RolePermission created successfully",
    rolePermissionId: rolePermission.rolePermissionId,
  });

  return rolePermission;
}

export async function UpdateRolePermissionUseCase(data) {
  logger.info({ message: "UpdateRolePermissionUseCase start", data });

  const parsed = rolePermissionPutSchema.safeParse(data);
  if (!parsed.success) {
    logger.warn({
      message: "RolePermission validation failed",
      errors: parsed.error.flatten().fieldErrors,
    });
    throw {
      status: 422,
      message: "Invalid input",
      details: parsed.error.flatten().fieldErrors,
    };
  }

  const existing = await RolePermissionService.getById(
    parsed.data.rolePermissionId
  );
  if (!existing) {
    logger.warn({
      message: "RolePermission not found",
      rolePermissionId: parsed.data.rolePermissionId,
    });
    throw { status: 404, message: "RolePermission not found" };
  }

  if (
    parsed.data.rolePermissionRoleId !== existing.rolePermissionRoleId ||
    parsed.data.rolePermissionPermissionId !==
      existing.rolePermissionPermissionId
  ) {
    const duplicate = await RolePermissionValidator.isDuplicate(
      parsed.data.rolePermissionRoleId,
      parsed.data.rolePermissionPermissionId
    );
    if (duplicate) {
      logger.warn({
        message: "Duplicate RolePermission pair detected on update",
        roleId: parsed.data.rolePermissionRoleId,
        permissionId: parsed.data.rolePermissionPermissionId,
      });
      throw {
        status: 409,
        message: "This Role and Permission pair already exists",
      };
    }
  }

  const updatedRolePermission = await RolePermissionService.update(
    parsed.data.rolePermissionId,
    {
      rolePermissionRoleId: parsed.data.rolePermissionRoleId,
      rolePermissionPermissionId: parsed.data.rolePermissionPermissionId,
      rolePermissionStatus: parsed.data.rolePermissionStatus,
      rolePermissionUpdatedBy: parsed.data.rolePermissionUpdatedBy,
      rolePermissionUpdatedAt: getLocalNow(),
    }
  );

  logger.info({
    message: "RolePermission updated successfully",
    rolePermissionId: parsed.data.rolePermissionId,
  });

  return updatedRolePermission;
}

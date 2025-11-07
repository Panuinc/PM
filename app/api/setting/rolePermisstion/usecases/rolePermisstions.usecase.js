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
  const rolePermissions = await RolePermissionService.getAllPaginated(skip, limit);
  const total = await RolePermissionService.countAll();

  logger.info({ message: "GetAllRolePermissionUseCase success", total });
  return { rolePermissions, total };
}

export async function GetRolePermissionByIdUseCase(rolePermissionId) {
  if (!rolePermissionId || typeof rolePermissionId !== "string")
    throw { status: 400, message: "Invalid rolePermission ID" };

  const rolePermission = await RolePermissionService.getById(rolePermissionId);
  if (!rolePermission) throw { status: 404, message: "RolePermission not found" };

  logger.info({ message: "GetRolePermissionByIdUseCase success", rolePermissionId });
  return rolePermission;
}

export async function CreateRolePermissionUseCase(data) {
  logger.info({ message: "CreateRolePermissionUseCase start", data });

  const parsed = rolePermissionPostSchema.safeParse(data);
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

  const duplicate = await RolePermissionValidator.isDuplicateRolePermissionName(
    parsed.data.rolePermissionName
  );
  if (duplicate)
    throw {
      status: 409,
      message: `RolePermission '${parsed.data.rolePermissionName}' already exists`,
    };

  const rolePermission = await RolePermissionService.create({
    rolePermissionName: parsed.data.rolePermissionName.trim(),
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
      message: "Validation failed",
      errors: parsed.error.flatten().fieldErrors,
    });
    throw {
      status: 422,
      message: "Invalid input",
      details: parsed.error.flatten().fieldErrors,
    };
  }

  const existing = await RolePermissionService.getById(parsed.data.rolePermissionId);
  if (!existing) throw { status: 404, message: "RolePermission not found" };

  if (
    parsed.data.rolePermissionName.trim().toLowerCase() !==
    existing.rolePermissionName.trim().toLowerCase()
  ) {
    const duplicate = await RolePermissionValidator.isDuplicateRolePermissionName(
      parsed.data.rolePermissionName
    );
    if (duplicate)
      throw {
        status: 409,
        message: `RolePermission '${parsed.data.rolePermissionName}' already exists`,
      };
  }

  const updatedRolePermission = await RolePermissionService.update(
    parsed.data.rolePermissionId,
    {
      rolePermissionName: parsed.data.rolePermissionName.trim(),
      rolePermissionStatus: parsed.data.rolePermissionStatus.trim(),
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

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
  const rolePermissions = await RolePermissionService.getAllPaginated(
    skip,
    limit
  );
  const total = await RolePermissionService.countAll();
  return { rolePermissions, total };
}

export async function GetRolePermissionByIdUseCase(rolePermissionId) {
  if (!rolePermissionId || typeof rolePermissionId !== "string")
    throw { status: 400, message: "Invalid RolePermission ID" };

  const rolePermission = await RolePermissionService.getById(rolePermissionId);
  if (!rolePermission)
    throw { status: 404, message: "RolePermission not found" };
  return rolePermission;
}

export async function CreateRolePermissionUseCase(data) {
  const parsed = rolePermissionPostSchema.safeParse(data);
  if (!parsed.success)
    throw {
      status: 422,
      message: "Invalid input",
      details: parsed.error.flatten().fieldErrors,
    };

  const duplicate = await RolePermissionValidator.isDuplicate(
    parsed.data.rolePermissionRoleId,
    parsed.data.rolePermissionPermissionId
  );
  if (duplicate)
    throw {
      status: 409,
      message: "This Role and Permission pair already exists",
    };

  const rolePermission = await RolePermissionService.create({
    rolePermissionRoleId: parsed.data.rolePermissionRoleId,
    rolePermissionPermissionId: parsed.data.rolePermissionPermissionId,
    rolePermissionStatus: "Enable",
    rolePermissionCreatedBy: parsed.data.rolePermissionCreatedBy,
    rolePermissionCreatedAt: getLocalNow(),
  });

  return rolePermission;
}

export async function UpdateRolePermissionUseCase(data) {
  const parsed = rolePermissionPutSchema.safeParse(data);
  if (!parsed.success)
    throw {
      status: 422,
      message: "Invalid input",
      details: parsed.error.flatten().fieldErrors,
    };

  const existing = await RolePermissionService.getById(
    parsed.data.rolePermissionId
  );
  if (!existing) throw { status: 404, message: "RolePermission not found" };

  if (
    parsed.data.rolePermissionRoleId !== existing.rolePermissionRoleId ||
    parsed.data.rolePermissionPermissionId !==
      existing.rolePermissionPermissionId
  ) {
    const duplicate = await RolePermissionValidator.isDuplicate(
      parsed.data.rolePermissionRoleId,
      parsed.data.rolePermissionPermissionId
    );
    if (duplicate)
      throw {
        status: 409,
        message: "This Role and Permission pair already exists",
      };
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

  return updatedRolePermission;
}

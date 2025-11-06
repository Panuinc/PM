import { RoleService } from "@/app/api/setting/role/core/role.service";
import {
  rolePostSchema,
  rolePutSchema,
} from "@/app/api/setting/role/core/role.schema";
import { RoleValidator } from "@/app/api/setting/role/core/role.validator";
import { getLocalNow } from "@/lib/getLocalNow";
import logger from "@/lib/logger.node";

export async function GetAllRoleUseCase(page = 1, limit = 1000000) {
  const skip = (page - 1) * limit;
  const roles = await RoleService.getAllPaginated(skip, limit);
  const total = await RoleService.countAll();

  logger.info({ message: "GetAllRoleUseCase success", total });
  return { roles, total };
}

export async function GetRoleByIdUseCase(roleId) {
  if (!roleId || typeof roleId !== "string")
    throw { status: 400, message: "Invalid role ID" };

  const role = await RoleService.getById(roleId);
  if (!role) throw { status: 404, message: "Role not found" };

  logger.info({ message: "GetRoleByIdUseCase success", roleId });
  return role;
}

export async function CreateRoleUseCase(data) {
  logger.info({ message: "CreateRoleUseCase start", data });

  const parsed = rolePostSchema.safeParse(data);
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

  const duplicate = await RoleValidator.isDuplicateRoleName(
    parsed.data.roleName
  );
  if (duplicate)
    throw {
      status: 409,
      message: `Role '${parsed.data.roleName}' already exists`,
    };

  const role = await RoleService.create({
    roleName: parsed.data.roleName.trim(),
    roleCreatedBy: parsed.data.roleCreatedBy,
    roleCreatedAt: getLocalNow(),
  });

  logger.info({
    message: "Role created successfully",
    roleId: role.roleId,
  });

  return role;
}

export async function UpdateRoleUseCase(data) {
  logger.info({ message: "UpdateRoleUseCase start", data });

  const parsed = rolePutSchema.safeParse(data);
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

  const existing = await RoleService.getById(parsed.data.roleId);
  if (!existing) throw { status: 404, message: "Role not found" };

  if (
    parsed.data.roleName.trim().toLowerCase() !==
    existing.roleName.trim().toLowerCase()
  ) {
    const duplicate = await RoleValidator.isDuplicateRoleName(
      parsed.data.roleName
    );
    if (duplicate)
      throw {
        status: 409,
        message: `Role '${parsed.data.roleName}' already exists`,
      };
  }

  const updatedRole = await RoleService.update(
    parsed.data.roleId,
    {
      roleName: parsed.data.roleName.trim(),
      roleStatus: parsed.data.roleStatus.trim(),
      roleUpdatedBy: parsed.data.roleUpdatedBy,
      roleUpdatedAt: getLocalNow(),
    }
  );

  logger.info({
    message: "Role updated successfully",
    roleId: parsed.data.roleId,
  });

  return updatedRole;
}

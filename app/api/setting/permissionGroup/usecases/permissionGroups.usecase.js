import { PermissionGroupService } from "../core/permissionGroup.service";
import {
  permissionGroupPostSchema,
  permissionGroupPutSchema,
} from "../core/permissionGroup.schema";
import { PermissionGroupValidator } from "../core/permissionGroup.validator";
import logger from "@/lib/logger.node";

export async function GetAllPermissionGroupUseCase(page = 1, limit = 1000000) {
  const skip = (page - 1) * limit;
  const permissionGroups = await PermissionGroupService.getAllPaginated(skip, limit);
  const total = await PermissionGroupService.countAll();

  return { permissionGroups, total };
}

export async function GetPermissionGroupByIdUseCase(permissionGroupId) {
  if (!permissionGroupId || typeof permissionGroupId !== "string")
    throw { status: 400, message: "Invalid permissionGroup ID" };

  const permissionGroup = await PermissionGroupService.getById(permissionGroupId);
  if (!permissionGroup) throw { status: 404, message: "PermissionGroup not found" };

  return permissionGroup;
}

export async function CreatePermissionGroupUseCase(data) {
  logger.info({ message: "CreatePermissionGroupUseCase start", data });

  const parsed = permissionGroupPostSchema.safeParse(data);
  if (!parsed.success)
    throw {
      status: 422,
      message: "Invalid input",
      details: parsed.error.flatten().fieldErrors,
    };

  const duplicate = await PermissionGroupValidator.isDuplicatePermissionGroupName(
    parsed.data.permissionGroupName
  );
  if (duplicate)
    throw {
      status: 409,
      message: `PermissionGroup '${parsed.data.permissionGroupName}' already exists`,
    };

  return PermissionGroupService.create({
    permissionGroupName: parsed.data.permissionGroupName.trim(),
    permissionGroupOrder: parsed.data.permissionGroupOrder,
  });
}

export async function UpdatePermissionGroupUseCase(data) {
  logger.info({ message: "UpdatePermissionGroupUseCase start", data });

  const parsed = permissionGroupPutSchema.safeParse(data);
  if (!parsed.success)
    throw {
      status: 422,
      message: "Invalid input",
      details: parsed.error.flatten().fieldErrors,
    };

  const existing = await PermissionGroupService.getById(parsed.data.permissionGroupId);
  if (!existing) throw { status: 404, message: "PermissionGroup not found" };

  if (
    parsed.data.permissionGroupName.trim().toLowerCase() !==
    existing.permissionGroupName.trim().toLowerCase()
  ) {
    const duplicate = await PermissionGroupValidator.isDuplicatePermissionGroupName(
      parsed.data.permissionGroupName
    );
    if (duplicate)
      throw {
        status: 409,
        message: `PermissionGroup '${parsed.data.permissionGroupName}' already exists`,
      };
  }

  return PermissionGroupService.update(parsed.data.permissionGroupId, {
    permissionGroupName: parsed.data.permissionGroupName.trim(),
    permissionGroupOrder: parsed.data.permissionGroupOrder,
  });
}

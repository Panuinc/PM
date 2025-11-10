import { UserRoleService } from "@/app/api/setting/userRole/core/userRole.service";
import {
  userRolePostSchema,
  userRolePutSchema,
} from "@/app/api/setting/userRole/core/userRole.schema";
import { UserRoleValidator } from "@/app/api/setting/userRole/core/userRole.validator";
import { getLocalNow } from "@/lib/getLocalNow";
import logger from "@/lib/logger.node";

export async function GetAllUserRoleUseCase(page = 1, limit = 1000000) {
  const skip = (page - 1) * limit;
  const userRoles = await UserRoleService.getAllPaginated(skip, limit);
  const total = await UserRoleService.countAll();
  return { userRoles, total };
}

export async function GetUserRoleByIdUseCase(userRoleId) {
  if (!userRoleId || typeof userRoleId !== "string")
    throw { status: 400, message: "Invalid UserRole ID" };

  const userRole = await UserRoleService.getById(userRoleId);
  if (!userRole) throw { status: 404, message: "UserRole not found" };
  return userRole;
}

export async function CreateUserRoleUseCase(data) {
  const parsed = userRolePostSchema.safeParse(data);
  if (!parsed.success)
    throw {
      status: 422,
      message: "Invalid input",
      details: parsed.error.flatten().fieldErrors,
    };

  const duplicate = await UserRoleValidator.isDuplicate(
    parsed.data.userRoleRoleId,
    parsed.data.userRoleUserId
  );
  if (duplicate)
    throw { status: 409, message: "This Role and User pair already exists" };

  const userRole = await UserRoleService.create({
    userRoleRoleId: parsed.data.userRoleRoleId,
    userRoleUserId: parsed.data.userRoleUserId,
    userRoleStatus: "Enable",
    userRoleCreatedBy: parsed.data.userRoleCreatedBy,
    userRoleCreatedAt: getLocalNow(),
  });

  return userRole;
}

export async function UpdateUserRoleUseCase(data) {
  const parsed = userRolePutSchema.safeParse(data);
  if (!parsed.success)
    throw {
      status: 422,
      message: "Invalid input",
      details: parsed.error.flatten().fieldErrors,
    };

  const existing = await UserRoleService.getById(parsed.data.userRoleId);
  if (!existing) throw { status: 404, message: "UserRole not found" };

  if (
    parsed.data.userRoleRoleId !== existing.userRoleRoleId ||
    parsed.data.userRoleUserId !== existing.userRoleUserId
  ) {
    const duplicate = await UserRoleValidator.isDuplicate(
      parsed.data.userRoleRoleId,
      parsed.data.userRoleUserId
    );
    if (duplicate)
      throw { status: 409, message: "This Role and User pair already exists" };
  }

  const updatedUserRole = await UserRoleService.update(parsed.data.userRoleId, {
    userRoleRoleId: parsed.data.userRoleRoleId,
    userRoleUserId: parsed.data.userRoleUserId,
    userRoleStatus: parsed.data.userRoleStatus,
    userRoleUpdatedBy: parsed.data.userRoleUpdatedBy,
    userRoleUpdatedAt: getLocalNow(),
  });

  return updatedUserRole;
}

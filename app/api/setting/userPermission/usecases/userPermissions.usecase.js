import { UserPermissionService } from "@/app/api/setting/userPermission/core/userPermission.service";
import {
  userPermissionPostSchema,
  userPermissionPutSchema,
} from "@/app/api/setting/userPermission/core/userPermission.schema";
import { UserPermissionValidator } from "@/app/api/setting/userPermission/core/userPermission.validator";
import { getLocalNow } from "@/lib/getLocalNow";
import logger from "@/lib/logger.node";

export async function GetAllUserPermissionUseCase(page = 1, limit = 1000000) {
  const skip = (page - 1) * limit;
  const userPermissions = await UserPermissionService.getAllPaginated(skip, limit);
  const total = await UserPermissionService.countAll();
  return { userPermissions, total };
}

export async function GetUserPermissionByIdUseCase(userPermissionId) {
  if (!userPermissionId || typeof userPermissionId !== "string")
    throw { status: 400, message: "Invalid UserPermission ID" };

  const userPermission = await UserPermissionService.getById(userPermissionId);
  if (!userPermission) throw { status: 404, message: "UserPermission not found" };
  return userPermission;
}

export async function CreateUserPermissionUseCase(data) {
  const parsed = userPermissionPostSchema.safeParse(data);
  if (!parsed.success)
    throw {
      status: 422,
      message: "Invalid input",
      details: parsed.error.flatten().fieldErrors,
    };

  const duplicate = await UserPermissionValidator.isDuplicate(
    parsed.data.userPermissionPermissionId,
    parsed.data.userPermissionUserId
  );
  if (duplicate)
    throw { status: 409, message: "This Permission and User pair already exists" };

  const userPermission = await UserPermissionService.create({
    userPermissionPermissionId: parsed.data.userPermissionPermissionId,
    userPermissionUserId: parsed.data.userPermissionUserId,
    userPermissionStatus: "Enable",
    userPermissionCreatedBy: parsed.data.userPermissionCreatedBy,
    userPermissionCreatedAt: getLocalNow(),
  });

  return userPermission;
}

export async function UpdateUserPermissionUseCase(data) {
  const parsed = userPermissionPutSchema.safeParse(data);
  if (!parsed.success)
    throw {
      status: 422,
      message: "Invalid input",
      details: parsed.error.flatten().fieldErrors,
    };

  const existing = await UserPermissionService.getById(parsed.data.userPermissionId);
  if (!existing) throw { status: 404, message: "UserPermission not found" };

  if (
    parsed.data.userPermissionPermissionId !== existing.userPermissionPermissionId ||
    parsed.data.userPermissionUserId !== existing.userPermissionUserId
  ) {
    const duplicate = await UserPermissionValidator.isDuplicate(
      parsed.data.userPermissionPermissionId,
      parsed.data.userPermissionUserId
    );
    if (duplicate)
      throw { status: 409, message: "This Permission and User pair already exists" };
  }

  const updatedUserPermission = await UserPermissionService.update(parsed.data.userPermissionId, {
    userPermissionPermissionId: parsed.data.userPermissionPermissionId,
    userPermissionUserId: parsed.data.userPermissionUserId,
    userPermissionStatus: parsed.data.userPermissionStatus,
    userPermissionUpdatedBy: parsed.data.userPermissionUpdatedBy,
    userPermissionUpdatedAt: getLocalNow(),
  });

  return updatedUserPermission;
}

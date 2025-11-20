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
  const userPermissions = await UserPermissionService.getAllPaginated(
    skip,
    limit
  );
  const total = await UserPermissionService.countAll();
  return { userPermissions, total };
}

export async function GetUserPermissionByIdUseCase(userPermissionId) {
  if (!userPermissionId || typeof userPermissionId !== "string") {
    throw { status: 400, message: "Invalid userPermission ID" };
  }

  const userPermission = await UserPermissionService.getById(userPermissionId);
  if (!userPermission)
    throw { status: 404, message: "UserPermission not found" };

  return userPermission;
}

export async function CreateUserPermissionUseCase(data) {
  logger.info({
    message: "CreateUserPermissionUseCase start",
    userPermissionUserId: data?.userPermissionUserId,
    userPermissionPermissionId: data?.userPermissionPermissionId,
    userPermissionCreatedBy: data?.userPermissionCreatedBy,
  });

  const parsed = userPermissionPostSchema.safeParse(data);
  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;

    logger.warn({
      message: "CreateUserPermissionUseCase validation failed",
      errors: fieldErrors,
    });

    throw { status: 422, message: "Invalid input", details: fieldErrors };
  }

  const userId = parsed.data.userPermissionUserId.trim().toLowerCase();
  const permissionId = parsed.data.userPermissionPermissionId
    .trim()
    .toLowerCase();

  const duplicate = await UserPermissionValidator.isDuplicate(
    userId,
    permissionId
  );
  if (duplicate) {
    throw {
      status: 409,
      message: `UserPermission for this user & permission already exists`,
    };
  }

  try {
    const created = await UserPermissionService.create({
      ...parsed.data,
      userPermissionUserId: userId,
      userPermissionPermissionId: permissionId,
      userPermissionCreatedAt: getLocalNow(),
    });

    logger.info({
      message: "CreateUserPermissionUseCase success",
      userPermissionId: created.userPermissionId,
    });

    return created;
  } catch (error) {
    logger.error({ message: "CreateUserPermissionUseCase error", error });

    if (error.code === "P2002") {
      throw {
        status: 409,
        message: `UserPermission already exists`,
      };
    }
    throw error;
  }
}

export async function UpdateUserPermissionUseCase(data) {
  logger.info({
    message: "UpdateUserPermissionUseCase start",
    userPermissionId: data?.userPermissionId,
    userPermissionUserId: data?.userPermissionUserId,
    userPermissionPermissionId: data?.userPermissionPermissionId,
    userPermissionUpdatedBy: data?.userPermissionUpdatedBy,
  });

  const parsed = userPermissionPutSchema.safeParse(data);
  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;

    logger.warn({
      message: "UpdateUserPermissionUseCase validation failed",
      errors: fieldErrors,
    });

    throw { status: 422, message: "Invalid input", details: fieldErrors };
  }

  const existing = await UserPermissionService.getById(
    parsed.data.userPermissionId
  );
  if (!existing) {
    throw { status: 404, message: "UserPermission not found" };
  }

  const userId = parsed.data.userPermissionUserId.trim().toLowerCase();
  const permissionId = parsed.data.userPermissionPermissionId
    .trim()
    .toLowerCase();

  const existingUserId = existing.userPermissionUserId.trim().toLowerCase();
  const existingPermissionId = existing.userPermissionPermissionId
    .trim()
    .toLowerCase();

  if (userId !== existingUserId || permissionId !== existingPermissionId) {
    const duplicate = await UserPermissionValidator.isDuplicate(
      userId,
      permissionId
    );
    if (duplicate) {
      throw {
        status: 409,
        message: `UserPermission for this user & permission already exists`,
      };
    }
  }

  const { userPermissionId, ...rest } = parsed.data;

  try {
    const updated = await UserPermissionService.update(userPermissionId, {
      ...rest,
      userPermissionUserId: userId,
      userPermissionPermissionId: permissionId,
      userPermissionUpdatedAt: getLocalNow(),
    });

    logger.info({
      message: "UpdateUserPermissionUseCase success",
      userPermissionId,
    });

    return updated;
  } catch (error) {
    logger.error({ message: "UpdateUserPermissionUseCase error", error });

    if (error.code === "P2002") {
      throw {
        status: 409,
        message: `UserPermission already exists`,
      };
    }
    throw error;
  }
}

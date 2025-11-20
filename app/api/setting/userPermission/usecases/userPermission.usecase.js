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
  if (!userPermissionId || typeof userPermissionId !== "string") {
    throw { status: 400, message: "Invalid userPermission ID" };
  }

  const userPermission = await UserPermissionService.getById(userPermissionId);
  if (!userPermission) {
    throw { status: 404, message: "UserPermission not found" };
  }

  return userPermission;
}

export async function CreateUserPermissionUseCase(data) {
  logger.info({
    message: "CreateUserPermissionUseCase start",
    userPermissionUserId: data?.userPermissionUserId,
    userPermissionCreatedBy: data?.userPermissionCreatedBy,
  });

  const parsed = userPermissionPostSchema.safeParse(data);
  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;

    logger.warn({
      message: "CreateUserPermissionUseCase validation failed",
      errors: fieldErrors,
    });

    throw {
      status: 422,
      message: "Invalid input",
      details: fieldErrors,
    };
  }

  const normalizedUserPermissionUserId = parsed.data.userPermissionUserId.trim().toLowerCase();

  const duplicate = await UserPermissionValidator.isDuplicateUserPermissionUserId(normalizedUserPermissionUserId);
  if (duplicate) {
    logger.warn({
      message: "CreateUserPermissionUseCase duplicate userPermissionUserId",
      userPermissionUserId: normalizedUserPermissionUserId,
    });

    throw {
      status: 409,
      message: `userPermissionUserId '${normalizedUserPermissionUserId}' already exists`,
    };
  }

  try {
    const userPermission = await UserPermissionService.create({
      ...parsed.data,
      userPermissionUserId: normalizedUserPermissionUserId,
      userPermissionCreatedAt: getLocalNow(),
    });

    logger.info({
      message: "CreateUserPermissionUseCase success",
      userPermissionId: userPermission.userPermissionId,
    });

    return userPermission;
  } catch (error) {
    if (error && typeof error === "object" && error.code === "P2002") {
      logger.warn({
        message:
          "CreateUserPermissionUseCase unique constraint violation on userPermissionUserId (P2002)",
        userPermissionUserId: normalizedUserPermissionUserId,
      });

      throw {
        status: 409,
        message: `userPermissionUserId '${normalizedUserPermissionUserId}' already exists`,
      };
    }

    logger.error({
      message: "CreateUserPermissionUseCase error",
      error,
    });

    throw error;
  }
}

export async function UpdateUserPermissionUseCase(data) {
  logger.info({
    message: "UpdateUserPermissionUseCase start",
    userPermissionId: data?.userPermissionId,
    userPermissionUserId: data?.userPermissionUserId,
    userPermissionUpdatedBy: data?.userPermissionUpdatedBy,
  });

  const parsed = userPermissionPutSchema.safeParse(data);
  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;

    logger.warn({
      message: "UpdateUserPermissionUseCase validation failed",
      errors: fieldErrors,
    });

    throw {
      status: 422,
      message: "Invalid input",
      details: fieldErrors,
    };
  }

  const existing = await UserPermissionService.getById(parsed.data.userPermissionId);
  if (!existing) {
    logger.warn({
      message: "UpdateUserPermissionUseCase userPermission not found",
      userPermissionId: parsed.data.userPermissionId,
    });

    throw { status: 404, message: "UserPermission not found" };
  }

  const normalizedUserPermissionUserId = parsed.data.userPermissionUserId.trim().toLowerCase();
  const existingUserPermissionUserIdNormalized = existing.userPermissionUserId
    ? existing.userPermissionUserId.trim().toLowerCase()
    : "";

  if (normalizedUserPermissionUserId !== existingUserPermissionUserIdNormalized) {
    const duplicate = await UserPermissionValidator.isDuplicateUserPermissionUserId(normalizedUserPermissionUserId);
    if (duplicate) {
      logger.warn({
        message: "UpdateUserPermissionUseCase duplicate userPermissionUserId",
        userPermissionUserId: normalizedUserPermissionUserId,
      });

      throw {
        status: 409,
        message: `userPermissionUserId '${normalizedUserPermissionUserId}' already exists`,
      };
    }
  }

  const { userPermissionId, ...rest } = parsed.data;

  try {
    const updatedUserPermission = await UserPermissionService.update(userPermissionId, {
      ...rest,
      userPermissionUserId: normalizedUserPermissionUserId,
      userPermissionUpdatedAt: getLocalNow(),
    });

    logger.info({
      message: "UpdateUserPermissionUseCase success",
      userPermissionId,
    });

    return updatedUserPermission;
  } catch (error) {
    if (error && typeof error === "object" && error.code === "P2002") {
      logger.warn({
        message:
          "UpdateUserPermissionUseCase unique constraint violation on userPermissionUserId (P2002)",
        userPermissionUserId: normalizedUserPermissionUserId,
      });

      throw {
        status: 409,
        message: `userPermissionUserId '${normalizedUserPermissionUserId}' already exists`,
      };
    }

    logger.error({
      message: "UpdateUserPermissionUseCase error",
      error,
    });

    throw error;
  }
}

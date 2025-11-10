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
  logger.info({
    message: "GetAllUserPermissionUseCase start",
    page,
    limit,
    skip,
  });

  const userPermissions = await UserPermissionService.getAllPaginated(
    skip,
    limit
  );
  const total = await UserPermissionService.countAll();

  logger.info({
    message: "GetAllUserPermissionUseCase success",
    total,
    count: userPermissions.length,
  });

  return { userPermissions, total };
}

export async function GetUserPermissionByIdUseCase(userPermissionId) {
  logger.info({
    message: "GetUserPermissionByIdUseCase start",
    userPermissionId,
  });

  if (!userPermissionId || typeof userPermissionId !== "string") {
    logger.warn({
      message: "Invalid UserPermission ID",
      userPermissionId,
    });
    throw { status: 400, message: "Invalid UserPermission ID" };
  }

  const userPermission = await UserPermissionService.getById(userPermissionId);
  if (!userPermission) {
    logger.warn({
      message: "UserPermission not found",
      userPermissionId,
    });
    throw { status: 404, message: "UserPermission not found" };
  }

  logger.info({
    message: "GetUserPermissionByIdUseCase success",
    userPermissionId,
  });

  return userPermission;
}

export async function CreateUserPermissionUseCase(data) {
  logger.info({ message: "CreateUserPermissionUseCase start", data });

  const parsed = userPermissionPostSchema.safeParse(data);
  if (!parsed.success) {
    logger.warn({
      message: "UserPermission validation failed",
      errors: parsed.error.flatten().fieldErrors,
    });
    throw {
      status: 422,
      message: "Invalid input",
      details: parsed.error.flatten().fieldErrors,
    };
  }

  const duplicate = await UserPermissionValidator.isDuplicate(
    parsed.data.userPermissionPermissionId,
    parsed.data.userPermissionUserId
  );

  if (duplicate) {
    logger.warn({
      message: "Duplicate UserPermission pair detected",
      permissionId: parsed.data.userPermissionPermissionId,
      userId: parsed.data.userPermissionUserId,
    });
    throw {
      status: 409,
      message: "This Permission and User pair already exists",
    };
  }

  const userPermission = await UserPermissionService.create({
    userPermissionPermissionId: parsed.data.userPermissionPermissionId,
    userPermissionUserId: parsed.data.userPermissionUserId,
    userPermissionStatus: "Enable",
    userPermissionCreatedBy: parsed.data.userPermissionCreatedBy,
    userPermissionCreatedAt: getLocalNow(),
  });

  logger.info({
    message: "UserPermission created successfully",
    userPermissionId: userPermission.userPermissionId,
  });

  return userPermission;
}

export async function UpdateUserPermissionUseCase(data) {
  logger.info({ message: "UpdateUserPermissionUseCase start", data });

  const parsed = userPermissionPutSchema.safeParse(data);
  if (!parsed.success) {
    logger.warn({
      message: "UserPermission validation failed",
      errors: parsed.error.flatten().fieldErrors,
    });
    throw {
      status: 422,
      message: "Invalid input",
      details: parsed.error.flatten().fieldErrors,
    };
  }

  const existing = await UserPermissionService.getById(
    parsed.data.userPermissionId
  );
  if (!existing) {
    logger.warn({
      message: "UserPermission not found",
      userPermissionId: parsed.data.userPermissionId,
    });
    throw { status: 404, message: "UserPermission not found" };
  }

  if (
    parsed.data.userPermissionPermissionId !==
      existing.userPermissionPermissionId ||
    parsed.data.userPermissionUserId !== existing.userPermissionUserId
  ) {
    const duplicate = await UserPermissionValidator.isDuplicate(
      parsed.data.userPermissionPermissionId,
      parsed.data.userPermissionUserId
    );
    if (duplicate) {
      logger.warn({
        message: "Duplicate UserPermission pair detected on update",
        permissionId: parsed.data.userPermissionPermissionId,
        userId: parsed.data.userPermissionUserId,
      });
      throw {
        status: 409,
        message: "This Permission and User pair already exists",
      };
    }
  }

  const updatedUserPermission = await UserPermissionService.update(
    parsed.data.userPermissionId,
    {
      userPermissionPermissionId: parsed.data.userPermissionPermissionId,
      userPermissionUserId: parsed.data.userPermissionUserId,
      userPermissionStatus: parsed.data.userPermissionStatus,
      userPermissionUpdatedBy: parsed.data.userPermissionUpdatedBy,
      userPermissionUpdatedAt: getLocalNow(),
    }
  );

  logger.info({
    message: "UserPermission updated successfully",
    userPermissionId: parsed.data.userPermissionId,
  });

  return updatedUserPermission;
}

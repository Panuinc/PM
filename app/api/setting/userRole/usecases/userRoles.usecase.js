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
  logger.info({
    message: "GetAllUserRoleUseCase start",
    page,
    limit,
    skip,
  });

  const userRoles = await UserRoleService.getAllPaginated(skip, limit);
  const total = await UserRoleService.countAll();

  logger.info({
    message: "GetAllUserRoleUseCase success",
    total,
    count: userRoles.length,
  });

  return { userRoles, total };
}

export async function GetUserRoleByIdUseCase(userRoleId) {
  logger.info({
    message: "GetUserRoleByIdUseCase start",
    userRoleId,
  });

  if (!userRoleId || typeof userRoleId !== "string") {
    logger.warn({
      message: "Invalid UserRole ID",
      userRoleId,
    });
    throw { status: 400, message: "Invalid UserRole ID" };
  }

  const userRole = await UserRoleService.getById(userRoleId);
  if (!userRole) {
    logger.warn({
      message: "UserRole not found",
      userRoleId,
    });
    throw { status: 404, message: "UserRole not found" };
  }

  logger.info({
    message: "GetUserRoleByIdUseCase success",
    userRoleId,
  });

  return userRole;
}

export async function CreateUserRoleUseCase(data) {
  logger.info({ message: "CreateUserRoleUseCase start", data });

  const parsed = userRolePostSchema.safeParse(data);
  if (!parsed.success) {
    logger.warn({
      message: "UserRole validation failed",
      errors: parsed.error.flatten().fieldErrors,
    });
    throw {
      status: 422,
      message: "Invalid input",
      details: parsed.error.flatten().fieldErrors,
    };
  }

  const duplicate = await UserRoleValidator.isDuplicate(
    parsed.data.userRoleRoleId,
    parsed.data.userRoleUserId
  );

  if (duplicate) {
    logger.warn({
      message: "Duplicate UserRole pair detected",
      roleId: parsed.data.userRoleRoleId,
      userId: parsed.data.userRoleUserId,
    });
    throw { status: 409, message: "This Role and User pair already exists" };
  }

  const userRole = await UserRoleService.create({
    userRoleRoleId: parsed.data.userRoleRoleId,
    userRoleUserId: parsed.data.userRoleUserId,
    userRoleStatus: "Enable",
    userRoleCreatedBy: parsed.data.userRoleCreatedBy,
    userRoleCreatedAt: getLocalNow(),
  });

  logger.info({
    message: "UserRole created successfully",
    userRoleId: userRole.userRoleId,
  });

  return userRole;
}

export async function UpdateUserRoleUseCase(data) {
  logger.info({ message: "UpdateUserRoleUseCase start", data });

  const parsed = userRolePutSchema.safeParse(data);
  if (!parsed.success) {
    logger.warn({
      message: "UserRole validation failed",
      errors: parsed.error.flatten().fieldErrors,
    });
    throw {
      status: 422,
      message: "Invalid input",
      details: parsed.error.flatten().fieldErrors,
    };
  }

  const existing = await UserRoleService.getById(parsed.data.userRoleId);
  if (!existing) {
    logger.warn({
      message: "UserRole not found",
      userRoleId: parsed.data.userRoleId,
    });
    throw { status: 404, message: "UserRole not found" };
  }

  if (
    parsed.data.userRoleRoleId !== existing.userRoleRoleId ||
    parsed.data.userRoleUserId !== existing.userRoleUserId
  ) {
    const duplicate = await UserRoleValidator.isDuplicate(
      parsed.data.userRoleRoleId,
      parsed.data.userRoleUserId
    );
    if (duplicate) {
      logger.warn({
        message: "Duplicate UserRole pair detected on update",
        roleId: parsed.data.userRoleRoleId,
        userId: parsed.data.userRoleUserId,
      });
      throw { status: 409, message: "This Role and User pair already exists" };
    }
  }

  const updatedUserRole = await UserRoleService.update(parsed.data.userRoleId, {
    userRoleRoleId: parsed.data.userRoleRoleId,
    userRoleUserId: parsed.data.userRoleUserId,
    userRoleStatus: parsed.data.userRoleStatus,
    userRoleUpdatedBy: parsed.data.userRoleUpdatedBy,
    userRoleUpdatedAt: getLocalNow(),
  });

  logger.info({
    message: "UserRole updated successfully",
    userRoleId: parsed.data.userRoleId,
  });

  return updatedUserRole;
}

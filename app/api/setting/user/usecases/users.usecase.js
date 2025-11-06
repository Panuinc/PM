import { UserService } from "@/app/api/setting/user/core/user.service";
import {
  userPostSchema,
  userPutSchema,
} from "@/app/api/setting/user/core/user.schema";
import { UserValidator } from "@/app/api/setting/user/core/user.validator";
import { getLocalNow } from "@/lib/getLocalNow";
import logger from "@/lib/logger.node";

export async function GetAllUserUseCase(page = 1, limit = 1000000) {
  const skip = (page - 1) * limit;
  const users = await UserService.getAllPaginated(skip, limit);
  const total = await UserService.countAll();

  logger.info({ message: "GetAllUserUseCase success", total });
  return { users, total };
}

export async function GetUserByIdUseCase(userId) {
  if (!userId || typeof userId !== "string")
    throw { status: 400, message: "Invalid user ID" };

  const user = await UserService.getById(userId);
  if (!user) throw { status: 404, message: "User not found" };

  logger.info({ message: "GetUserByIdUseCase success", userId });
  return user;
}

export async function CreateUserUseCase(data) {
  logger.info({ message: "CreateUserUseCase start", data });

  const parsed = userPostSchema.safeParse(data);
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

  const duplicate = await UserValidator.isDuplicateUserName(
    parsed.data.userName
  );
  if (duplicate)
    throw {
      status: 409,
      message: `User '${parsed.data.userName}' already exists`,
    };

  const user = await UserService.create({
    userName: parsed.data.userName.trim(),
    userCreatedBy: parsed.data.userCreatedBy,
    userCreatedAt: getLocalNow(),
  });

  logger.info({
    message: "User created successfully",
    userId: user.userId,
  });

  return user;
}

export async function UpdateUserUseCase(data) {
  logger.info({ message: "UpdateUserUseCase start", data });

  const parsed = userPutSchema.safeParse(data);
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

  const existing = await UserService.getById(parsed.data.userId);
  if (!existing) throw { status: 404, message: "User not found" };

  if (
    parsed.data.userName.trim().toLowerCase() !==
    existing.userName.trim().toLowerCase()
  ) {
    const duplicate = await UserValidator.isDuplicateUserName(
      parsed.data.userName
    );
    if (duplicate)
      throw {
        status: 409,
        message: `User '${parsed.data.userName}' already exists`,
      };
  }

  const updatedUser = await UserService.update(
    parsed.data.userId,
    {
      userName: parsed.data.userName.trim(),
      userStatus: parsed.data.userStatus.trim(),
      userUpdatedBy: parsed.data.userUpdatedBy,
      userUpdatedAt: getLocalNow(),
    }
  );

  logger.info({
    message: "User updated successfully",
    userId: parsed.data.userId,
  });

  return updatedUser;
}

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

  return { users, total };
}

export async function GetUserByIdUseCase(userId) {
  if (!userId || typeof userId !== "string") {
    throw { status: 400, message: "Invalid user ID" };
  }

  const user = await UserService.getById(userId);
  if (!user) {
    throw { status: 404, message: "User not found" };
  }

  return user;
}

export async function CreateUserUseCase(data) {
  logger.info({
    message: "CreateUserUseCase start",
    userEmail: data?.userEmail,
    userCreatedBy: data?.userCreatedBy,
  });

  const parsed = userPostSchema.safeParse(data);
  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;

    logger.warn({
      message: "CreateUserUseCase validation failed",
      errors: fieldErrors,
    });

    throw {
      status: 422,
      message: "Invalid input",
      details: fieldErrors,
    };
  }

  const normalizedEmail = parsed.data.userEmail.trim().toLowerCase();

  const duplicate = await UserValidator.isDuplicateEmail(normalizedEmail);
  if (duplicate) {
    logger.warn({
      message: "CreateUserUseCase duplicate email",
      userEmail: normalizedEmail,
    });

    throw {
      status: 409,
      message: `userEmail '${normalizedEmail}' already exists`,
    };
  }

  try {
    const user = await UserService.create({
      ...parsed.data,
      userEmail: normalizedEmail,
      userCreatedAt: getLocalNow(),
    });

    logger.info({
      message: "CreateUserUseCase success",
      userId: user.userId,
    });

    return user;
  } catch (error) {
    if (error && typeof error === "object" && error.code === "P2002") {
      logger.warn({
        message:
          "CreateUserUseCase unique constraint violation on userEmail (P2002)",
        userEmail: normalizedEmail,
      });

      throw {
        status: 409,
        message: `userEmail '${normalizedEmail}' already exists`,
      };
    }

    logger.error({
      message: "CreateUserUseCase error",
      error,
    });

    throw error;
  }
}

export async function UpdateUserUseCase(data) {
  logger.info({
    message: "UpdateUserUseCase start",
    userId: data?.userId,
    userEmail: data?.userEmail,
    userUpdatedBy: data?.userUpdatedBy,
  });

  const parsed = userPutSchema.safeParse(data);
  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;

    logger.warn({
      message: "UpdateUserUseCase validation failed",
      errors: fieldErrors,
    });

    throw {
      status: 422,
      message: "Invalid input",
      details: fieldErrors,
    };
  }

  const existing = await UserService.getById(parsed.data.userId);
  if (!existing) {
    logger.warn({
      message: "UpdateUserUseCase user not found",
      userId: parsed.data.userId,
    });

    throw { status: 404, message: "User not found" };
  }

  const normalizedEmail = parsed.data.userEmail.trim().toLowerCase();
  const existingEmailNormalized = existing.userEmail
    ? existing.userEmail.trim().toLowerCase()
    : "";

  if (normalizedEmail !== existingEmailNormalized) {
    const duplicate = await UserValidator.isDuplicateEmail(normalizedEmail);
    if (duplicate) {
      logger.warn({
        message: "UpdateUserUseCase duplicate email",
        userEmail: normalizedEmail,
      });

      throw {
        status: 409,
        message: `userEmail '${normalizedEmail}' already exists`,
      };
    }
  }

  const { userId, ...rest } = parsed.data;

  try {
    const updatedUser = await UserService.update(userId, {
      ...rest,
      userEmail: normalizedEmail,
      userUpdatedAt: getLocalNow(),
    });

    logger.info({
      message: "UpdateUserUseCase success",
      userId,
    });

    return updatedUser;
  } catch (error) {
    if (error && typeof error === "object" && error.code === "P2002") {
      logger.warn({
        message:
          "UpdateUserUseCase unique constraint violation on userEmail (P2002)",
        userEmail: normalizedEmail,
      });

      throw {
        status: 409,
        message: `userEmail '${normalizedEmail}' already exists`,
      };
    }

    logger.error({
      message: "UpdateUserUseCase error",
      error,
    });

    throw error;
  }
}

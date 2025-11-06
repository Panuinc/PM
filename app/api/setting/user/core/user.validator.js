import { UserRepository } from "@/app/api/setting/user/core/user.repository";
import logger from "@/lib/logger.node";

export const UserValidator = {
  async isDuplicateUserName(userName) {
    logger.info({
      message: "UserValidator.isDuplicateUserName",
      userName,
    });

    if (!userName || typeof userName !== "string") {
      logger.warn({ message: "Invalid user code input", userName });
      throw new Error("Invalid user code");
    }

    const existing = await UserRepository.findByUserName(userName);
    const isDuplicate = !!existing;

    if (isDuplicate)
      logger.warn({
        message: "Duplicate user code detected",
        userName,
      });
    else logger.info({ message: "User code available", userName });

    return isDuplicate;
  },
};

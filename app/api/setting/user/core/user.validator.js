import { UserRepository } from "@/app/api/setting/user/core/user.repository";
import logger from "@/lib/logger.node";

export const UserValidator = {
  async isDuplicateEmail(userEmail) {
    logger.info({
      message: "UserValidator.isDuplicateEmail",
      userEmail,
    });

    if (!userEmail || typeof userEmail !== "string") {
      logger.warn({ message: "Invalid email input", userEmail });
      throw new Error("Invalid email");
    }

    const existing = await UserRepository.findByEmail(userEmail);
    const isDuplicate = !!existing;

    if (isDuplicate)
      logger.warn({
        message: "Duplicate email detected",
        userEmail,
      });
    else logger.info({ message: "Email available", userEmail });

    return isDuplicate;
  },
};

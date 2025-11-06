import { RoleRepository } from "@/app/api/setting/role/core/role.repository";
import logger from "@/lib/logger.node";

export const RoleValidator = {
  async isDuplicateRoleName(roleName) {
    logger.info({
      message: "RoleValidator.isDuplicateRoleName",
      roleName,
    });

    if (!roleName || typeof roleName !== "string") {
      logger.warn({ message: "Invalid role code input", roleName });
      throw new Error("Invalid role code");
    }

    const existing = await RoleRepository.findByRoleName(roleName);
    const isDuplicate = !!existing;

    if (isDuplicate)
      logger.warn({
        message: "Duplicate role code detected",
        roleName,
      });
    else logger.info({ message: "Role code available", roleName });

    return isDuplicate;
  },
};

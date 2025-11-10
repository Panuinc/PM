import { UserRoleRepository } from "@/app/api/setting/userRole/core/userRole.repository";
import logger from "@/lib/logger.node";

export const UserRoleValidator = {
  async isDuplicate(userRoleRoleId, userRoleUserId) {
    logger.info({
      message: "UserRoleValidator.isDuplicate",
      userRoleRoleId,
      userRoleUserId,
    });

    const existing = await UserRoleRepository.findDuplicate(
      userRoleRoleId,
      userRoleUserId
    );
    const isDuplicate = !!existing;

    if (isDuplicate)
      logger.warn({
        message: "Duplicate UserRole pair detected",
        userRoleRoleId,
        userRoleUserId,
      });
    else logger.info({ message: "UserRole pair available" });

    return isDuplicate;
  },
};

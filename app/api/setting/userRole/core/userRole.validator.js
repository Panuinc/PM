import { UserRoleRepository } from "@/app/api/setting/userRole/core/userRole.repository";
import logger from "@/lib/logger.node";

export const UserRoleValidator = {
  async isDuplicate(userRoleRoleId, userUserRoleId) {
    logger.info({
      message: "UserRoleValidator.isDuplicate",
      userRoleRoleId,
      userUserRoleId,
    });

    const existing = await UserRoleRepository.findDuplicate(
      userRoleRoleId,
      userUserRoleId
    );
    const isDuplicate = !!existing;

    if (isDuplicate)
      logger.warn({
        message: "Duplicate UserRole pair detected",
        userRoleRoleId,
        userUserRoleId,
      });
    else logger.info({ message: "UserRole pair available" });

    return isDuplicate;
  },
};

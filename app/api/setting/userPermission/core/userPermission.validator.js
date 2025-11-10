import { UserPermissionRepository } from "@/app/api/setting/userPermission/core/userPermission.repository";
import logger from "@/lib/logger.node";

export const UserPermissionValidator = {
  async isDuplicate(userPermissionPermissionId, userPermissionUserId) {
    logger.info({
      message: "UserPermissionValidator.isDuplicate",
      userPermissionPermissionId,
      userPermissionUserId,
    });

    const existing = await UserPermissionRepository.findDuplicate(
      userPermissionPermissionId,
      userPermissionUserId
    );
    const isDuplicate = !!existing;

    if (isDuplicate)
      logger.warn({
        message: "Duplicate UserPermission pair detected",
        userPermissionPermissionId,
        userPermissionUserId,
      });
    else logger.info({ message: "UserPermission pair available" });

    return isDuplicate;
  },
};

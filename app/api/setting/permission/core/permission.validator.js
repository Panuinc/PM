import { PermissionRepository } from "@/app/api/setting/permission/core/permission.repository";
import logger from "@/lib/logger.node";

export const PermissionValidator = {
  async isDuplicatePermissionKey(permissionKey) {
    logger.info({
      message: "PermissionValidator.isDuplicatePermissionKey",
      permissionKey,
    });

    if (!permissionKey || typeof permissionKey !== "string") {
      logger.warn({ message: "Invalid permission key input", permissionKey });
      throw new Error("Invalid permission key");
    }

    const existing = await PermissionRepository.findByPermissionKey(
      permissionKey
    );
    const isDuplicate = !!existing;

    if (isDuplicate)
      logger.warn({
        message: "Duplicate permission key detected",
        permissionKey,
      });
    else logger.info({ message: "Permission key available", permissionKey });

    return isDuplicate;
  },
};

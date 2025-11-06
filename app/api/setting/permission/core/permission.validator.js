import { PermissionRepository } from "@/app/api/setting/permission/core/permission.repository";
import logger from "@/lib/logger.node";

export const PermissionValidator = {
  async isDuplicatePermissionName(permissionName) {
    logger.info({
      message: "PermissionValidator.isDuplicatePermissionName",
      permissionName,
    });

    if (!permissionName || typeof permissionName !== "string") {
      logger.warn({ message: "Invalid permission code input", permissionName });
      throw new Error("Invalid permission code");
    }

    const existing = await PermissionRepository.findByPermissionName(permissionName);
    const isDuplicate = !!existing;

    if (isDuplicate)
      logger.warn({
        message: "Duplicate permission code detected",
        permissionName,
      });
    else logger.info({ message: "Permission code available", permissionName });

    return isDuplicate;
  },
};

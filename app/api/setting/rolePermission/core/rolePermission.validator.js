import { RolePermissionRepository } from "@/app/api/setting/rolePermission/core/rolePermission.repository";
import logger from "@/lib/logger.node";

export const RolePermissionValidator = {
  async isDuplicateRolePermissionName(rolePermissionName) {
    logger.info({
      message: "RolePermissionValidator.isDuplicateRolePermissionName",
      rolePermissionName,
    });

    if (!rolePermissionName || typeof rolePermissionName !== "string") {
      logger.warn({ message: "Invalid rolePermission name input", rolePermissionName });
      throw new Error("Invalid rolePermission name");
    }

    const existing = await RolePermissionRepository.findByRolePermissionName(rolePermissionName);
    const isDuplicate = !!existing;

    if (isDuplicate)
      logger.warn({
        message: "Duplicate rolePermission name detected",
        rolePermissionName,
      });
    else logger.info({ message: "RolePermission name available", rolePermissionName });

    return isDuplicate;
  },
};

import { RolePermissionRepository } from "@/app/api/setting/rolePermission/core/rolePermission.repository";
import logger from "@/lib/logger.node";

export const RolePermissionValidator = {
  async isDuplicate(rolePermissionRoleId, rolePermissionPermissionId) {
    logger.info({
      message: "RolePermissionValidator.isDuplicate",
      rolePermissionRoleId,
      rolePermissionPermissionId,
    });

    const existing = await RolePermissionRepository.findDuplicate(
      rolePermissionRoleId,
      rolePermissionPermissionId
    );
    const isDuplicate = !!existing;

    if (isDuplicate)
      logger.warn({
        message: "Duplicate RolePermission pair detected",
        rolePermissionRoleId,
        rolePermissionPermissionId,
      });
    else logger.info({ message: "RolePermission pair available" });

    return isDuplicate;
  },
};

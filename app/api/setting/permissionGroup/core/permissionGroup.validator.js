import { PermissionGroupRepository } from "./permissionGroup.repository";
import logger from "@/lib/logger.node";

export const PermissionGroupValidator = {
  async isDuplicatePermissionGroupName(permissionGroupName) {
    logger.info({
      message: "PermissionGroupValidator.isDuplicatePermissionGroupName",
      permissionGroupName,
    });

    if (!permissionGroupName || typeof permissionGroupName !== "string")
      throw new Error("Invalid permissionGroup name");

    const existing = await PermissionGroupRepository.findByPermissionGroupName(
      permissionGroupName
    );
    return !!existing;
  },
};

import { PermissionGroupRepository } from "./permissionGroup.repository";
import logger from "@/lib/logger.node";

export const PermissionGroupValidator = {
  async isDuplicatePermissionGroupName(permissionGroupName) {
    logger.info({
      message: "PermissionGroupValidator.isDuplicatePermissionGroupName",
      permissionGroupName,
    });

    if (!permissionGroupName || typeof permissionGroupName !== "string") {
      logger.warn({
        message: "Invalid permissionGroup name input",
        permissionGroupName,
      });

      throw new Error("Invalid permissionGroup name");
    }

    const existing = await PermissionGroupRepository.findByPermissionGroupName(
      permissionGroupName
    );

    const isDuplicate = !!existing;

    if (isDuplicate)
      logger.warn({
        message: "Duplicate permissionGroup name detected",
        permissionGroupName,
      });
    else
      logger.info({
        message: "PermissionGroup name available",
        permissionGroupName,
      });

    return isDuplicate;
  },
};

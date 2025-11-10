import { z } from "zod";
import { preprocessString, preprocessEnum, formatData } from "@/lib/zodSchema";
import logger from "@/lib/logger.node";

logger.info({ message: "UserPermission schema loaded" });

export const userPermissionPostSchema = z.object({
  userPermissionUserId: preprocessString("Please provide the User ID"),
  userPermissionPermissionId: preprocessString("Please provide the Permission ID"),
  userPermissionCreatedBy: preprocessString("Please provide the creator ID"),
});

export const userPermissionPutSchema = z.object({
  userPermissionId: preprocessString("Please provide the UserPermission ID"),
  userPermissionUserId: preprocessString("Please provide the User ID"),
  userPermissionPermissionId: preprocessString("Please provide the Permission ID"),
  userPermissionStatus: preprocessEnum(
    ["Enable", "Disable"],
    "Please provide status"
  ),
  userPermissionUpdatedBy: preprocessString("Please provide the updater ID"),
});

export const formatUserPermissionData = (userPermissions) => {
  logger.info({ message: "Formatting userPermission data", count: userPermissions.length });
  return formatData(userPermissions, ["userPermissionCreatedAt", "userPermissionUpdatedAt"], []);
};

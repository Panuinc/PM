import { z } from "zod";
import { preprocessString, preprocessEnum, formatData } from "@/lib/zodSchema";
import logger from "@/lib/logger.node";

logger.info({ message: "Permission schema loaded" });

export const permissionPostSchema = z.object({
  permissionName: preprocessString("Please provide the permission name"),
  permissionKey: preprocessString("Please provide the permission key"),
  permissionCreatedBy: preprocessString("Please provide the creator ID"),
});

export const permissionPutSchema = z.object({
  permissionId: preprocessString("Please provide the permission ID"),
  permissionName: preprocessString("Please provide the permission name"),
  permissionKey: preprocessString("Please provide the permission key"),
  permissionStatus: preprocessEnum(
    ["Enable", "Disable"],
    "Please provide permission status'"
  ),
  permissionUpdatedBy: preprocessString("Please provide the updater ID"),
});

export const formatPermissionData = (permissions) => {
  logger.info({
    message: "Formatting permission data",
    count: permissions.length,
  });
  return formatData(
    permissions,
    ["permissionCreatedAt", "permissionUpdatedAt"],
    []
  );
};

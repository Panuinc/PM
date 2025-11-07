import { z } from "zod";
import { preprocessString, preprocessEnum, formatData } from "@/lib/zodSchema";
import logger from "@/lib/logger.node";

logger.info({ message: "RolePermission schema loaded" });

export const rolePermissionPostSchema = z.object({
  rolePermissionRoleId: preprocessString("Please provide the Role ID"),
  rolePermissionPermissionId: preprocessString(
    "Please provide the Permission ID"
  ),
  rolePermissionCreatedBy: preprocessString("Please provide the creator ID"),
});

export const rolePermissionPutSchema = z.object({
  rolePermissionId: preprocessString("Please provide the RolePermission ID"),
  rolePermissionRoleId: preprocessString("Please provide the Role ID"),
  rolePermissionPermissionId: preprocessString(
    "Please provide the Permission ID"
  ),
  rolePermissionStatus: preprocessEnum(
    ["Enable", "Disable"],
    "Please provide status"
  ),
  rolePermissionUpdatedBy: preprocessString("Please provide the updater ID"),
});

export const formatRolePermissionData = (rolePermissions) => {
  logger.info({
    message: "Formatting rolePermission data",
    count: rolePermissions.length,
  });
  return formatData(
    rolePermissions,
    ["rolePermissionCreatedAt", "rolePermissionUpdatedAt"],
    []
  );
};

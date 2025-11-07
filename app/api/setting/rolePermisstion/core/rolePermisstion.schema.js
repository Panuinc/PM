import { z } from "zod";
import { preprocessString, preprocessEnum, formatData } from "@/lib/zodSchema";
import logger from "@/lib/logger.node";

logger.info({ message: "RolePermission schema loaded" });

export const rolePermissionPostSchema = z.object({
  rolePermissionName: preprocessString("Please provide the rolePermission name"),
  rolePermissionCreatedBy: preprocessString("Please provide the creator ID"),
});

export const rolePermissionPutSchema = z.object({
  rolePermissionId: preprocessString("Please provide the rolePermission ID"),
  rolePermissionName: preprocessString("Please provide the rolePermission name"),
  rolePermissionStatus: preprocessEnum(
    ["Enable", "Disable"],
    "Please provide rolePermission status'"
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

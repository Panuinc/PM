import { z } from "zod";
import { preprocessString, formatData } from "@/lib/zodSchema";
import logger from "@/lib/logger.node";

logger.info({ message: "PermissionGroup schema loaded" });

export const permissionGroupPostSchema = z.object({
  permissionGroupName: preprocessString(
    "Please provide the permissionGroup name"
  ),
  permissionGroupOrder: z.coerce.number().default(0),
});

export const permissionGroupPutSchema = z.object({
  permissionGroupId: preprocessString("Please provide the permissionGroup ID"),
  permissionGroupName: preprocessString(
    "Please provide the permissionGroup name"
  ),
  permissionGroupOrder: z.coerce.number().default(0),
});

export const formatPermissionGroupData = (permissionGroups) => {
  logger.info({
    message: "Formatting permissionGroup data",
    count: permissionGroups.length,
  });
  return permissionGroups;
};

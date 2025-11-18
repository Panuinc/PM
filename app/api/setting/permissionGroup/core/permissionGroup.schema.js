import { z } from "zod";
import { preprocessString, formatData } from "@/lib/zodSchema";
import logger from "@/lib/logger.node";

logger.info({ message: "PermissionGroup schema loaded" });

export const permissionGroupPostSchema = z.object({
  permissionGroupName: preprocessString(
    "Please provide the permissionGroup name"
  ),
  permissionGroupOrder: z.preprocess(
    (v) => (v === undefined || v === null ? 0 : Number(v)),
    z.number().int().min(0)
  ),
  permissionGroupCreatedBy: preprocessString("Please provide the creator ID"),
});

export const permissionGroupPutSchema = z.object({
  permissionGroupId: preprocessString("Please provide the permissionGroup ID"),
  permissionGroupName: preprocessString(
    "Please provide the permissionGroup name"
  ),
  permissionGroupOrder: z.preprocess(
    (v) => (v === undefined || v === null ? 0 : Number(v)),
    z.number().int().min(0)
  ),
  permissionGroupUpdatedBy: preprocessString("Please provide the updater ID"),
});

export const formatPermissionGroupData = (permissionGroups) => {
  logger.info({
    message: "Formatting permissionGroup data",
    count: permissionGroups.length,
  });

  return formatData(permissionGroups, [
    "permissionGroupCreatedAt",
    "permissionGroupUpdatedAt",
  ]);
};

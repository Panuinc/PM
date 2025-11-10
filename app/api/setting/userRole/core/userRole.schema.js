import { z } from "zod";
import { preprocessString, preprocessEnum, formatData } from "@/lib/zodSchema";
import logger from "@/lib/logger.node";

logger.info({ message: "UserRole schema loaded" });

export const userRolePostSchema = z.object({
  userRoleRoleId: preprocessString("Please provide the Role ID"),
  userUserRoleId: preprocessString(
    "Please provide the Permission ID"
  ),
  userRoleCreatedBy: preprocessString("Please provide the creator ID"),
});

export const userRolePutSchema = z.object({
  userRoleId: preprocessString("Please provide the UserRole ID"),
  userRoleRoleId: preprocessString("Please provide the Role ID"),
  userUserRoleId: preprocessString(
    "Please provide the Permission ID"
  ),
  userRoleStatus: preprocessEnum(
    ["Enable", "Disable"],
    "Please provide status"
  ),
  userRoleUpdatedBy: preprocessString("Please provide the updater ID"),
});

export const formatUserRoleData = (userRoles) => {
  logger.info({
    message: "Formatting userRole data",
    count: userRoles.length,
  });
  return formatData(
    userRoles,
    ["userRoleCreatedAt", "userRoleUpdatedAt"],
    []
  );
};

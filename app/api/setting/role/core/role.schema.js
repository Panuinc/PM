import { z } from "zod";
import { preprocessString, preprocessEnum, formatData } from "@/lib/zodSchema";
import logger from "@/lib/logger.node";

logger.info({ message: "Role schema loaded" });

export const rolePostSchema = z.object({
  roleName: preprocessString("Please provide the role name"),
  roleCreatedBy: preprocessString("Please provide the creator ID"),
});

export const rolePutSchema = z.object({
  roleId: preprocessString("Please provide the role ID"),
  roleName: preprocessString("Please provide the role name"),
  roleStatus: preprocessEnum(
    ["Enable", "Disable"],
    "Please provide role status'"
  ),
  roleUpdatedBy: preprocessString("Please provide the updater ID"),
});

export const formatRoleData = (roles) => {
  logger.info({
    message: "Formatting role data",
    count: roles.length,
  });
  return formatData(
    roles,
    ["roleCreatedAt", "roleUpdatedAt"],
    []
  );
};

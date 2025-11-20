import { z } from "zod";
import {
  preprocessString,
  preprocessEnum,
  formatData,
} from "@/lib/zodSchema";

export const userPermissionPostSchema = z.object({
  userPermissionUserId: preprocessString("Please provide userPermissionUserId"),
  userPermissionCreatedBy: preprocessString("Please provide the creator ID"),
});

export const userPermissionPutSchema = z.object({
  userPermissionId: preprocessString("Please provide the userPermission ID"),
  userPermissionUserId: preprocessString("Please userPermissionUserId"),
  userPermissionStatus: preprocessEnum(
    ["Enable", "Disable"],
    "Please provide userPermissionStatus"
  ),
  userPermissionUpdatedBy: preprocessString("Please provide the updater ID"),
});

export const formatUserPermissionData = (userPermissions) => {
  return formatData(
    userPermissions,
    ["userPermissionCreatedAt", "userPermissionUpdatedAt"],
    []
  );
};

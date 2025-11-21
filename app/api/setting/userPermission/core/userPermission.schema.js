import { z } from "zod";
import { preprocessString } from "@/lib/zodSchema";

export const userPermissionAssignSchema = z.object({
  userPermissionUserId: preprocessString("Please provide the user ID"),
  permissionIds: z
    .array(preprocessString("Please provide permission ID"))
    .optional()
    .default([]),
  userPermissionUpdatedBy: preprocessString("Please provide the updater ID"),
});

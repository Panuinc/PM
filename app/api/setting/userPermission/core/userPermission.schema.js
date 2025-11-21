import { z } from "zod";

function preprocessString(message) {
  return z.preprocess(
    (value) => (typeof value === "string" ? value.trim() : value),
    z.string({ required_error: message })
  );
}

export const userPermissionAssignSchema = z.object({
  userPermissionUserId: preprocessString("Please provide user ID"),
  permissionIds: z.array(preprocessString("Please provide permission ID"))
    .optional()
    .default([]),
  userPermissionUpdatedBy: preprocessString("Please provide updater ID"),
});

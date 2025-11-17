import { z } from "zod";
import logger from "@/lib/logger.node";

logger.info({ message: "UserPermissionMatrix schema loaded" });

export const userPermissionMatrixSchema = z.object({
  matrix: z.array(
    z.object({
      userId: z.string().min(1, "Missing userId"),
      permissions: z.array(
        z.object({
          permissionId: z.string().min(1, "Missing permissionId"),
          hasPermission: z.boolean(),
        })
      ),
    })
  ),
  updaterId: z.string().min(1, "Missing updaterId"),
});

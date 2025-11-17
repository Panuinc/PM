import { userPermissionMatrixSchema } from "./userPermissionMatrix.schema";
import logger from "@/lib/logger.node";

export const UserPermissionMatrixValidator = {
  validateMatrix(data) {
    logger.info({
      message: "UserPermissionMatrixValidator.validateMatrix start",
    });

    const parsed = userPermissionMatrixSchema.safeParse(data);
    if (!parsed.success) {
      logger.warn({
        message: "UserPermissionMatrixValidator.validateMatrix failed",
        errors: parsed.error.flatten().fieldErrors,
      });
      throw {
        status: 422,
        message: "Invalid matrix data",
        details: parsed.error.flatten().fieldErrors,
      };
    }

    logger.info({
      message: "UserPermissionMatrixValidator.validateMatrix success",
      matrixCount: parsed.data.matrix.length,
    });

    return parsed.data;
  },
};

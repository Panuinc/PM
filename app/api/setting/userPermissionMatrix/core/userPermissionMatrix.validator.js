import { userPermissionMatrixSchema } from "./userPermissionMatrix.schema";

export const UserPermissionMatrixValidator = {
  validateMatrix(data) {
    const parsed = userPermissionMatrixSchema.safeParse(data);
    if (!parsed.success) {
      throw {
        status: 422,
        message: "Invalid matrix data",
        details: parsed.error.flatten().fieldErrors,
      };
    }
    return parsed.data;
  },
};

import { UserPermissionRepository } from "@/app/api/setting/userPermission/core/userPermission.repository";

export const UserPermissionValidator = {
  async isDuplicateUserPermissionUserId(userPermissionUserId) {
    if (!userPermissionUserId || typeof userPermissionUserId !== "string") {
      throw {
        status: 400,
        message: "Invalid userPermissionUserId",
      };
    }

    const existing = await UserPermissionRepository.findByUserPermissionUserId(userPermissionUserId);
    return !!existing;
  },
};

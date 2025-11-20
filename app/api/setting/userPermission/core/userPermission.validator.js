import { UserPermissionRepository } from "@/app/api/setting/userPermission/core/userPermission.repository";

export const UserPermissionValidator = {
  async isDuplicate(userPermissionUserId, userPermissionPermissionId) {
    if (!userPermissionUserId || !userPermissionPermissionId) {
      throw { status: 400, message: "Invalid userPermission keys" };
    }

    const existing = await UserPermissionRepository.findByUniquePair(
      userPermissionUserId.trim().toLowerCase(),
      userPermissionPermissionId.trim().toLowerCase()
    );

    return !!existing;
  },
};

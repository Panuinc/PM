import { UserPermissionRepository } from "@/app/api/setting/userPermission/core/userPermission.repository";

export class UserPermissionService {
  static getByUserId(userId) {
    return UserPermissionRepository.getByUserId(userId);
  }

  static deleteManyByUserAndPermissionIdsNotIn(userId, ids) {
    return UserPermissionRepository.deleteManyByUserAndPermissionIdsNotIn(
      userId,
      ids
    );
  }

  static getPermissionsWithAssignmentForUser(userId) {
    return UserPermissionRepository.getPermissionsWithAssignmentForUser(userId);
  }

  static create(data) {
    return UserPermissionRepository.create({ ...data });
  }
}

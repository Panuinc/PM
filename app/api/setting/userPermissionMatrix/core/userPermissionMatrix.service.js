import { UserPermissionMatrixRepository } from "./userPermissionMatrix.repository";

export class UserPermissionMatrixService {
  static async getAllUsersWithPermissions() {
    return await UserPermissionMatrixRepository.getAllUsersWithPermissions();
  }

  static async upsertUserPermission(userId, permissionId, status, updaterId) {
    return await UserPermissionMatrixRepository.upsertUserPermission(
      userId,
      permissionId,
      status,
      updaterId
    );
  }
}

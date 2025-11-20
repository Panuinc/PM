import { UserPermissionRepository } from "@/app/api/setting/userPermission/core/userPermission.repository";

export class UserPermissionService {
  static async getAllPaginated(skip, take) {
    return UserPermissionRepository.getAll(skip, take);
  }

  static async countAll() {
    return UserPermissionRepository.countAll();
  }

  static async getById(userPermissionId) {
    return UserPermissionRepository.findById(userPermissionId);
  }

  static async getByUserPermissionUserId(userPermissionUserId) {
    return UserPermissionRepository.findByUserPermissionUserId(userPermissionUserId);
  }

  static async create(data) {
    if (!data) {
      throw {
        status: 500,
        message: "UserPermissionService.create called without data",
      };
    }

    const userPermissionData = {
      ...data,
    };

    return UserPermissionRepository.create(userPermissionData);
  }

  static async update(userPermissionId, data) {
    if (!data) {
      throw {
        status: 500,
        message: "UserPermissionService.update called without data",
      };
    }

    return UserPermissionRepository.update(userPermissionId, data);
  }
}

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

  static async create(data) {
    if (!data) {
      throw {
        status: 500,
        message: "UserPermissionService.create called without data",
      };
    }
    return UserPermissionRepository.create({ ...data });
  }

  static async update(userPermissionId, data) {
    if (!data) {
      throw {
        status: 500,
        message: "UserPermissionService.update called without data",
      };
    }
    return UserPermissionRepository.update(userPermissionId, { ...data });
  }
}

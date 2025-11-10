import { UserPermissionRepository } from "@/app/api/setting/userPermission/core/userPermission.repository";
import logger from "@/lib/logger.node";

export class UserPermissionService {
  static async getAllPaginated(skip, take) {
    logger.info({
      message: "UserPermissionService.getAllPaginated",
      skip,
      take,
    });
    return await UserPermissionRepository.getAll(skip, take);
  }

  static async countAll() {
    return await UserPermissionRepository.countAll();
  }

  static async getById(userPermissionId) {
    return await UserPermissionRepository.findById(userPermissionId);
  }

  static async create(data) {
    logger.info({ message: "UserPermissionService.create", data });
    return await UserPermissionRepository.create(data);
  }

  static async update(userPermissionId, data) {
    logger.info({
      message: "UserPermissionService.update",
      userPermissionId,
      data,
    });
    return await UserPermissionRepository.update(userPermissionId, data);
  }
}

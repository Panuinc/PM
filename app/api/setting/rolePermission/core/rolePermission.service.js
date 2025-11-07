import { RolePermissionRepository } from "@/app/api/setting/rolePermission/core/rolePermission.repository";
import logger from "@/lib/logger.node";

export class RolePermissionService {
  static async getAllPaginated(skip, take) {
    logger.info({
      message: "RolePermissionService.getAllPaginated",
      skip,
      take,
    });
    return await RolePermissionRepository.getAll(skip, take);
  }

  static async countAll() {
    return await RolePermissionRepository.countAll();
  }

  static async getById(rolePermissionId) {
    return await RolePermissionRepository.findById(rolePermissionId);
  }

  static async create(data) {
    logger.info({ message: "RolePermissionService.create", data });
    return await RolePermissionRepository.create(data);
  }

  static async update(rolePermissionId, data) {
    logger.info({
      message: "RolePermissionService.update",
      rolePermissionId,
      data,
    });
    return await RolePermissionRepository.update(rolePermissionId, data);
  }
}

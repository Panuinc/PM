import { RolePermissionRepository } from "@/app/api/setting/rolePermission/core/rolePermission.repository";
import logger from "@/lib/logger.node";

export class RolePermissionService {
  static async getAllPaginated(skip, take) {
    logger.info({ message: "RolePermissionService.getAllPaginated", skip, take });
    return await RolePermissionRepository.getAll(skip, take);
  }

  static async countAll() {
    logger.info({ message: "RolePermissionService.countAll" });
    return await RolePermissionRepository.countAll();
  }

  static async getById(rolePermissionId) {
    logger.info({ message: "RolePermissionService.getById", rolePermissionId });
    return await RolePermissionRepository.findById(rolePermissionId);
  }

  static async getByName(rolePermissionName) {
    logger.info({ message: "RolePermissionService.getByName", rolePermissionName });
    return await RolePermissionRepository.findByRolePermissionName(rolePermissionName);
  }

  static async create(data) {
    logger.info({ message: "RolePermissionService.create", data });
    if (!data.rolePermissionName || !data.rolePermissionCreatedBy)
      throw new Error(
        "Missing required fields: rolePermissionName, rolePermissionCreatedBy"
      );

    return await RolePermissionRepository.create(data);
  }

  static async update(rolePermissionId, data) {
    logger.info({ message: "RolePermissionService.update", rolePermissionId, data });
    if (!data.rolePermissionName || !data.rolePermissionUpdatedBy)
      throw new Error(
        "Missing required fields: rolePermissionName, rolePermissionStatus, rolePermissionUpdatedBy"
      );

    return await RolePermissionRepository.update(rolePermissionId, data);
  }
}

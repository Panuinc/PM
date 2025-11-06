import { PermissionRepository } from "@/app/api/setting/permission/core/permission.repository";
import logger from "@/lib/logger.node";

export class PermissionService {
  static async getAllPaginated(skip, take) {
    logger.info({ message: "PermissionService.getAllPaginated", skip, take });
    return await PermissionRepository.getAll(skip, take);
  }

  static async countAll() {
    logger.info({ message: "PermissionService.countAll" });
    return await PermissionRepository.countAll();
  }

  static async getById(permissionId) {
    logger.info({ message: "PermissionService.getById", permissionId });
    return await PermissionRepository.findById(permissionId);
  }

  static async getByName(permissionName) {
    logger.info({ message: "PermissionService.getByName", permissionName });
    return await PermissionRepository.findByPermissionName(permissionName);
  }

  static async create(data) {
    logger.info({ message: "PermissionService.create", data });
    if (!data.permissionName || !data.permissionCreatedBy)
      throw new Error(
        "Missing required fields: permissionName, permissionCreatedBy"
      );

    return await PermissionRepository.create(data);
  }

  static async update(permissionId, data) {
    logger.info({ message: "PermissionService.update", permissionId, data });
    if (!data.permissionName || !data.permissionUpdatedBy)
      throw new Error(
        "Missing required fields: permissionName, permissionStatus, permissionUpdatedBy"
      );

    return await PermissionRepository.update(permissionId, data);
  }
}

import { PermissionGroupRepository } from "./permissionGroup.repository";
import logger from "@/lib/logger.node";

export class PermissionGroupService {
  static async getAllPaginated(skip, take) {
    logger.info({ message: "PermissionGroupService.getAllPaginated", skip, take });
    return PermissionGroupRepository.getAll(skip, take);
  }

  static async countAll() {
    logger.info({ message: "PermissionGroupService.countAll" });
    return PermissionGroupRepository.countAll();
  }

  static async getById(permissionGroupId) {
    logger.info({ message: "PermissionGroupService.getById", permissionGroupId });
    return PermissionGroupRepository.findById(permissionGroupId);
  }

  static async getByName(permissionGroupName) {
    logger.info({ message: "PermissionGroupService.getByName", permissionGroupName });
    return PermissionGroupRepository.findByPermissionGroupName(permissionGroupName);
  }

  static async create(data) {
    logger.info({ message: "PermissionGroupService.create", data });
    return PermissionGroupRepository.create(data);
  }

  static async update(permissionGroupId, data) {
    logger.info({
      message: "PermissionGroupService.update",
      permissionGroupId,
      data,
    });
    return PermissionGroupRepository.update(permissionGroupId, data);
  }
}

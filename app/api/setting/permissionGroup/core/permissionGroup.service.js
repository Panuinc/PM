import { PermissionGroupRepository } from "./permissionGroup.repository";
import logger from "@/lib/logger.node";

export class PermissionGroupService {
  static async getAllPaginated(skip, take) {
    logger.info({
      message: "PermissionGroupService.getAllPaginated",
      skip,
      take,
    });

    return await PermissionGroupRepository.getAll(skip, take);
  }

  static async countAll() {
    logger.info({ message: "PermissionGroupService.countAll" });
    return await PermissionGroupRepository.countAll();
  }

  static async getById(permissionGroupId) {
    logger.info({
      message: "PermissionGroupService.getById",
      permissionGroupId,
    });

    return await PermissionGroupRepository.findById(permissionGroupId);
  }

  static async getByName(permissionGroupName) {
    logger.info({
      message: "PermissionGroupService.getByName",
      permissionGroupName,
    });

    return await PermissionGroupRepository.findByPermissionGroupName(
      permissionGroupName
    );
  }

  static async create(data) {
    logger.info({ message: "PermissionGroupService.create", data });

    if (!data.permissionGroupName || !data.permissionGroupCreatedBy)
      throw new Error(
        "Missing required fields: permissionGroupName, permissionGroupCreatedBy"
      );

    return await PermissionGroupRepository.create(data);
  }

  static async update(permissionGroupId, data) {
    logger.info({
      message: "PermissionGroupService.update",
      permissionGroupId,
      data,
    });

    if (!data.permissionGroupName || !data.permissionGroupUpdatedBy)
      throw new Error(
        "Missing required fields: permissionGroupName, permissionGroupUpdatedBy"
      );

    return await PermissionGroupRepository.update(permissionGroupId, data);
  }
}

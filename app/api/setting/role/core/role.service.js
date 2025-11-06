import { RoleRepository } from "@/app/api/setting/role/core/role.repository";
import logger from "@/lib/logger.node";

export class RoleService {
  static async getAllPaginated(skip, take) {
    logger.info({ message: "RoleService.getAllPaginated", skip, take });
    return await RoleRepository.getAll(skip, take);
  }

  static async countAll() {
    logger.info({ message: "RoleService.countAll" });
    return await RoleRepository.countAll();
  }

  static async getById(roleId) {
    logger.info({ message: "RoleService.getById", roleId });
    return await RoleRepository.findById(roleId);
  }

  static async getByName(roleName) {
    logger.info({ message: "RoleService.getByName", roleName });
    return await RoleRepository.findByRoleName(roleName);
  }

  static async create(data) {
    logger.info({ message: "RoleService.create", data });
    if (!data.roleName || !data.roleCreatedBy)
      throw new Error(
        "Missing required fields: roleName, roleCreatedBy"
      );

    return await RoleRepository.create(data);
  }

  static async update(roleId, data) {
    logger.info({ message: "RoleService.update", roleId, data });
    if (!data.roleName || !data.roleUpdatedBy)
      throw new Error(
        "Missing required fields: roleName, roleStatus, roleUpdatedBy"
      );

    return await RoleRepository.update(roleId, data);
  }
}

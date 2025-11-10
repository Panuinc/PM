import { UserRoleRepository } from "@/app/api/setting/userRole/core/userRole.repository";
import logger from "@/lib/logger.node";

export class UserRoleService {
  static async getAllPaginated(skip, take) {
    logger.info({
      message: "UserRoleService.getAllPaginated",
      skip,
      take,
    });
    return await UserRoleRepository.getAll(skip, take);
  }

  static async countAll() {
    return await UserRoleRepository.countAll();
  }

  static async getById(userRoleId) {
    return await UserRoleRepository.findById(userRoleId);
  }

  static async create(data) {
    logger.info({ message: "UserRoleService.create", data });
    return await UserRoleRepository.create(data);
  }

  static async update(userRoleId, data) {
    logger.info({
      message: "UserRoleService.update",
      userRoleId,
      data,
    });
    return await UserRoleRepository.update(userRoleId, data);
  }
}

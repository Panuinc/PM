import { UserRepository } from "@/app/api/setting/user/core/user.repository";
import logger from "@/lib/logger.node";

export class UserService {
  static async getAllPaginated(skip, take) {
    logger.info({ message: "UserService.getAllPaginated", skip, take });
    return await UserRepository.getAll(skip, take);
  }

  static async countAll() {
    logger.info({ message: "UserService.countAll" });
    return await UserRepository.countAll();
  }

  static async getById(userId) {
    logger.info({ message: "UserService.getById", userId });
    return await UserRepository.findById(userId);
  }

  static async getByName(userName) {
    logger.info({ message: "UserService.getByName", userName });
    return await UserRepository.findByUserName(userName);
  }

  static async create(data) {
    logger.info({ message: "UserService.create", data });
    if (!data.userName || !data.userCreatedBy)
      throw new Error(
        "Missing required fields: userName, userCreatedBy"
      );

    return await UserRepository.create(data);
  }

  static async update(userId, data) {
    logger.info({ message: "UserService.update", userId, data });
    if (!data.userName || !data.userUpdatedBy)
      throw new Error(
        "Missing required fields: userName, userStatus, userUpdatedBy"
      );

    return await UserRepository.update(userId, data);
  }
}

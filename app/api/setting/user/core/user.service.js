import { UserRepository } from "@/app/api/setting/user/core/user.repository";
import logger from "@/lib/logger.node";
import bcrypt from "bcryptjs";

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

  static async getByEmail(userEmail) {
    logger.info({ message: "UserService.getByEmail", userEmail });
    return await UserRepository.findByEmail(userEmail);
  }

  static async create(data) {
    logger.info({ message: "UserService.create", data });

    if (
      !data.userFirstName ||
      !data.userLastName ||
      !data.userEmail ||
      !data.userPassword ||
      !data.userCreatedBy
    )
      throw new Error(
        "Missing required fields: userFirstName, userLastName, userEmail, userPassword, userCreatedBy"
      );

    const hashedPassword = await bcrypt.hash(data.userPassword, 10);

    const userData = {
      ...data,
      userPassword: hashedPassword,
    };

    return await UserRepository.create(userData);
  }

  static async update(userId, data) {
    logger.info({ message: "UserService.update", userId, data });

    if (
      !data.userFirstName ||
      !data.userLastName ||
      !data.userEmail ||
      !data.userUpdatedBy
    )
      throw new Error(
        "Missing required fields: userFirstName, userLastName, userEmail, userUpdatedBy"
      );

    return await UserRepository.update(userId, data);
  }
}

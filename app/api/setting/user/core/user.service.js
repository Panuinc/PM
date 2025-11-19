import { UserRepository } from "@/app/api/setting/user/core/user.repository";
import bcrypt from "bcryptjs";

export class UserService {
  static async getAllPaginated(skip, take) {
    return UserRepository.getAll(skip, take);
  }

  static async countAll() {
    return UserRepository.countAll();
  }

  static async getById(userId) {
    return UserRepository.findById(userId);
  }

  static async getByEmail(userEmail) {
    return UserRepository.findByEmail(userEmail);
  }

  static async create(data) {
    if (!data) {
      throw {
        status: 500,
        message: "UserService.create called without data",
      };
    }

    if (!data.userPassword) {
      throw {
        status: 500,
        message: "UserService.create requires userPassword",
      };
    }

    const hashedPassword = await bcrypt.hash(data.userPassword, 10);

    const userData = {
      ...data,
      userPassword: hashedPassword,
    };

    return UserRepository.create(userData);
  }

  static async update(userId, data) {
    if (!data) {
      throw {
        status: 500,
        message: "UserService.update called without data",
      };
    }

    return UserRepository.update(userId, data);
  }
}

import { UserRepository } from "@/app/api/setting/user/core/user.repository";

export const UserValidator = {
  async isDuplicateEmail(userEmail) {
    if (!userEmail || typeof userEmail !== "string") {
      throw {
        status: 400,
        message: "Invalid userEmail",
      };
    }

    const existing = await UserRepository.findByEmail(userEmail);
    return !!existing;
  },
};

import { UserRepository } from "@/app/api/setting/user/core/user.repository";

export const UserValidator = {
  async isDuplicateUserEmail(userEmail) {
    if (!userEmail || typeof userEmail !== "string") {
      throw {
        status: 400,
        message: "Invalid userEmail",
      };
    }

    const existing = await UserRepository.findByUserEmail(userEmail);
    return !!existing;
  },
};

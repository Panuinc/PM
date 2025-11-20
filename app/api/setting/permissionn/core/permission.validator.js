import { PermissionRepository } from "@/app/api/setting/permission/core/permission.repository";

export const PermissionValidator = {
  async isDuplicatePermissionName(permissionName) {
    if (!permissionName || typeof permissionName !== "string") {
      throw {
        status: 400,
        message: "Invalid permissionName",
      };
    }

    const existing = await PermissionRepository.findByPermissionName(permissionName);
    return !!existing;
  },
};

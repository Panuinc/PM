import { DepartmentRepository } from "@/app/api/setting/department/core/department.repository";

export const DepartmentValidator = {
  async isDuplicateDepartmentName(departmentName) {
    if (!departmentName || typeof departmentName !== "string") {
      throw {
        status: 400,
        message: "Invalid departmentName",
      };
    }

    const existing = await DepartmentRepository.findByDepartmentName(departmentName);
    return !!existing;
  },
};

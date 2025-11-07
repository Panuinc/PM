import { DepartmentRepository } from "@/app/api/setting/department/core/department.repository";
import logger from "@/lib/logger.node";

export const DepartmentValidator = {
  async isDuplicateDepartmentName(departmentName) {
    logger.info({
      message: "DepartmentValidator.isDuplicateDepartmentName",
      departmentName,
    });

    if (!departmentName || typeof departmentName !== "string") {
      logger.warn({ message: "Invalid department name input", departmentName });
      throw new Error("Invalid department name");
    }

    const existing = await DepartmentRepository.findByDepartmentName(departmentName);
    const isDuplicate = !!existing;

    if (isDuplicate)
      logger.warn({
        message: "Duplicate department name detected",
        departmentName,
      });
    else logger.info({ message: "Department name available", departmentName });

    return isDuplicate;
  },
};

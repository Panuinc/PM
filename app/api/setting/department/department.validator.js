import { DepartmentRepository } from "@/app/api/setting/department/department.repository";
import logger from "@/lib/logger.node";

export const DepartmentValidator = {
  async isDuplicateDepartmentName(departmentName) {
    logger.info({
      message: "DepartmentValidator.isDuplicateDepartmentName",
      departmentName,
    });

    if (!departmentName || typeof departmentName !== "string") {
      logger.warn({ message: "Invalid department code input", departmentName });
      throw new Error("Invalid department code");
    }

    const existing = await DepartmentRepository.findByName(departmentName);
    const isDuplicate = !!existing;

    if (isDuplicate)
      logger.warn({
        message: "Duplicate department code detected",
        departmentName,
      });
    else logger.info({ message: "Department code available", departmentName });

    return isDuplicate;
  },
};

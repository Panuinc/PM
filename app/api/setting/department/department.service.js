import { DepartmentRepository } from "@/app/api/setting/department/department.repository";
import logger from "@/lib/logger.node";

export class DepartmentService {
  static async getAllPaginated(skip, take) {
    logger.info({ message: "DepartmentService.getAllPaginated", skip, take });
    return await DepartmentRepository.getAll(skip, take);
  }

  static async countAll() {
    logger.info({ message: "DepartmentService.countAll" });
    return await DepartmentRepository.countAll();
  }

  static async getById(departmentId) {
    logger.info({ message: "DepartmentService.getById", departmentId });
    return await DepartmentRepository.findById(departmentId);
  }

  static async getByName(departmentName) {
    logger.info({ message: "DepartmentService.getByName", departmentName });
    return await DepartmentRepository.findByName(departmentName);
  }

  static async create(data) {
    logger.info({ message: "DepartmentService.create", data });
    if (!data.departmentName || !data.departmentCreatedBy)
      throw new Error(
        "Missing required fields: departmentName, departmentCreatedBy"
      );

    return await DepartmentRepository.create(data);
  }

  static async update(departmentId, data) {
    logger.info({ message: "DepartmentService.update", departmentId, data });
    if (!data.departmentName || !data.departmentUpdatedBy)
      throw new Error(
        "Missing required fields: departmentName, departmentStatus, departmentUpdatedBy"
      );

    return await DepartmentRepository.update(departmentId, data);
  }
}

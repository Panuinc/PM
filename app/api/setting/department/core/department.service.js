import { DepartmentRepository } from "@/app/api/setting/department/core/department.repository";

export class DepartmentService {
  static async getAllPaginated(skip, take) {
    return DepartmentRepository.getAll(skip, take);
  }

  static async countAll() {
    return DepartmentRepository.countAll();
  }

  static async getById(departmentId) {
    return DepartmentRepository.findById(departmentId);
  }

  static async getByDepartmentName(departmentName) {
    return DepartmentRepository.findByDepartmentName(departmentName);
  }

  static async create(data) {
    if (!data) {
      throw {
        status: 500,
        message: "DepartmentService.create called without data",
      };
    }

    const departmentData = {
      ...data,
    };

    return DepartmentRepository.create(departmentData);
  }

  static async update(departmentId, data) {
    if (!data) {
      throw {
        status: 500,
        message: "DepartmentService.update called without data",
      };
    }

    return DepartmentRepository.update(departmentId, data);
  }
}

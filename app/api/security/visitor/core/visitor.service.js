import { VisitorRepository } from "@/app/api/security/visitor/core/visitor.repository";

export class VisitorService {
  static async getAllPaginated(skip, take) {
    return VisitorRepository.getAll(skip, take);
  }

  static async countAll() {
    return VisitorRepository.countAll();
  }

  static async getById(visitorId) {
    return VisitorRepository.findById(visitorId);
  }

  static async getByVisitorName(visitorName) {
    return VisitorRepository.findByVisitorName(visitorName);
  }

  static async create(data) {
    if (!data) {
      throw {
        status: 500,
        message: "VisitorService.create called without data",
      };
    }

    const visitorData = {
      ...data,
    };

    return VisitorRepository.create(visitorData);
  }

  static async update(visitorId, data) {
    if (!data) {
      throw {
        status: 500,
        message: "VisitorService.update called without data",
      };
    }

    return VisitorRepository.update(visitorId, data);
  }
}

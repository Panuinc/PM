import { DeliveryRepository } from "@/app/api/setting/delivery/core/delivery.repository";

export class DeliveryService {
  static async getAllPaginated(skip, take) {
    return DeliveryRepository.getAll(skip, take);
  }

  static async countAll() {
    return DeliveryRepository.countAll();
  }

  static async getById(deliveryId) {
    return DeliveryRepository.findById(deliveryId);
  }

  static async getByDeliveryInvoiceNumber(deliveryInvoiceNumber) {
    return DeliveryRepository.findByDeliveryInvoiceNumber(deliveryInvoiceNumber);
  }

  static async create(data) {
    if (!data) {
      throw {
        status: 500,
        message: "DeliveryService.create called without data",
      };
    }

    const deliveryData = {
      ...data,
    };

    return DeliveryRepository.create(deliveryData);
  }

  static async update(deliveryId, data) {
    if (!data) {
      throw {
        status: 500,
        message: "DeliveryService.update called without data",
      };
    }

    return DeliveryRepository.update(deliveryId, data);
  }
}

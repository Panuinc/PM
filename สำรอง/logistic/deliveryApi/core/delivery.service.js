import { DeliveryRepository } from "@/app/api/logistic/delivery/core/delivery.repository";

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

  static async getByInvoiceAndCompany(deliveryInvoiceNumber, deliveryCompanyName) {
    return DeliveryRepository.findByInvoiceAndCompany(
      deliveryInvoiceNumber,
      deliveryCompanyName
    );
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

  static async addProductPhotos(deliveryId, photoPaths, createdBy, createdAt) {
    if (!Array.isArray(photoPaths) || photoPaths.length === 0) return;

    for (let i = 0; i < photoPaths.length; i++) {
      const path = String(photoPaths[i] || "").trim();
      if (!path) continue;

      await DeliveryRepository.createPhoto({
        deliveryPhotoDeliveryId: deliveryId,
        deliveryPhotoPath: path,
        deliveryPhotoCreatedBy: createdBy || null,
        deliveryPhotoCreatedAt: createdAt,
      });
    }
  }

  static async deleteProductPhotosByIds(deliveryId, photoIds) {
    return DeliveryRepository.deletePhotosByIds(deliveryId, photoIds);
  }

  static async delete(deliveryId) {
    const photos = await prisma.deliveryPhoto.findMany({
      where: { deliveryPhotoDeliveryId: deliveryId },
      select: { deliveryPhotoPath: true },
    });

    await prisma.deliveryPhoto.deleteMany({
      where: { deliveryPhotoDeliveryId: deliveryId },
    });

    await prisma.delivery.delete({
      where: { deliveryId },
    });

    for (const p of photos) {
      if (p.deliveryPhotoPath) await deleteFile(p.deliveryPhotoPath);
    }

    return true;
  }
}

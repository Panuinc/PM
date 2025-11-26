import { DeliveryRepository } from "@/app/api/setting/delivery/core/delivery.repository";

export const DeliveryValidator = {
  async isDuplicateDeliveryName(deliveryName) {
    if (!deliveryName || typeof deliveryName !== "string") {
      throw {
        status: 400,
        message: "Invalid deliveryName",
      };
    }

    const existing = await DeliveryRepository.findByDeliveryName(deliveryName);
    return !!existing;
  },
};

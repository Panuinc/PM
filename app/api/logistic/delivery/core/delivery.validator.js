import { DeliveryRepository } from "@/app/api/logistic/delivery/core/delivery.repository";

export const DeliveryValidator = {
  async isDuplicateDeliveryInvoiceNumber(deliveryInvoiceNumber) {
    if (!deliveryInvoiceNumber || typeof deliveryInvoiceNumber !== "string") {
      throw {
        status: 400,
        message: "Invalid deliveryInvoiceNumber",
      };
    }

    const existing = await DeliveryRepository.findByDeliveryInvoiceNumber(deliveryInvoiceNumber);
    return !!existing;
  },
};

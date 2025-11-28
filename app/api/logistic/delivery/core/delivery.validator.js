import { DeliveryRepository } from "@/app/api/logistic/delivery/core/delivery.repository";

export const DeliveryValidator = {
  async isDuplicateDeliveryInvoiceNumber(deliveryInvoiceNumber) {
    if (!deliveryInvoiceNumber || typeof deliveryInvoiceNumber !== "string") {
      throw {
        status: 400,
        message: "Invalid deliveryInvoiceNumber",
      };
    }

    const existing = await DeliveryRepository.findByDeliveryInvoiceNumber(
      deliveryInvoiceNumber
    );
    return !!existing;
  },

  async isDuplicateInvoiceAndCompany(
    deliveryInvoiceNumber,
    deliveryCompanyName
  ) {
    if (!deliveryInvoiceNumber || typeof deliveryInvoiceNumber !== "string") {
      throw {
        status: 400,
        message: "Invalid deliveryInvoiceNumber",
      };
    }

    if (!deliveryCompanyName || typeof deliveryCompanyName !== "string") {
      throw {
        status: 400,
        message: "Invalid deliveryCompanyName",
      };
    }

    const existing = await DeliveryRepository.findByInvoiceAndCompany(
      deliveryInvoiceNumber,
      deliveryCompanyName
    );
    return !!existing;
  },
};

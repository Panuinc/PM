import { DeliveryService } from "@/app/api/logistic/delivery/core/delivery.service";
import {
  deliveryPostSchema,
  deliveryPutSchema,
} from "@/app/api/logistic/delivery/core/delivery.schema";
import { DeliveryValidator } from "@/app/api/logistic/delivery/core/delivery.validator";
import { getLocalNow } from "@/lib/getLocalNow";
import logger from "@/lib/logger.node";

export async function GetAllDeliveryUseCase(page = 1, limit = 1000000) {
  const skip = (page - 1) * limit;
  const deliverys = await DeliveryService.getAllPaginated(skip, limit);
  const total = await DeliveryService.countAll();

  return { deliverys, total };
}

export async function GetDeliveryByIdUseCase(deliveryId) {
  if (!deliveryId || typeof deliveryId !== "string") {
    throw { status: 400, message: "Invalid delivery ID" };
  }

  const delivery = await DeliveryService.getById(deliveryId);
  if (!delivery) {
    throw { status: 404, message: "Delivery not found" };
  }

  return delivery;
}

export async function CreateDeliveryUseCase(data) {
  logger.info({
    message: "CreateDeliveryUseCase start",
    deliveryInvoiceNumber: data?.deliveryInvoiceNumber,
    deliveryCreatedBy: data?.deliveryCreatedBy,
  });

  const parsed = deliveryPostSchema.safeParse(data);
  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;

    logger.warn({
      message: "CreateDeliveryUseCase validation failed",
      errors: fieldErrors,
    });

    throw {
      status: 422,
      message: "Invalid input",
      details: fieldErrors,
    };
  }

  const normalizedDeliveryInvoiceNumber = parsed.data.deliveryInvoiceNumber
    .trim()
    .toLowerCase();

  const duplicate = await DeliveryValidator.isDuplicateDeliveryInvoiceNumber(
    normalizedDeliveryInvoiceNumber
  );

  if (duplicate) {
    logger.warn({
      message: "CreateDeliveryUseCase duplicate deliveryInvoiceNumber",
      deliveryInvoiceNumber: normalizedDeliveryInvoiceNumber,
    });

    throw {
      status: 409,
      message: `deliveryInvoiceNumber '${normalizedDeliveryInvoiceNumber}' already exists`,
    };
  }

  try {
    const delivery = await DeliveryService.create({
      ...parsed.data,
      deliveryInvoiceNumber: normalizedDeliveryInvoiceNumber,
      deliveryCreatedAt: getLocalNow(),
    });

    logger.info({
      message: "CreateDeliveryUseCase success",
      deliveryId: delivery.deliveryId,
    });

    return delivery;
  } catch (error) {
    if (error && typeof error === "object" && error.code === "P2002") {
      logger.warn({
        message:
          "CreateDeliveryUseCase unique constraint violation on deliveryInvoiceNumber (P2002)",
        deliveryInvoiceNumber: normalizedDeliveryInvoiceNumber,
      });

      throw {
        status: 409,
        message: `deliveryInvoiceNumber '${normalizedDeliveryInvoiceNumber}' already exists`,
      };
    }

    logger.error({
      message: "CreateDeliveryUseCase error",
      error,
    });

    throw error;
  }
}

export async function UpdateDeliveryUseCase(data) {
  logger.info({
    message: "UpdateDeliveryUseCase start",
    deliveryId: data?.deliveryId,
    deliveryInvoiceNumber: data?.deliveryInvoiceNumber,
    deliveryUpdatedBy: data?.deliveryUpdatedBy,
  });

  const parsed = deliveryPutSchema.safeParse(data);
  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;

    logger.warn({
      message: "UpdateDeliveryUseCase validation failed",
      errors: fieldErrors,
    });

    throw {
      status: 422,
      message: "Invalid input",
      details: fieldErrors,
    };
  }

  const existing = await DeliveryService.getById(parsed.data.deliveryId);
  if (!existing) {
    logger.warn({
      message: "UpdateDeliveryUseCase delivery not found",
      deliveryId: parsed.data.deliveryId,
    });

    throw { status: 404, message: "Delivery not found" };
  }

  const normalizedDeliveryInvoiceNumber = parsed.data.deliveryInvoiceNumber
    .trim()
    .toLowerCase();

  const existingInvoiceNormalized = existing.deliveryInvoiceNumber
    ? existing.deliveryInvoiceNumber.trim().toLowerCase()
    : "";

  if (normalizedDeliveryInvoiceNumber !== existingInvoiceNormalized) {
    const duplicate = await DeliveryValidator.isDuplicateDeliveryInvoiceNumber(
      normalizedDeliveryInvoiceNumber
    );

    if (duplicate) {
      logger.warn({
        message: "UpdateDeliveryUseCase duplicate deliveryInvoiceNumber",
        deliveryInvoiceNumber: normalizedDeliveryInvoiceNumber,
      });

      throw {
        status: 409,
        message: `deliveryInvoiceNumber '${normalizedDeliveryInvoiceNumber}' already exists`,
      };
    }
  }

  const { deliveryId, ...rest } = parsed.data;

  try {
    const updatedDelivery = await DeliveryService.update(deliveryId, {
      ...rest,
      deliveryInvoiceNumber: normalizedDeliveryInvoiceNumber,
      deliveryUpdatedAt: getLocalNow(),
    });

    logger.info({
      message: "UpdateDeliveryUseCase success",
      deliveryId,
    });

    return updatedDelivery;
  } catch (error) {
    if (error && typeof error === "object" && error.code === "P2002") {
      logger.warn({
        message:
          "UpdateDeliveryUseCase unique constraint violation on deliveryInvoiceNumber (P2002)",
        deliveryInvoiceNumber: normalizedDeliveryInvoiceNumber,
      });

      throw {
        status: 409,
        message: `deliveryInvoiceNumber '${normalizedDeliveryInvoiceNumber}' already exists`,
      };
    }

    logger.error({
      message: "UpdateDeliveryUseCase error",
      error,
    });

    throw error;
  }
}

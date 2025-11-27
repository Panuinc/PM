import { z } from "zod";
import {
  preprocessString,
  preprocessEnum,
  preprocessInt,
  preprocessStringOptional,
  formatData,
} from "@/lib/zodSchema";

export const deliveryReturnSchema = z.object({
  deliveryReturnCode: preprocessString("Please provide deliveryReturnCode"),
  deliveryReturnQuantity: preprocessInt(
    "Please provide deliveryReturnQuantity"
  ),
  deliveryReturnRemark: preprocessStringOptional(),
});

export const deliveryPostSchema = z.object({
  deliveryInvoiceNumber: preprocessString(
    "Please provide deliveryInvoiceNumber"
  ),
  deliveryLocation: preprocessString("Please provide deliveryLocation"),
  deliveryPicture: preprocessString("Please provide deliveryPicture"),
  deliveryCreatedBy: preprocessString("Please provide the creator ID"),
  deliveryReturns: z.array(deliveryReturnSchema).optional(),
});

export const deliveryPutSchema = z.object({
  deliveryId: preprocessString("Please provide the delivery ID"),
  deliveryInvoiceNumber: preprocessString(
    "Please provide deliveryInvoiceNumber"
  ),
  deliveryLocation: preprocessString("Please provide deliveryLocation"),
  deliveryPicture: preprocessString("Please provide deliveryPicture"),
  deliveryStatus: preprocessEnum(
    ["PendingApprove", "Approved"],
    "Please provide deliveryStatus"
  ),
  deliveryUpdatedBy: preprocessString("Please provide the updater ID"),
  deliveryReturns: z
    .array(
      deliveryReturnSchema.extend({
        deliveryReturnId: preprocessStringOptional(),
      })
    )
    .optional(),
});

export const formatDeliveryData = (deliverys) => {
  return formatData(deliverys, ["deliveryCreatedAt", "deliveryUpdatedAt"], []);
};

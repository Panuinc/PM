import { z } from "zod";
import { preprocessString, preprocessEnum, formatData } from "@/lib/zodSchema";

export const deliveryPostSchema = z.object({
  deliveryInvoiceNumber: preprocessString(
    "Please provide deliveryInvoiceNumber"
  ),
  deliveryLocation: preprocessString("Please provide deliveryLocation"),
  deliveryPicture: preprocessString("Please provide deliveryPicture"),
  deliveryCreatedBy: preprocessString("Please provide the creator ID"),
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
});

export const formatDeliveryData = (deliverys) => {
  return formatData(deliverys, ["deliveryCreatedAt", "deliveryUpdatedAt"], []);
};

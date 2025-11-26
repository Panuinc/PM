import { z } from "zod";
import {
  preprocessString,
  preprocessEnum,
  formatData,
} from "@/lib/zodSchema";

export const deliveryPostSchema = z.object({
  deliveryName: preprocessString("Please provide deliveryName"),
  deliveryCreatedBy: preprocessString("Please provide the creator ID"),
});

export const deliveryPutSchema = z.object({
  deliveryId: preprocessString("Please provide the delivery ID"),
  deliveryName: preprocessString("Please deliveryName"),
  deliveryStatus: preprocessEnum(
    ["Enable", "Disable"],
    "Please provide deliveryStatus"
  ),
  deliveryUpdatedBy: preprocessString("Please provide the updater ID"),
});

export const formatDeliveryData = (deliverys) => {
  return formatData(
    deliverys,
    ["deliveryCreatedAt", "deliveryUpdatedAt"],
    []
  );
};

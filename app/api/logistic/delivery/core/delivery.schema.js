import { z } from "zod";
import { preprocessString, preprocessEnum, formatData } from "@/lib/zodSchema";

const preprocessStringArrayJson = (fallback = []) =>
  z.preprocess((v) => {
    if (Array.isArray(v)) return v;
    if (typeof v === "string" && v.trim()) {
      try {
        return JSON.parse(v);
      } catch {
        return fallback;
      }
    }
    return fallback;
  }, z.array(z.string()).default(fallback));

export const DELIVERY_COMPANY_OPTIONS = [
  { key: "CHH", label: "บริษัท ชื้อฮะฮวด อุตสาหกรรม จำกัด" },
  { key: "DXC", label: "บริษัท ดีไซน์ เอ็กซ์เช้นจ์ จำกัด" },
  { key: "WWS", label: "บริษัท เวสท์วินด์ เซอร์วิสเซส จำกัด" },
];

export const DELIVERY_COMPANY_KEYS = DELIVERY_COMPANY_OPTIONS.map((c) => c.key);

export const deliveryPostSchema = z.object({
  deliveryInvoiceNumber: preprocessString(
    "Please provide deliveryInvoiceNumber"
  ),
  deliveryCompanyName: preprocessEnum(
    DELIVERY_COMPANY_KEYS,
    "Please provide deliveryCompanyName"
  ),
  deliveryLocation: preprocessString("Please provide deliveryLocation"),
  deliveryPicture: preprocessString("Please provide deliveryPicture"),
  deliveryCreatedBy: preprocessString("Please provide the creator ID"),

  deliveryProductPictures: preprocessStringArrayJson([]).optional(),
});

export const deliveryPutSchema = z.object({
  deliveryId: preprocessString("Please provide the delivery ID"),
  deliveryInvoiceNumber: preprocessString(
    "Please provide deliveryInvoiceNumber"
  ),
  deliveryCompanyName: preprocessEnum(
    DELIVERY_COMPANY_KEYS,
    "Please provide deliveryCompanyName"
  ),
  deliveryLocation: preprocessString("Please provide deliveryLocation"),
  deliveryPicture: preprocessString("Please provide deliveryPicture"),
  deliveryStatus: preprocessEnum(
    ["PendingApprove", "Approved"],
    "Please provide deliveryStatus"
  ),
  deliveryUpdatedBy: preprocessString("Please provide the updater ID"),

  deliveryProductPictures: preprocessStringArrayJson([]).optional(),

  deliveryDeletePhotoIds: preprocessStringArrayJson([]).optional(),
});

export const formatDeliveryData = (deliverys) => {
  return formatData(deliverys, ["deliveryCreatedAt", "deliveryUpdatedAt"], []);
};

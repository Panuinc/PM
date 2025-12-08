import { z } from "zod";
import { preprocessString, preprocessEnum, formatData } from "@/lib/zodSchema";

export const visitorPostSchema = z.object({
  visitorFirstName: preprocessString("Please provide visitorFirstName"),
  visitorLastName: preprocessString("Please provide visitorLastName"),
  visitorCompany: preprocessString("Please provide visitorCompany"),
  visitorCarRegistration: preprocessString(
    "Please provide visitorCarRegistration"
  ),
  visitorProvince: preprocessString("Please provide visitorProvince"),
  visitorContactUserId: preprocessString("Please provide visitorContactUserId"),
  visitorContactReason: preprocessEnum(
    [
      "Shipping",
      "BillingChequeCollection",
      "JobApplication",
      "ProductPresentation",
      "Meeting",
      "Other",
    ],
    "Please provide valid visitorContactReason"
  ),
  visitorPhoto: preprocessString("Please provide visitorPhoto"),
  visitorDocumentPhotos: preprocessString(
    "Please provide visitorDocumentPhotos"
  ),
  visitorCreatedBy: preprocessString("Please provide the creator ID"),
});

export const visitorPutSchema = z.object({
  visitorId: preprocessString("Please provide the visitor ID"),
  visitorFirstName: preprocessString("Please provide visitorFirstName"),
  visitorLastName: preprocessString("Please provide visitorLastName"),
  visitorCompany: preprocessString("Please provide visitorCompany"),
  visitorCarRegistration: preprocessString(
    "Please provide visitorCarRegistration"
  ),
  visitorProvince: preprocessString("Please provide visitorProvince"),
  visitorContactUserId: preprocessString("Please provide visitorContactUserId"),
  visitorContactReason: preprocessEnum(
    [
      "Shipping",
      "BillingChequeCollection",
      "JobApplication",
      "ProductPresentation",
      "Meeting",
      "Other",
    ],
    "Please provide valid visitorContactReason"
  ),
  visitorPhoto: preprocessString("Please provide visitorPhoto"),
  visitorDocumentPhotos: preprocessString(
    "Please provide visitorDocumentPhotos"
  ),
  visitorStatus: preprocessEnum(
    ["CheckIn", "Confirmed", "CheckOut"],
    "Please provide valid visitorStatus"
  ),
  visitorUpdatedBy: preprocessString("Please provide the updater ID"),
});

export const formatVisitorData = (visitors) => {
  return formatData(visitors, ["visitorCreatedAt", "visitorUpdatedAt"], []);
};

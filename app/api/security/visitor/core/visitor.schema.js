import { z } from "zod";
import {
  preprocessString,
  preprocessEnum,
  formatData,
} from "@/lib/zodSchema";

export const visitorPostSchema = z.object({
  visitorName: preprocessString("Please provide visitorName"),
  visitorCreatedBy: preprocessString("Please provide the creator ID"),
});

export const visitorPutSchema = z.object({
  visitorId: preprocessString("Please provide the visitor ID"),
  visitorName: preprocessString("Please visitorName"),
  visitorStatus: preprocessEnum(
    ["Enable", "Disable"],
    "Please provide visitorStatus"
  ),
  visitorUpdatedBy: preprocessString("Please provide the updater ID"),
});

export const formatVisitorData = (visitors) => {
  return formatData(
    visitors,
    ["visitorCreatedAt", "visitorUpdatedAt"],
    []
  );
};

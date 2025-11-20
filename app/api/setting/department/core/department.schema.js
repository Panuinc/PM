import { z } from "zod";
import {
  preprocessString,
  preprocessEnum,
  formatData,
} from "@/lib/zodSchema";

export const departmentPostSchema = z.object({
  departmentName: preprocessString("Please provide departmentName"),
  departmentCreatedBy: preprocessString("Please provide the creator ID"),
});

export const departmentPutSchema = z.object({
  departmentId: preprocessString("Please provide the department ID"),
  departmentName: preprocessString("Please departmentName"),
  departmentStatus: preprocessEnum(
    ["Enable", "Disable"],
    "Please provide departmentStatus"
  ),
  departmentUpdatedBy: preprocessString("Please provide the updater ID"),
});

export const formatDepartmentData = (departments) => {
  return formatData(
    departments,
    ["departmentCreatedAt", "departmentUpdatedAt"],
    []
  );
};

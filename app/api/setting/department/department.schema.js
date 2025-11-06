import { z } from "zod";
import { preprocessString, preprocessEnum, formatData } from "@/lib/zodSchema";
import logger from "@/lib/logger.node";

logger.info({ message: "Department schema loaded" });

export const departmentPostSchema = z.object({
  departmentName: preprocessString("Please provide the department name"),
  departmentCreateBy: preprocessString("Please provide the creator ID"),
});

export const departmentPutSchema = z.object({
  departmentId: preprocessString("Please provide the department ID"),
  departmentName: preprocessString("Please provide the department name"),
  departmentStatus: preprocessEnum(
    ["Enable", "Disable"],
    "Please provide department status'"
  ),
  departmentUpdateBy: preprocessString("Please provide the updater ID"),
});

export const formatDepartmentData = (departments) => {
  logger.info({
    message: "Formatting department data",
    count: departments.length,
  });
  return formatData(
    departments,
    ["departmentCreatedAt", "departmentUpdatedAt"],
    []
  );
};

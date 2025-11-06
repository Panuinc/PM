import { z } from "zod";
import {
  preprocessString,
  preprocessStringOptional,
  preprocessEnum,
  formatData,
} from "@/lib/zodSchema";
import logger from "@/lib/logger.node";

logger.info({ message: "User schema loaded" });

export const userPostSchema = z.object({
  userFirstName: preprocessString("Please provide first name"),
  userLastName: preprocessString("Please provide last name"),
  userEmail: preprocessString("Please provide email"),
  userPassword: preprocessString("Please provide password"),
  userDepartmentId: preprocessStringOptional(
    "Please provide the Department ID"
  ),
  userCreatedBy: preprocessString("Please provide the creator ID"),
});

export const userPutSchema = z.object({
  userId: preprocessString("Please provide the user ID"),
  userFirstName: preprocessString("Please provide first name"),
  userLastName: preprocessString("Please provide last name"),
  userEmail: preprocessString("Please provide email"),
  userDepartmentId: preprocessStringOptional(
    "Please provide the Department ID"
  ),
  userStatus: preprocessEnum(
    ["Enable", "Disable"],
    "Please provide user status"
  ),
  userUpdatedBy: preprocessString("Please provide the updater ID"),
});

export const formatUserData = (users) => {
  logger.info({
    message: "Formatting user data",
    count: users.length,
  });
  return formatData(users, ["userCreatedAt", "userUpdatedAt"], []);
};

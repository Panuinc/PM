import { z } from "zod";
import {
  preprocessString,
  preprocessStringOptional,
  preprocessEnum,
  formatData,
} from "@/lib/zodSchema";

export const userPostSchema = z.object({
  userFirstName: preprocessString("Please provide first name"),
  userLastName: preprocessString("Please provide last name"),
  userEmail: preprocessString("Please provide email"),
  userPassword: preprocessString("Please provide password"),
  userCreatedBy: preprocessString("Please provide the creator ID"),
});

export const userPutSchema = z.object({
  userId: preprocessString("Please provide the user ID"),
  userFirstName: preprocessString("Please provide first name"),
  userLastName: preprocessString("Please provide last name"),
  userEmail: preprocessString("Please provide email"),
  userStatus: preprocessEnum(
    ["Enable", "Disable"],
    "Please provide user status"
  ),
  userUpdatedBy: preprocessString("Please provide the updater ID"),
});

export const formatUserData = (users) => {
  const formatted = formatData(users, ["userCreatedAt", "userUpdatedAt"], []);
  return formatted.map((user) => {
    const { userPassword, ...safe } = user || {};
    return safe;
  });
};

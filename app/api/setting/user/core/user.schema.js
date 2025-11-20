import { z } from "zod";
import {
  preprocessString,
  preprocessEnum,
  formatData,
} from "@/lib/zodSchema";

export const userPostSchema = z.object({
  userFirstName: preprocessString("Please provide userFirstname"),
  userLastName: preprocessString("Please provide userLastName"),
  userEmail: preprocessString("Please provide userEmail"),
  userPassword: preprocessString("Please provide userPassword"),
  userCreatedBy: preprocessString("Please provide the creator ID"),
});

export const userPutSchema = z.object({
  userId: preprocessString("Please provide the user ID"),
  userFirstName: preprocessString("Please provide userFirstname"),
  userLastName: preprocessString("Please provide userLastName"),
  userEmail: preprocessString("Please provide userEmail"),
  userStatus: preprocessEnum(
    ["Enable", "Disable"],
    "Please provide userStatus"
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

import { z } from "zod";
import { preprocessString, preprocessEnum, formatData } from "@/lib/zodSchema";
import logger from "@/lib/logger.node";

logger.info({ message: "User schema loaded" });

export const userPostSchema = z.object({
  userName: preprocessString("Please provide the user name"),
  userCreatedBy: preprocessString("Please provide the creator ID"),
});

export const userPutSchema = z.object({
  userId: preprocessString("Please provide the user ID"),
  userName: preprocessString("Please provide the user name"),
  userStatus: preprocessEnum(
    ["Enable", "Disable"],
    "Please provide user status'"
  ),
  userUpdatedBy: preprocessString("Please provide the updater ID"),
});

export const formatUserData = (users) => {
  logger.info({
    message: "Formatting user data",
    count: users.length,
  });
  return formatData(
    users,
    ["userCreatedAt", "userUpdatedAt"],
    []
  );
};

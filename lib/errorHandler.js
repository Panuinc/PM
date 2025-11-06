import { NextResponse } from "next/server";
import logger from "@/lib/logger.node";

export const handleZodError = (error) => {
  const details = error.flatten().fieldErrors;
  logger.warn({ message: "Validation error", details });
  return NextResponse.json(
    { error: "Invalid input", details },
    { status: 422 }
  );
};

export const handleGenericError = (error, context = "Server error") => {
  logger.error({
    message: context,
    error: error.message,
    stack: error.stack,
  });
  return NextResponse.json({ error: context }, { status: 500 });
};

export const handleErrors = (error, context = "Error occurred") => {
  if (error.name === "ZodError") return handleZodError(error);
  return handleGenericError(error, context);
};

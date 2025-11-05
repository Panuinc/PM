import { NextResponse } from "next/server";
import logger from "@/lib/logger.node";

export function handleZodError(error) {
  const details = error.flatten().fieldErrors;
  logger.warn({ message: "Validation error", details });
  return NextResponse.json(
    { error: "Invalid input", details },
    { status: 422 }
  );
}

export function handleGenericError(error, context = "An error occurred") {
  logger.error({
    message: context,
    error: error.message || error,
    stack: error.stack || null,
  });
  return NextResponse.json({ error: context }, { status: 500 });
}

export function handleErrors(error, ip = "", context = "An error occurred") {
  if (error?.status) {
    const status = error.status;
    const message =
      error.message ||
      (status === 500 ? "Internal server error" : "Unexpected error");

    logger.warn({
      message: "Handled error with explicit status",
      status,
      context,
      details: error.details || null,
    });

    return NextResponse.json(
      { error: message, details: error.details ?? null },
      { status }
    );
  }

  if (error.name === "ZodError") return handleZodError(error);
  return handleGenericError(error, context);
}

export function handleGetErrors(error, ip = "", context = "An error occurred") {
  if (error?.status) {
    const status = error.status;
    const message =
      error.message ||
      (status === 500 ? "Failed to retrieve data" : "Unexpected error");

    logger.warn({
      message: "Handled GET error with explicit status",
      status,
      context,
    });

    return NextResponse.json(
      { error: message, details: error.details ?? null },
      { status }
    );
  }

  return handleGenericError(error, context);
}

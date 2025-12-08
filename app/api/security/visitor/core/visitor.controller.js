import { NextResponse } from "next/server";
import {
  GetAllVisitorUseCase,
  GetVisitorByIdUseCase,
  CreateVisitorUseCase,
  UpdateVisitorUseCase,
} from "@/app/api/security/visitor/usecases/visitor.usecase";
import { formatVisitorData } from "@/app/api/security/visitor/core/visitor.schema";

function normalizeError(error) {
  const fallback = {
    status: 500,
    message: "Internal server error",
  };

  if (!error) return fallback;

  if (typeof error === "object" && !Array.isArray(error)) {
    const status = error.status || 500;
    const message =
      typeof error.message === "string" && error.message.trim()
        ? error.message
        : fallback.message;
    const details = error.details;
    return { status, message, details };
  }

  if (error instanceof Error) {
    return {
      status: 500,
      message: error.message || fallback.message,
    };
  }

  return fallback;
}

function buildErrorResponse(error) {
  const normalized = normalizeError(error);
  const body = {
    error: normalized.message,
  };
  if (normalized.details) {
    body.details = normalized.details;
  }

  return NextResponse.json(body, { status: normalized.status });
}

export async function getAllVisitor(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "1000000", 10);

    const { visitors, total } = await GetAllVisitorUseCase(page, limit);

    return NextResponse.json({
      message: "Success",
      total,
      page,
      limit,
      visitors: formatVisitorData(visitors),
    });
  } catch (error) {
    return buildErrorResponse(error);
  }
}

export async function getVisitorById(request, visitorId) {
  try {
    const visitor = await GetVisitorByIdUseCase(visitorId);
    return NextResponse.json({
      message: "Success",
      visitor: formatVisitorData([visitor])[0],
    });
  } catch (error) {
    return buildErrorResponse(error);
  }
}

export async function createVisitor(request) {
  try {
    const data = await request.json();
    const visitor = await CreateVisitorUseCase(data);
    return NextResponse.json(
      {
        message: "Created",
        visitor: formatVisitorData([visitor])[0],
      },
      { status: 201 }
    );
  } catch (error) {
    return buildErrorResponse(error);
  }
}

export async function updateVisitor(request, visitorId) {
  try {
    const data = await request.json();
    const visitor = await UpdateVisitorUseCase({ ...data, visitorId });
    return NextResponse.json({
      message: "Updated",
      visitor: formatVisitorData([visitor])[0],
    });
  } catch (error) {
    return buildErrorResponse(error);
  }
}

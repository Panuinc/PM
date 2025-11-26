import { NextResponse } from "next/server";
import {
  GetAllDeliveryUseCase,
  GetDeliveryByIdUseCase,
  CreateDeliveryUseCase,
  UpdateDeliveryUseCase,
} from "@/app/api/logistic/delivery/usecases/delivery.usecase";
import { formatDeliveryData } from "@/app/api/logistic/delivery/core/delivery.schema";

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

export async function getAllDelivery(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "1000000", 10);

    const { deliverys, total } = await GetAllDeliveryUseCase(page, limit);

    return NextResponse.json({
      message: "Success",
      total,
      page,
      limit,
      deliverys: formatDeliveryData(deliverys),
    });
  } catch (error) {
    return buildErrorResponse(error);
  }
}

export async function getDeliveryById(request, deliveryId) {
  try {
    const delivery = await GetDeliveryByIdUseCase(deliveryId);
    return NextResponse.json({
      message: "Success",
      delivery: formatDeliveryData([delivery])[0],
    });
  } catch (error) {
    return buildErrorResponse(error);
  }
}

export async function createDelivery(request) {
  try {
    const data = await request.json();
    const delivery = await CreateDeliveryUseCase(data);
    return NextResponse.json(
      {
        message: "Created",
        delivery: formatDeliveryData([delivery])[0],
      },
      { status: 201 }
    );
  } catch (error) {
    return buildErrorResponse(error);
  }
}

export async function updateDelivery(request, deliveryId) {
  try {
    const data = await request.json();
    const delivery = await UpdateDeliveryUseCase({ ...data, deliveryId });
    return NextResponse.json({
      message: "Updated",
      delivery: formatDeliveryData([delivery])[0],
    });
  } catch (error) {
    return buildErrorResponse(error);
  }
}

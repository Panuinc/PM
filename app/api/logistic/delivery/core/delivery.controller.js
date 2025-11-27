import { NextResponse } from "next/server";
import { saveUploadedFile } from "@/lib/fileStore";
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

function parseJsonSafe(value, fallbackValue) {
  if (value == null || value === "") return fallbackValue;
  try {
    return JSON.parse(String(value));
  } catch {
    return fallbackValue;
  }
}

function sanitizeBaseName(input) {
  const v = String(input || "").trim();
  if (!v) return `file_${Date.now()}`;
  return v.replace(/[^a-zA-Z0-9-_]/g, "_");
}

async function validateAndSaveImageFile(file, typeFolder, baseName) {
  if (!file) return null;

  const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
  if (!allowedTypes.includes(file.type)) {
    throw {
      status: 400,
      message: "Invalid file type. Only images are allowed.",
    };
  }

  const maxSize = 10 * 1024 * 1024;
  if (file.size > maxSize) {
    throw {
      status: 400,
      message: "File size exceeds 10MB limit.",
    };
  }

  const filePath = await saveUploadedFile(file, typeFolder, baseName);
  return `/${filePath}`;
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
    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();

      const deliveryInvoiceNumber = String(
        formData.get("deliveryInvoiceNumber") || ""
      );
      const deliveryLocation = String(formData.get("deliveryLocation") || "");
      const deliveryCreatedBy = String(formData.get("deliveryCreatedBy") || "");

      const file = formData.get("file");
      if (!file) {
        throw {
          status: 422,
          message: "Please provide delivery picture file",
        };
      }

      const baseName = sanitizeBaseName(deliveryInvoiceNumber);
      const deliveryPicture = await validateAndSaveImageFile(
        file,
        "delivery",
        baseName
      );

      const delivery = await CreateDeliveryUseCase({
        deliveryInvoiceNumber,
        deliveryLocation,
        deliveryPicture,
        deliveryCreatedBy,
      });

      return NextResponse.json(
        {
          message: "Created",
          delivery: formatDeliveryData([delivery])[0],
        },
        { status: 201 }
      );
    }

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
    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();

      const deliveryInvoiceNumber = String(
        formData.get("deliveryInvoiceNumber") || ""
      );
      const deliveryLocation = String(formData.get("deliveryLocation") || "");
      const deliveryStatus = String(formData.get("deliveryStatus") || "");
      const deliveryUpdatedBy = String(formData.get("deliveryUpdatedBy") || "");

      const file = formData.get("file");

      let deliveryPicture = String(formData.get("deliveryPicture") || "");
      if (!deliveryPicture) {
        const existing = await GetDeliveryByIdUseCase(deliveryId);
        deliveryPicture = existing?.deliveryPicture || "";
      }

      if (file) {
        const baseName = sanitizeBaseName(deliveryInvoiceNumber || deliveryId);
        deliveryPicture = await validateAndSaveImageFile(
          file,
          "delivery",
          baseName
        );
      }

      const delivery = await UpdateDeliveryUseCase({
        deliveryId,
        deliveryInvoiceNumber,
        deliveryLocation,
        deliveryPicture,
        deliveryStatus,
        deliveryUpdatedBy,
      });

      return NextResponse.json({
        message: "Updated",
        delivery: formatDeliveryData([delivery])[0],
      });
    }

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

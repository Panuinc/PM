import { NextResponse } from "next/server";
import { saveUploadedFile } from "@/lib/fileStore";
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
    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();

      const visitorFirstName = String(formData.get("visitorFirstName") || "");
      const visitorLastName = String(formData.get("visitorLastName") || "");
      const visitorCompany = String(formData.get("visitorCompany") || "");
      const visitorCarRegistration = String(
        formData.get("visitorCarRegistration") || ""
      );
      const visitorProvince = String(formData.get("visitorProvince") || "");
      const visitorContactUserId = String(
        formData.get("visitorContactUserId") || ""
      );
      const visitorContactReason = String(
        formData.get("visitorContactReason") || ""
      );
      const visitorCreatedBy = String(formData.get("visitorCreatedBy") || "");

      const timestamp = Date.now();
      const visitorFolder = sanitizeBaseName(
        `${visitorFirstName}_${visitorLastName}_${timestamp}`
      );
      const folder = `visitor/${visitorFolder}`;

      const visitorPhotoFile = formData.get("visitorPhotoFile");
      let visitorPhoto = String(formData.get("visitorPhoto") || "");

      if (visitorPhotoFile && visitorPhotoFile.size > 0) {
        const baseName = `photo_${timestamp}`;
        visitorPhoto = await validateAndSaveImageFile(
          visitorPhotoFile,
          folder,
          baseName
        );
      }

      const documentFiles = formData
        .getAll("visitorDocumentFiles")
        .filter(Boolean);
      const documentPhotoPaths = [];

      for (let i = 0; i < documentFiles.length; i++) {
        const f = documentFiles[i];
        if (f && f.size > 0) {
          const baseName = `document_${timestamp}_${i}`;
          const p = await validateAndSaveImageFile(f, folder, baseName);
          if (p) documentPhotoPaths.push(p);
        }
      }

      const visitorDocumentPhotos =
        documentPhotoPaths.length > 0 ? JSON.stringify(documentPhotoPaths) : "";

      const visitor = await CreateVisitorUseCase({
        visitorFirstName,
        visitorLastName,
        visitorCompany,
        visitorCarRegistration,
        visitorProvince,
        visitorContactUserId,
        visitorContactReason,
        visitorPhoto,
        visitorDocumentPhotos,
        visitorCreatedBy,
      });

      return NextResponse.json(
        {
          message: "Created",
          visitor: formatVisitorData([visitor])[0],
        },
        { status: 201 }
      );
    }

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
    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();

      const visitorFirstName = String(formData.get("visitorFirstName") || "");
      const visitorLastName = String(formData.get("visitorLastName") || "");
      const visitorCompany = String(formData.get("visitorCompany") || "");
      const visitorCarRegistration = String(
        formData.get("visitorCarRegistration") || ""
      );
      const visitorProvince = String(formData.get("visitorProvince") || "");
      const visitorContactUserId = String(
        formData.get("visitorContactUserId") || ""
      );
      const visitorContactReason = String(
        formData.get("visitorContactReason") || ""
      );
      const visitorStatus = String(formData.get("visitorStatus") || "");
      const visitorUpdatedBy = String(formData.get("visitorUpdatedBy") || "");

      const existing = await GetVisitorByIdUseCase(visitorId);

      const timestamp = Date.now();
      const visitorFolder = sanitizeBaseName(
        `${visitorFirstName}_${visitorLastName}_${visitorId}`
      );
      const folder = `visitor/${visitorFolder}`;

      const visitorPhotoFile = formData.get("visitorPhotoFile");
      let visitorPhoto = String(
        formData.get("visitorPhoto") || existing?.visitorPhoto || ""
      );

      if (visitorPhotoFile && visitorPhotoFile.size > 0) {
        const baseName = `photo_${timestamp}`;
        visitorPhoto = await validateAndSaveImageFile(
          visitorPhotoFile,
          folder,
          baseName
        );
      }

      const documentFiles = formData
        .getAll("visitorDocumentFiles")
        .filter(Boolean);

      let existingDocPhotos = [];
      try {
        const existingStr =
          formData.get("visitorDocumentPhotos") ||
          existing?.visitorDocumentPhotos ||
          "";
        if (existingStr) {
          existingDocPhotos = JSON.parse(existingStr);
        }
      } catch {
        existingDocPhotos = [];
      }

      for (let i = 0; i < documentFiles.length; i++) {
        const f = documentFiles[i];
        if (f && f.size > 0) {
          const baseName = `document_${timestamp}_${i}`;
          const p = await validateAndSaveImageFile(f, folder, baseName);
          if (p) existingDocPhotos.push(p);
        }
      }

      const visitorDocumentPhotos =
        existingDocPhotos.length > 0 ? JSON.stringify(existingDocPhotos) : "";

      const visitor = await UpdateVisitorUseCase({
        visitorId,
        visitorFirstName,
        visitorLastName,
        visitorCompany,
        visitorCarRegistration,
        visitorProvince,
        visitorContactUserId,
        visitorContactReason,
        visitorPhoto,
        visitorDocumentPhotos,
        visitorStatus,
        visitorUpdatedBy,
      });

      return NextResponse.json({
        message: "Updated",
        visitor: formatVisitorData([visitor])[0],
      });
    }

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

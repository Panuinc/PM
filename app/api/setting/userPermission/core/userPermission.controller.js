import { NextResponse } from "next/server";
import {
  GetAllUserPermissionUseCase,
  GetUserPermissionByIdUseCase,
  CreateUserPermissionUseCase,
  UpdateUserPermissionUseCase,
} from "@/app/api/setting/userPermission/usecases/userPermission.usecase";
import { formatUserPermissionData } from "@/app/api/setting/userPermission/core/userPermission.schema";

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

export async function getAllUserPermission(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "1000000", 10);

    const { userPermissions, total } = await GetAllUserPermissionUseCase(page, limit);

    return NextResponse.json({
      message: "Success",
      total,
      page,
      limit,
      userPermissions: formatUserPermissionData(userPermissions),
    });
  } catch (error) {
    return buildErrorResponse(error);
  }
}

export async function getUserPermissionById(request, userPermissionId) {
  try {
    const userPermission = await GetUserPermissionByIdUseCase(userPermissionId);
    return NextResponse.json({
      message: "Success",
      userPermission: formatUserPermissionData([userPermission])[0],
    });
  } catch (error) {
    return buildErrorResponse(error);
  }
}

export async function createUserPermission(request) {
  try {
    const data = await request.json();
    const userPermission = await CreateUserPermissionUseCase(data);
    return NextResponse.json(
      {
        message: "Created",
        userPermission: formatUserPermissionData([userPermission])[0],
      },
      { status: 201 }
    );
  } catch (error) {
    return buildErrorResponse(error);
  }
}

export async function updateUserPermission(request, userPermissionId) {
  try {
    const data = await request.json();
    const userPermission = await UpdateUserPermissionUseCase({ ...data, userPermissionId });
    return NextResponse.json({
      message: "Updated",
      userPermission: formatUserPermissionData([userPermission])[0],
    });
  } catch (error) {
    return buildErrorResponse(error);
  }
}

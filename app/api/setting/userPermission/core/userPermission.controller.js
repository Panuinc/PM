import { NextResponse } from "next/server";
import {
  GetPermissionsForUserUseCase,
  UpdateUserPermissionsForUserUseCase,
} from "@/app/api/setting/userPermission/usecases/userPermission.usecase";

function normalizeError(error) {
  const fallback = { status: 500, message: "Internal server error" };

  if (!error) return fallback;

  if (typeof error === "object") {
    return {
      status: error.status || 500,
      message: error.message || fallback.message,
      details: error.details,
    };
  }

  return fallback;
}

function buildErrorResponse(error) {
  const normalized = normalizeError(error);
  return NextResponse.json(
    { error: normalized.message, details: normalized.details },
    { status: normalized.status }
  );
}

export async function getPermissionsForUser(request, userId) {
  try {
    const permissions = await GetPermissionsForUserUseCase(userId);
    return NextResponse.json({
      message: "Success",
      userId,
      permissions,
    });
  } catch (error) {
    return buildErrorResponse(error);
  }
}

export async function updatePermissionsForUser(request, userId) {
  try {
    const data = await request.json();

    const permissions = await UpdateUserPermissionsForUserUseCase({
      ...data,
      userPermissionUserId: userId,
    });

    return NextResponse.json({
      message: "Updated",
      userId,
      permissions,
    });
  } catch (error) {
    return buildErrorResponse(error);
  }
}

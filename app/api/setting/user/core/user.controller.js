import { NextResponse } from "next/server";
import {
  GetAllUserUseCase,
  GetUserByIdUseCase,
  CreateUserUseCase,
  UpdateUserUseCase,
} from "@/app/api/setting/user/usecases/user.usecase";
import { formatUserData } from "@/app/api/setting/user/core/user.schema";

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

export async function getAllUser(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "1000000", 10);

    const { users, total } = await GetAllUserUseCase(page, limit);

    return NextResponse.json({
      message: "Success",
      total,
      page,
      limit,
      users: formatUserData(users),
    });
  } catch (error) {
    return buildErrorResponse(error);
  }
}

export async function getUserById(request, userId) {
  try {
    const user = await GetUserByIdUseCase(userId);
    return NextResponse.json({
      message: "Success",
      user: formatUserData([user])[0],
    });
  } catch (error) {
    return buildErrorResponse(error);
  }
}

export async function createUser(request) {
  try {
    const data = await request.json();
    const user = await CreateUserUseCase(data);
    return NextResponse.json(
      {
        message: "Created",
        user: formatUserData([user])[0],
      },
      { status: 201 }
    );
  } catch (error) {
    return buildErrorResponse(error);
  }
}

export async function updateUser(request, userId) {
  try {
    const data = await request.json();
    const user = await UpdateUserUseCase({ ...data, userId });
    return NextResponse.json({
      message: "Updated",
      user: formatUserData([user])[0],
    });
  } catch (error) {
    return buildErrorResponse(error);
  }
}

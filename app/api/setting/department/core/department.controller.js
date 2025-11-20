import { NextResponse } from "next/server";
import {
  GetAllDepartmentUseCase,
  GetDepartmentByIdUseCase,
  CreateDepartmentUseCase,
  UpdateDepartmentUseCase,
} from "@/app/api/setting/department/usecases/department.usecase";
import { formatDepartmentData } from "@/app/api/setting/department/core/department.schema";

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

export async function getAllDepartment(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "1000000", 10);

    const { departments, total } = await GetAllDepartmentUseCase(page, limit);

    return NextResponse.json({
      message: "Success",
      total,
      page,
      limit,
      departments: formatDepartmentData(departments),
    });
  } catch (error) {
    return buildErrorResponse(error);
  }
}

export async function getDepartmentById(request, departmentId) {
  try {
    const department = await GetDepartmentByIdUseCase(departmentId);
    return NextResponse.json({
      message: "Success",
      department: formatDepartmentData([department])[0],
    });
  } catch (error) {
    return buildErrorResponse(error);
  }
}

export async function createDepartment(request) {
  try {
    const data = await request.json();
    const department = await CreateDepartmentUseCase(data);
    return NextResponse.json(
      {
        message: "Created",
        department: formatDepartmentData([department])[0],
      },
      { status: 201 }
    );
  } catch (error) {
    return buildErrorResponse(error);
  }
}

export async function updateDepartment(request, departmentId) {
  try {
    const data = await request.json();
    const department = await UpdateDepartmentUseCase({ ...data, departmentId });
    return NextResponse.json({
      message: "Updated",
      department: formatDepartmentData([department])[0],
    });
  } catch (error) {
    return buildErrorResponse(error);
  }
}

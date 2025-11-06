import { NextResponse } from "next/server";
import {
  GetAllPermissionUseCase,
  GetPermissionByIdUseCase,
  CreatePermissionUseCase,
  UpdatePermissionUseCase,
} from "@/app/api/setting/permission/usecases/permissions.usecase";
import { formatPermissionData } from "@/app/api/setting/permission/core/permission.schema";
import logger from "@/lib/logger.node";

export async function getAllPermission(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "1000000", 10);

    const { permissions, total } = await GetAllPermissionUseCase(page, limit);
    return NextResponse.json({
      message: "Success",
      total,
      page,
      limit,
      permissions: formatPermissionData(permissions),
    });
  } catch (error) {
    logger.error(error);
    return NextResponse.json(
      { error: error.message },
      { status: error.status || 500 }
    );
  }
}

export async function getPermissionById(request, permissionId) {
  try {
    const permission = await GetPermissionByIdUseCase(permissionId);
    return NextResponse.json({
      message: "Success",
      permission: formatPermissionData([permission])[0],
    });
  } catch (error) {
    logger.error(error);
    return NextResponse.json(
      { error: error.message },
      { status: error.status || 500 }
    );
  }
}

export async function createPermission(request) {
  try {
    const data = await request.json();
    const permission = await CreatePermissionUseCase(data);
    return NextResponse.json({
      message: "Created",
      permission: formatPermissionData([permission])[0],
    });
  } catch (error) {
    logger.error(error);
    return NextResponse.json(
      { error: error.message },
      { status: error.status || 500 }
    );
  }
}

export async function updatePermission(request, permissionId) {
  try {
    const data = await request.json();
    const permission = await UpdatePermissionUseCase({ ...data, permissionId });
    return NextResponse.json({
      message: "Updated",
      permission: formatPermissionData([permission])[0],
    });
  } catch (error) {
    logger.error(error);
    return NextResponse.json(
      { error: error.message },
      { status: error.status || 500 }
    );
  }
}

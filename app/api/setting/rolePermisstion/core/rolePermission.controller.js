import { NextResponse } from "next/server";
import {
  GetAllRolePermissionUseCase,
  GetRolePermissionByIdUseCase,
  CreateRolePermissionUseCase,
  UpdateRolePermissionUseCase,
} from "@/app/api/setting/rolePermission/usecases/rolePermissions.usecase";
import { formatRolePermissionData } from "@/app/api/setting/rolePermission/core/rolePermission.schema";
import logger from "@/lib/logger.node";

export async function getAllRolePermission(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "1000000", 10);

    const { rolePermissions, total } = await GetAllRolePermissionUseCase(page, limit);
    return NextResponse.json({
      message: "Success",
      total,
      page,
      limit,
      rolePermissions: formatRolePermissionData(rolePermissions),
    });
  } catch (error) {
    logger.error(error);
    return NextResponse.json(
      { error: error.message },
      { status: error.status || 500 }
    );
  }
}

export async function getRolePermissionById(request, rolePermissionId) {
  try {
    const rolePermission = await GetRolePermissionByIdUseCase(rolePermissionId);
    return NextResponse.json({
      message: "Success",
      rolePermission: formatRolePermissionData([rolePermission])[0],
    });
  } catch (error) {
    logger.error(error);
    return NextResponse.json(
      { error: error.message },
      { status: error.status || 500 }
    );
  }
}

export async function createRolePermission(request) {
  try {
    const data = await request.json();
    const rolePermission = await CreateRolePermissionUseCase(data);
    return NextResponse.json({
      message: "Created",
      rolePermission: formatRolePermissionData([rolePermission])[0],
    });
  } catch (error) {
    logger.error(error);
    return NextResponse.json(
      { error: error.message },
      { status: error.status || 500 }
    );
  }
}

export async function updateRolePermission(request, rolePermissionId) {
  try {
    const data = await request.json();
    const rolePermission = await UpdateRolePermissionUseCase({ ...data, rolePermissionId });
    return NextResponse.json({
      message: "Updated",
      rolePermission: formatRolePermissionData([rolePermission])[0],
    });
  } catch (error) {
    logger.error(error);
    return NextResponse.json(
      { error: error.message },
      { status: error.status || 500 }
    );
  }
}

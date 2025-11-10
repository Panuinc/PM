import { NextResponse } from "next/server";
import {
  GetAllUserPermissionUseCase,
  GetUserPermissionByIdUseCase,
  CreateUserPermissionUseCase,
  UpdateUserPermissionUseCase,
} from "@/app/api/setting/userPermission/usecases/userPermissions.usecase";
import { formatUserPermissionData } from "@/app/api/setting/userPermission/core/userPermission.schema";
import logger from "@/lib/logger.node";

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
    logger.error(error);
    return NextResponse.json(
      { error: error.message },
      { status: error.status || 500 }
    );
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
    logger.error(error);
    return NextResponse.json(
      { error: error.message },
      { status: error.status || 500 }
    );
  }
}

export async function createUserPermission(request) {
  try {
    const data = await request.json();
    const userPermission = await CreateUserPermissionUseCase(data);
    return NextResponse.json({
      message: "Created",
      userPermission: formatUserPermissionData([userPermission])[0],
    });
  } catch (error) {
    logger.error(error);
    return NextResponse.json(
      { error: error.message },
      { status: error.status || 500 }
    );
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
    logger.error(error);
    return NextResponse.json(
      { error: error.message },
      { status: error.status || 500 }
    );
  }
}

import { NextResponse } from "next/server";
import {
  GetAllPermissionGroupUseCase,
  GetPermissionGroupByIdUseCase,
  CreatePermissionGroupUseCase,
  UpdatePermissionGroupUseCase,
} from "@/app/api/setting/permissionGroup/usecases/permissionGroups.usecase";
import { formatPermissionGroupData } from "@/app/api/setting/permissionGroup/core/permissionGroup.schema";
import logger from "@/lib/logger.node";

export async function getAllPermissionGroup(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "1000000", 10);

    const { permissionGroups, total } = await GetAllPermissionGroupUseCase(
      page,
      limit
    );

    return NextResponse.json({
      message: "Success",
      total,
      page,
      limit,
      permissionGroups: formatPermissionGroupData(permissionGroups),
    });
  } catch (error) {
    logger.error(error);
    return NextResponse.json(
      { error: error.message },
      { status: error.status || 500 }
    );
  }
}

export async function getPermissionGroupById(request, permissionGroupId) {
  try {
    const permissionGroup = await GetPermissionGroupByIdUseCase(
      permissionGroupId
    );

    return NextResponse.json({
      message: "Success",
      permissionGroup: formatPermissionGroupData([permissionGroup])[0],
    });
  } catch (error) {
    logger.error(error);
    return NextResponse.json(
      { error: error.message },
      { status: error.status || 500 }
    );
  }
}

export async function createPermissionGroup(request) {
  try {
    const data = await request.json();

    const permissionGroup = await CreatePermissionGroupUseCase(data);

    return NextResponse.json({
      message: "Created",
      permissionGroup: formatPermissionGroupData([permissionGroup])[0],
    });
  } catch (error) {
    logger.error(error);
    return NextResponse.json(
      { error: error.message },
      { status: error.status || 500 }
    );
  }
}

export async function updatePermissionGroup(request, permissionGroupId) {
  try {
    const data = await request.json();

    const permissionGroup = await UpdatePermissionGroupUseCase({
      ...data,
      permissionGroupId,
    });

    return NextResponse.json({
      message: "Updated",
      permissionGroup: formatPermissionGroupData([permissionGroup])[0],
    });
  } catch (error) {
    logger.error(error);
    return NextResponse.json(
      { error: error.message },
      { status: error.status || 500 }
    );
  }
}

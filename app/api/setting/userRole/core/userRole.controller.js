import { NextResponse } from "next/server";
import {
  GetAllUserRoleUseCase,
  GetUserRoleByIdUseCase,
  CreateUserRoleUseCase,
  UpdateUserRoleUseCase,
} from "@/app/api/setting/userRole/usecases/userRoles.usecase";
import { formatUserRoleData } from "@/app/api/setting/userRole/core/userRole.schema";
import logger from "@/lib/logger.node";

export async function getAllUserRole(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "1000000", 10);

    const { userRoles, total } = await GetAllUserRoleUseCase(page, limit);
    return NextResponse.json({
      message: "Success",
      total,
      page,
      limit,
      userRoles: formatUserRoleData(userRoles),
    });
  } catch (error) {
    logger.error(error);
    return NextResponse.json(
      { error: error.message },
      { status: error.status || 500 }
    );
  }
}

export async function getUserRoleById(request, userRoleId) {
  try {
    const userRole = await GetUserRoleByIdUseCase(userRoleId);
    return NextResponse.json({
      message: "Success",
      userRole: formatUserRoleData([userRole])[0],
    });
  } catch (error) {
    logger.error(error);
    return NextResponse.json(
      { error: error.message },
      { status: error.status || 500 }
    );
  }
}

export async function createUserRole(request) {
  try {
    const data = await request.json();
    const userRole = await CreateUserRoleUseCase(data);
    return NextResponse.json({
      message: "Created",
      userRole: formatUserRoleData([userRole])[0],
    });
  } catch (error) {
    logger.error(error);
    return NextResponse.json(
      { error: error.message },
      { status: error.status || 500 }
    );
  }
}

export async function updateUserRole(request, userRoleId) {
  try {
    const data = await request.json();
    const userRole = await UpdateUserRoleUseCase({ ...data, userRoleId });
    return NextResponse.json({
      message: "Updated",
      userRole: formatUserRoleData([userRole])[0],
    });
  } catch (error) {
    logger.error(error);
    return NextResponse.json(
      { error: error.message },
      { status: error.status || 500 }
    );
  }
}

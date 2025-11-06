import { NextResponse } from "next/server";
import {
  GetAllRoleUseCase,
  GetRoleByIdUseCase,
  CreateRoleUseCase,
  UpdateRoleUseCase,
} from "@/app/api/setting/role/usecases/roles.usecase";
import { formatRoleData } from "@/app/api/setting/role/core/role.schema";
import logger from "@/lib/logger.node";

export async function getAllRole(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "1000000", 10);

    const { roles, total } = await GetAllRoleUseCase(page, limit);
    return NextResponse.json({
      message: "Success",
      total,
      page,
      limit,
      roles: formatRoleData(roles),
    });
  } catch (error) {
    logger.error(error);
    return NextResponse.json(
      { error: error.message },
      { status: error.status || 500 }
    );
  }
}

export async function getRoleById(request, roleId) {
  try {
    const role = await GetRoleByIdUseCase(roleId);
    return NextResponse.json({
      message: "Success",
      role: formatRoleData([role])[0],
    });
  } catch (error) {
    logger.error(error);
    return NextResponse.json(
      { error: error.message },
      { status: error.status || 500 }
    );
  }
}

export async function createRole(request) {
  try {
    const data = await request.json();
    const role = await CreateRoleUseCase(data);
    return NextResponse.json({
      message: "Created",
      role: formatRoleData([role])[0],
    });
  } catch (error) {
    logger.error(error);
    return NextResponse.json(
      { error: error.message },
      { status: error.status || 500 }
    );
  }
}

export async function updateRole(request, roleId) {
  try {
    const data = await request.json();
    const role = await UpdateRoleUseCase({ ...data, roleId });
    return NextResponse.json({
      message: "Updated",
      role: formatRoleData([role])[0],
    });
  } catch (error) {
    logger.error(error);
    return NextResponse.json(
      { error: error.message },
      { status: error.status || 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { CreateDepartmentUseCase } from "@/app/api/setting/department/usecases/createDepartment.usecase";
import { UpdateDepartmentUseCase } from "@/app/api/setting/department/usecases/updateDepartment.usecase";
import { GetAllDepartmentUseCase } from "@/app/api/setting/department/usecases/getAllDepartments.usecase";
import { GetDepartmentByIdUseCase } from "@/app/api/setting/department/usecases/getDepartmentById.usecase";
import { formatDepartmentData } from "@/app/api/setting/department/department.schema";
import logger from "@/lib/logger.node";

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
    logger.error(error);
    return NextResponse.json(
      { error: error.message },
      { status: error.status || 500 }
    );
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
    logger.error(error);
    return NextResponse.json(
      { error: error.message },
      { status: error.status || 500 }
    );
  }
}

export async function createDepartment(request) {
  try {
    const data = await request.json();
    const department = await CreateDepartmentUseCase(data);
    return NextResponse.json({
      message: "Created",
      department: formatDepartmentData([department])[0],
    });
  } catch (error) {
    logger.error(error);
    return NextResponse.json(
      { error: error.message },
      { status: error.status || 500 }
    );
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
    logger.error(error);
    return NextResponse.json(
      { error: error.message },
      { status: error.status || 500 }
    );
  }
}

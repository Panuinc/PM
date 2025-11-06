import { DepartmentService } from "@/app/api/setting/department/department.service";
import {
  departmentPostSchema,
  departmentPutSchema,
} from "@/app/api/setting/department/department.schema";
import { DepartmentValidator } from "@/app/api/setting/department/department.validator";
import { getLocalNow } from "@/lib/getLocalNow";
import logger from "@/lib/logger.node";

export async function GetAllDepartmentUseCase(page = 1, limit = 1000000) {
  const skip = (page - 1) * limit;
  const departments = await DepartmentService.getAllPaginated(skip, limit);
  const total = await DepartmentService.countAll();

  logger.info({ message: "GetAllDepartmentUseCase success", total });
  return { departments, total };
}

export async function GetDepartmentByIdUseCase(departmentId) {
  if (!departmentId || typeof departmentId !== "string")
    throw { status: 400, message: "Invalid department ID" };

  const department = await DepartmentService.getById(departmentId);
  if (!department) throw { status: 404, message: "Department not found" };

  logger.info({ message: "GetDepartmentByIdUseCase success", departmentId });
  return department;
}

export async function CreateDepartmentUseCase(data) {
  logger.info({ message: "CreateDepartmentUseCase start", data });

  const parsed = departmentPostSchema.safeParse(data);
  if (!parsed.success) {
    logger.warn({
      message: "Validation failed",
      errors: parsed.error.flatten().fieldErrors,
    });
    throw {
      status: 422,
      message: "Invalid input",
      details: parsed.error.flatten().fieldErrors,
    };
  }

  const duplicate = await DepartmentValidator.isDuplicateDepartmentName(
    parsed.data.departmentName
  );
  if (duplicate)
    throw {
      status: 409,
      message: `Department '${parsed.data.departmentName}' already exists`,
    };

  const department = await DepartmentService.create({
    departmentName: parsed.data.departmentName.trim(),
    departmentCreatedBy: parsed.data.departmentCreatedBy,
    departmentCreatedAt: getLocalNow(),
  });

  logger.info({
    message: "Department created successfully",
    departmentId: department.departmentId,
  });

  return department;
}

export async function UpdateDepartmentUseCase(data) {
  logger.info({ message: "UpdateDepartmentUseCase start", data });

  const parsed = departmentPutSchema.safeParse(data);
  if (!parsed.success) {
    logger.warn({
      message: "Validation failed",
      errors: parsed.error.flatten().fieldErrors,
    });
    throw {
      status: 422,
      message: "Invalid input",
      details: parsed.error.flatten().fieldErrors,
    };
  }

  const existing = await DepartmentService.getById(parsed.data.departmentId);
  if (!existing) throw { status: 404, message: "Department not found" };

  if (
    parsed.data.departmentName.trim().toLowerCase() !==
    existing.departmentName.trim().toLowerCase()
  ) {
    const duplicate = await DepartmentValidator.isDuplicateDepartmentName(
      parsed.data.departmentName
    );
    if (duplicate)
      throw {
        status: 409,
        message: `Department '${parsed.data.departmentName}' already exists`,
      };
  }

  const updatedDepartment = await DepartmentService.update(
    parsed.data.departmentId,
    {
      departmentName: parsed.data.departmentName.trim(),
      departmentStatus: parsed.data.departmentStatus.trim(),
      departmentUpdatedBy: parsed.data.departmentUpdatedBy,
      departmentUpdatedAt: getLocalNow(),
    }
  );

  logger.info({
    message: "Department updated successfully",
    departmentId: parsed.data.departmentId,
  });

  return updatedDepartment;
}

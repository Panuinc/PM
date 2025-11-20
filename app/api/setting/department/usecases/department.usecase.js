import { DepartmentService } from "@/app/api/setting/department/core/department.service";
import {
  departmentPostSchema,
  departmentPutSchema,
} from "@/app/api/setting/department/core/department.schema";
import { DepartmentValidator } from "@/app/api/setting/department/core/department.validator";
import { getLocalNow } from "@/lib/getLocalNow";
import logger from "@/lib/logger.node";

export async function GetAllDepartmentUseCase(page = 1, limit = 1000000) {
  const skip = (page - 1) * limit;
  const departments = await DepartmentService.getAllPaginated(skip, limit);
  const total = await DepartmentService.countAll();

  return { departments, total };
}

export async function GetDepartmentByIdUseCase(departmentId) {
  if (!departmentId || typeof departmentId !== "string") {
    throw { status: 400, message: "Invalid department ID" };
  }

  const department = await DepartmentService.getById(departmentId);
  if (!department) {
    throw { status: 404, message: "Department not found" };
  }

  return department;
}

export async function CreateDepartmentUseCase(data) {
  logger.info({
    message: "CreateDepartmentUseCase start",
    departmentName: data?.departmentName,
    departmentCreatedBy: data?.departmentCreatedBy,
  });

  const parsed = departmentPostSchema.safeParse(data);
  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;

    logger.warn({
      message: "CreateDepartmentUseCase validation failed",
      errors: fieldErrors,
    });

    throw {
      status: 422,
      message: "Invalid input",
      details: fieldErrors,
    };
  }

  const normalizedDepartmentName = parsed.data.departmentName.trim().toLowerCase();

  const duplicate = await DepartmentValidator.isDuplicateDepartmentName(normalizedDepartmentName);
  if (duplicate) {
    logger.warn({
      message: "CreateDepartmentUseCase duplicate departmentName",
      departmentName: normalizedDepartmentName,
    });

    throw {
      status: 409,
      message: `departmentName '${normalizedDepartmentName}' already exists`,
    };
  }

  try {
    const department = await DepartmentService.create({
      ...parsed.data,
      departmentName: normalizedDepartmentName,
      departmentCreatedAt: getLocalNow(),
    });

    logger.info({
      message: "CreateDepartmentUseCase success",
      departmentId: department.departmentId,
    });

    return department;
  } catch (error) {
    if (error && typeof error === "object" && error.code === "P2002") {
      logger.warn({
        message:
          "CreateDepartmentUseCase unique constraint violation on departmentName (P2002)",
        departmentName: normalizedDepartmentName,
      });

      throw {
        status: 409,
        message: `departmentName '${normalizedDepartmentName}' already exists`,
      };
    }

    logger.error({
      message: "CreateDepartmentUseCase error",
      error,
    });

    throw error;
  }
}

export async function UpdateDepartmentUseCase(data) {
  logger.info({
    message: "UpdateDepartmentUseCase start",
    departmentId: data?.departmentId,
    departmentName: data?.departmentName,
    departmentUpdatedBy: data?.departmentUpdatedBy,
  });

  const parsed = departmentPutSchema.safeParse(data);
  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;

    logger.warn({
      message: "UpdateDepartmentUseCase validation failed",
      errors: fieldErrors,
    });

    throw {
      status: 422,
      message: "Invalid input",
      details: fieldErrors,
    };
  }

  const existing = await DepartmentService.getById(parsed.data.departmentId);
  if (!existing) {
    logger.warn({
      message: "UpdateDepartmentUseCase department not found",
      departmentId: parsed.data.departmentId,
    });

    throw { status: 404, message: "Department not found" };
  }

  const normalizedDepartmentName = parsed.data.departmentName.trim().toLowerCase();
  const existingDepartmentNameNormalized = existing.departmentName
    ? existing.departmentName.trim().toLowerCase()
    : "";

  if (normalizedDepartmentName !== existingDepartmentNameNormalized) {
    const duplicate = await DepartmentValidator.isDuplicateDepartmentName(normalizedDepartmentName);
    if (duplicate) {
      logger.warn({
        message: "UpdateDepartmentUseCase duplicate departmentName",
        departmentName: normalizedDepartmentName,
      });

      throw {
        status: 409,
        message: `departmentName '${normalizedDepartmentName}' already exists`,
      };
    }
  }

  const { departmentId, ...rest } = parsed.data;

  try {
    const updatedDepartment = await DepartmentService.update(departmentId, {
      ...rest,
      departmentName: normalizedDepartmentName,
      departmentUpdatedAt: getLocalNow(),
    });

    logger.info({
      message: "UpdateDepartmentUseCase success",
      departmentId,
    });

    return updatedDepartment;
  } catch (error) {
    if (error && typeof error === "object" && error.code === "P2002") {
      logger.warn({
        message:
          "UpdateDepartmentUseCase unique constraint violation on departmentName (P2002)",
        departmentName: normalizedDepartmentName,
      });

      throw {
        status: 409,
        message: `departmentName '${normalizedDepartmentName}' already exists`,
      };
    }

    logger.error({
      message: "UpdateDepartmentUseCase error",
      error,
    });

    throw error;
  }
}

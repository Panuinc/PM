import { departmentPutSchema } from "@/app/api/setting/department/department.schema";
import { DepartmentService } from "@/app/api/setting/department/department.service";
import { DepartmentValidator } from "@/app/api/setting/department/department.validator";
import { getLocalNow } from "@/lib/getLocalNow";
import logger from "@/lib/logger.node";

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
      departmentUpdateBy: parsed.data.departmentUpdateBy,
      departmentUpdatedAt: getLocalNow(),
    }
  );

  logger.info({
    message: "Department updated successfully",
    departmentId: parsed.data.departmentId,
  });
  return updatedDepartment;
}

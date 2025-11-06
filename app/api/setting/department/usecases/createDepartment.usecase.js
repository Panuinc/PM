import { departmentPostSchema } from "@/app/api/setting/department/department.schema";
import { DepartmentService } from "@/app/api/setting/department/department.service";
import { DepartmentValidator } from "@/app/api/setting/department/department.validator";
import { getLocalNow } from "@/lib/getLocalNow";
import logger from "@/lib/logger.node";

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
    departmentCreateBy: parsed.data.departmentCreateBy,
    departmentCreatedAt: getLocalNow(),
  });

  logger.info({
    message: "Department created successfully",
    departmentId: department.departmentId,
  });
  return department;
}

import { DepartmentService } from "@/app/api/setting/department/department.service";
import logger from "@/lib/logger.node";

export async function GetDepartmentByIdUseCase(departmentId) {
  if (!departmentId || typeof departmentId !== "string")
    throw { status: 400, message: "Invalid department ID" };

  const department = await DepartmentService.getById(departmentId);
  if (!department) throw { status: 404, message: "Department not found" };

  logger.info({ message: "GetDepartmentByIdUseCase success", departmentId });
  return department;
}

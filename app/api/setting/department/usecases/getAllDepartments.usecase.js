import { DepartmentService } from "@/app/api/setting/department/department.service";
import logger from "@/lib/logger.node";

export async function GetAllDepartmentUseCase(page = 1, limit = 1000000) {
  const skip = (page - 1) * limit;
  const departments = await DepartmentService.getAllPaginated(skip, limit);
  const total = await DepartmentService.countAll();
  logger.info({ message: "GetAllDepartmentUseCase success", total });
  return { departments, total };
}

import { getDepartmentById, updateDepartment } from "@/app/api/setting/department/core/department.controller";

export async function GET(request, context) {
  const { departmentId } = await context.params;
  return getDepartmentById(request, departmentId);
}

export async function PUT(request, context) {
  const { departmentId } = await context.params;
  return updateDepartment(request, departmentId);
}

export const dynamic = "force-dynamic";

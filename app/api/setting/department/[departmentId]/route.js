import {
  getDepartmentById,
  updateDepartment,
} from "@/app/api/setting/department/core/department.controller";
import { checkPermission } from "@/lib/apiAuth";
import { PERMISSIONS } from "@/constants/permissions";

export async function GET(request, context) {
  const permissionError = await checkPermission(
    request,
    PERMISSIONS.DEPARTMENT_VIEW
  );
  if (permissionError) return permissionError;

  const { departmentId } = await context.params;
  return getDepartmentById(request, departmentId);
}

export async function PUT(request, context) {
  const permissionError = await checkPermission(
    request,
    PERMISSIONS.DEPARTMENT_UPDATE
  );
  if (permissionError) return permissionError;

  const { departmentId } = await context.params;
  return updateDepartment(request, departmentId);
}

export const dynamic = "force-dynamic";

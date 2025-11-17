import {
  getAllDepartment,
  createDepartment,
} from "@/app/api/setting/department/core/department.controller";
import { checkPermission } from "@/lib/apiAuth";
import { PERMISSIONS } from "@/constants/permissions";

export async function GET(request) {
  const permissionError = await checkPermission(
    request,
    PERMISSIONS.DEPARTMENT_VIEW
  );
  if (permissionError) return permissionError;

  return getAllDepartment(request);
}

export async function POST(request) {
  const permissionError = await checkPermission(
    request,
    PERMISSIONS.DEPARTMENT_CREATE
  );
  if (permissionError) return permissionError;

  return createDepartment(request);
}

export const dynamic = "force-dynamic";

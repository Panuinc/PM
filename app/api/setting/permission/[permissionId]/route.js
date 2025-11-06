import { getPermissionById, updatePermission } from "@/app/api/setting/permission/core/permission.controller";

export async function GET(request, context) {
  const { permissionId } = await context.params;
  return getPermissionById(request, permissionId);
}

export async function PUT(request, context) {
  const { permissionId } = await context.params;
  return updatePermission(request, permissionId);
}

export const dynamic = "force-dynamic";

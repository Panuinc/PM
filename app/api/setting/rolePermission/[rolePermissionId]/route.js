import { getRolePermissionById, updateRolePermission } from "@/app/api/setting/rolePermission/core/rolePermission.controller";

export async function GET(request, context) {
  const { rolePermissionId } = await context.params;
  return getRolePermissionById(request, rolePermissionId);
}

export async function PUT(request, context) {
  const { rolePermissionId } = await context.params;
  return updateRolePermission(request, rolePermissionId);
}

export const dynamic = "force-dynamic";

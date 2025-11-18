import { getPermissionGroupById, updatePermissionGroup } from "@/app/api/setting/permissionGroup/core/permissionGroup.controller";

export async function GET(request, context) {
  const { permissionGroupId } = await context.params;
  return getPermissionGroupById(request, permissionGroupId);
}

export async function PUT(request, context) {
  const { permissionGroupId } = await context.params;
  return updatePermissionGroup(request, permissionGroupId);
}

export const dynamic = "force-dynamic";

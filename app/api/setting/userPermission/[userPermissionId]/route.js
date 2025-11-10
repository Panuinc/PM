import { getUserPermissionById, updateUserPermission } from "@/app/api/setting/userPermission/core/userPermission.controller";

export async function GET(request, context) {
  const { userPermissionId } = await context.params;
  return getUserPermissionById(request, userPermissionId);
}

export async function PUT(request, context) {
  const { userPermissionId } = await context.params;
  return updateUserPermission(request, userPermissionId);
}

export const dynamic = "force-dynamic";

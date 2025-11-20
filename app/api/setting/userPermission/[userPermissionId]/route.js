import {
  getUserPermissionById,
  updateUserPermission,
} from "@/app/api/setting/userPermission/core/userPermission.controller";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request, context) {
  const { userPermissionId } = await context.params;
  return getUserPermissionById(request, String(userPermissionId));
}

export async function PUT(request, context) {
  const { userPermissionId } = await context.params;
  return updateUserPermission(request, String(userPermissionId));
}

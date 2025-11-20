import {
  getPermissionsForUser,
  updatePermissionsForUser,
} from "@/app/api/setting/userPermission/core/userPermission.controller";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request, context) {
  const { userId } = await context.params;
  return getPermissionsForUser(request, String(userId));
}

export async function PUT(request, context) {
  const { userId } = await context.params;
  return updatePermissionsForUser(request, String(userId));
}

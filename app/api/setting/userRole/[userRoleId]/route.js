import { getUserRoleById, updateUserRole } from "@/app/api/setting/userRole/core/userRole.controller";

export async function GET(request, context) {
  const { userRoleId } = await context.params;
  return getUserRoleById(request, userRoleId);
}

export async function PUT(request, context) {
  const { userRoleId } = await context.params;
  return updateUserRole(request, userRoleId);
}

export const dynamic = "force-dynamic";

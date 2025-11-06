import { getRoleById, updateRole } from "@/app/api/setting/role/core/role.controller";

export async function GET(request, context) {
  const { roleId } = await context.params;
  return getRoleById(request, roleId);
}

export async function PUT(request, context) {
  const { roleId } = await context.params;
  return updateRole(request, roleId);
}

export const dynamic = "force-dynamic";

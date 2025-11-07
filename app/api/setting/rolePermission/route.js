import { getAllRolePermission, createRolePermission } from "@/app/api/setting/rolePermission/core/rolePermission.controller";

export async function GET(request) {
  return getAllRolePermission(request);
}

export async function POST(request) {
  return createRolePermission(request);
}

export const dynamic = "force-dynamic";

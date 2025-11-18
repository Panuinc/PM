import { getAllPermissionGroup, createPermissionGroup } from "@/app/api/setting/permissionGroup/core/permissionGroup.controller";

export async function GET(request) {
  return getAllPermissionGroup(request);
}

export async function POST(request) {
  return createPermissionGroup(request);
}

export const dynamic = "force-dynamic";

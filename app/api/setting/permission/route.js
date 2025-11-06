import { getAllPermission, createPermission } from "@/app/api/setting/permission/core/permission.controller";

export async function GET(request) {
  return getAllPermission(request);
}

export async function POST(request) {
  return createPermission(request);
}

export const dynamic = "force-dynamic";

import { getAllRole, createRole } from "@/app/api/setting/role/core/role.controller";

export async function GET(request) {
  return getAllRole(request);
}

export async function POST(request) {
  return createRole(request);
}

export const dynamic = "force-dynamic";

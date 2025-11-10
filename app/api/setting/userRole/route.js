import { getAllUserRole, createUserRole } from "@/app/api/setting/userRole/core/userRole.controller";

export async function GET(request) {
  return getAllUserRole(request);
}

export async function POST(request) {
  return createUserRole(request);
}

export const dynamic = "force-dynamic";

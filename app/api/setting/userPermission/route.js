import {
  getAllUserPermission,
  createUserPermission,
} from "@/app/api/setting/userPermission/core/userPermission.controller";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request) {
  return getAllUserPermission(request);
}

export async function POST(request) {
  return createUserPermission(request);
}

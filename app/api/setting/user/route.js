import {
  getAllUser,
  createUser,
} from "@/app/api/setting/user/core/user.controller";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request) {
  return getAllUser(request);
}

export async function POST(request) {
  return createUser(request);
}

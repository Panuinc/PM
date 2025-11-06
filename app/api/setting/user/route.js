import { getAllUser, createUser } from "@/app/api/setting/user/core/user.controller";

export async function GET(request) {
  return getAllUser(request);
}

export async function POST(request) {
  return createUser(request);
}

export const dynamic = "force-dynamic";

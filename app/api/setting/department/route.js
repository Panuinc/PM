import {
  getAllDepartment,
  createDepartment,
} from "@/app/api/setting/department/core/department.controller";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request) {
  return getAllDepartment(request);
}

export async function POST(request) {
  return createDepartment(request);
}

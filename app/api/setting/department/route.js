import { getAllDepartment, createDepartment } from "@/app/api/setting/department/department.controller";

export async function GET(request) {
  return getAllDepartment(request);
}

export async function POST(request) {
  return createDepartment(request);
}

export const dynamic = "force-dynamic";

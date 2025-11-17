import {
  getAllUserPermissionMatrix,
  updateUserPermissionMatrix,
} from "@/app/api/setting/userPermissionMatrix/core/userPermissionMatrix.controller";

export async function GET(request) {
  return getAllUserPermissionMatrix(request);
}

export async function PUT(request) {
  return updateUserPermissionMatrix(request);
}

export const dynamic = "force-dynamic";

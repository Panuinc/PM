import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { NextResponse } from "next/server";
import { getUserPermissions } from "@/lib/permissions";
import { PERMISSIONS } from "@/constants/permissions";

export async function checkPermission(request, requiredPermission) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  const permissions = getUserPermissions(session);

  if (permissions.includes(PERMISSIONS.SUPER_ADMIN)) {
    return null;
  }

  if (!permissions.includes(requiredPermission)) {
    return NextResponse.json(
      { success: false, message: "Forbidden - Insufficient permissions" },
      { status: 403 }
    );
  }

  return null;
}

export function withPermission(handler, requiredPermission) {
  return async (request, context) => {
    const permissionError = await checkPermission(request, requiredPermission);
    if (permissionError) return permissionError;

    return handler(request, context);
  };
}

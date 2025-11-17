import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { checkPermission } from "@/lib/apiAuth";
import { PERMISSIONS } from "@/constants/permissions";

function validateApiKey(request) {
  return (
    request.headers.get("x-api-key") === process.env.NEXT_PUBLIC_SECRET_TOKEN
  );
}

export async function GET(request, context) {
  try {
    if (!validateApiKey(request))
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const permissionError = await checkPermission(
      request,
      PERMISSIONS.ROLE_PERMISSION_VIEW
    );
    if (permissionError) return permissionError;

    const { roleId } = await context.params;

    const role = await prisma.role.findUnique({
      where: { roleId },
      include: {
        rolePermissions: {
          include: { permission: true },
        },
      },
    });

    const groups = await prisma.permissionGroup.findMany({
      orderBy: { permissionGroupOrder: "asc" },
      include: {
        permissions: {
          where: { permissionStatus: "Enable" },
          orderBy: { permissionKey: "asc" },
        },
      },
    });

    return NextResponse.json({ role, groups });
  } catch (err) {
    console.error("ROLE MATRIX ERROR:", err);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

export async function PUT(request, context) {
  try {
    if (!validateApiKey(request))
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const permissionError = await checkPermission(
      request,
      PERMISSIONS.ROLE_PERMISSION_UPDATE
    );
    if (permissionError) return permissionError;

    const { roleId } = await context.params;
    const { permissions, operatedBy } = await request.json();

    await prisma.rolePermission.deleteMany({
      where: { rolePermissionRoleId: roleId },
    });

    for (const pid of permissions) {
      await prisma.rolePermission.create({
        data: {
          rolePermissionRoleId: roleId,
          rolePermissionPermissionId: pid,
          rolePermissionStatus: "Enable",
          rolePermissionCreatedBy: operatedBy,
          rolePermissionCreatedAt: new Date(),
        },
      });
    }

    return NextResponse.json({ message: "Updated!" });
  } catch (err) {
    console.error("PUT ROLE MATRIX ERROR:", err);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";

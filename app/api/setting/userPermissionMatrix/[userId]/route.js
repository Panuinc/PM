import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { checkPermission } from "@/lib/apiAuth";
import { PERMISSIONS } from "@/constants/permissions";

function validateApiKey(request) {
  return (
    request.headers.get("x-api-key") === process.env.NEXT_PUBLIC_SECRET_TOKEN
  );
}

// ------------------------------------------------------
// GET USER PERMISSION MATRIX (grouped)
// ------------------------------------------------------
export async function GET(request, context) {
  try {
    if (!validateApiKey(request))
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const permissionError = await checkPermission(
      request,
      PERMISSIONS.USER_PERMISSION_VIEW
    );
    if (permissionError) return permissionError;

    const { userId } = await context.params;

    const user = await prisma.user.findUnique({
      where: { userId },
      include: {
        userRoles: {
          include: {
            role: {
              include: {
                rolePermissions: { include: { permission: true } },
              },
            },
          },
        },
        userPermissions: {
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

    const inherited = user.userRoles.flatMap((ur) =>
      ur.role.rolePermissions.map((rp) => rp.permission.permissionId)
    );

    const direct = user.userPermissions.map((up) => up.permission.permissionId);

    return NextResponse.json({ user, groups, inherited, direct });
  } catch (err) {
    console.error("GET MATRIX ERROR:", err);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

// ------------------------------------------------------
// UPDATE DIRECT PERMISSIONS
// ------------------------------------------------------
export async function PUT(request, context) {
  try {
    if (!validateApiKey(request))
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const permissionError = await checkPermission(
      request,
      PERMISSIONS.USER_PERMISSION_UPDATE
    );
    if (permissionError) return permissionError;

    const { userId } = await context.params;
    const { directPermissions, operatedBy } = await request.json();

    await prisma.userPermission.deleteMany({
      where: { userPermissionUserId: userId },
    });

    for (const pid of directPermissions) {
      await prisma.userPermission.create({
        data: {
          userPermissionUserId: userId,
          userPermissionPermissionId: pid,
          userPermissionStatus: "Enable",
          userPermissionCreatedBy: operatedBy,
          userPermissionCreatedAt: new Date(),
        },
      });
    }

    return NextResponse.json({ message: "Updated!" });
  } catch (err) {
    console.error("PUT MATRIX ERROR:", err);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";

import prisma from "@/lib/prisma";

export const UserPermissionRepository = {
  getByUserId: async (userId) => {
    return prisma.userPermission.findMany({
      where: { userPermissionUserId: userId },
    });
  },

  deleteManyByUserAndPermissionIdsNotIn: async (userId, permissionIds) => {
    if (!permissionIds || permissionIds.length === 0) {
      return prisma.userPermission.deleteMany({
        where: { userPermissionUserId: userId },
      });
    }

    return prisma.userPermission.deleteMany({
      where: {
        userPermissionUserId: userId,
        userPermissionPermissionId: { notIn: permissionIds },
      },
    });
  },

  getPermissionsWithAssignmentForUser: async (userId) => {
    const [permissions, userPermissions] = await Promise.all([
      prisma.permission.findMany({
        where: { permissionStatus: "Enable" },
        orderBy: { permissionName: "asc" },
      }),
      prisma.userPermission.findMany({
        where: {
          userPermissionUserId: userId,
          userPermissionStatus: "Enable",
        },
      }),
    ]);

    const assignedSet = new Set(
      userPermissions.map((up) => up.userPermissionPermissionId)
    );

    return permissions.map((p) => ({
      permissionId: p.permissionId,
      permissionName: p.permissionName,
      assigned: assignedSet.has(p.permissionId),
    }));
  },

  create: async (data) => {
    return prisma.userPermission.create({ data });
  },
};

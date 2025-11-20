import prisma from "@/lib/prisma";

export const UserPermissionRepository = {
  getAll: async (skip = 0, take = 10) => {
    return prisma.userPermission.findMany({
      skip,
      take,
      orderBy: { userPermissionCreatedAt: "asc" },
      include: {
        user: {
          select: { userId: true, userFirstName: true, userLastName: true },
        },
        permission: { select: { permissionId: true, permissionName: true } },
        createdByUser: {
          select: { userId: true, userFirstName: true, userLastName: true },
        },
        updatedByUser: {
          select: { userId: true, userFirstName: true, userLastName: true },
        },
      },
    });
  },

  countAll: async () => prisma.userPermission.count(),

  findById: async (userPermissionId) => {
    return prisma.userPermission.findUnique({
      where: { userPermissionId },
      include: {
        user: {
          select: { userId: true, userFirstName: true, userLastName: true },
        },
        permission: { select: { permissionId: true, permissionName: true } },
        createdByUser: {
          select: { userId: true, userFirstName: true, userLastName: true },
        },
        updatedByUser: {
          select: { userId: true, userFirstName: true, userLastName: true },
        },
      },
    });
  },

  findByUniquePair: async (
    userPermissionUserId,
    userPermissionPermissionId
  ) => {
    return prisma.userPermission.findUnique({
      where: {
        userPermissionUserId_userPermissionPermissionId: {
          userPermissionUserId,
          userPermissionPermissionId,
        },
      },
    });
  },

  create: async (data) => {
    return prisma.userPermission.create({
      data,
      include: {
        user: {
          select: { userId: true, userFirstName: true, userLastName: true },
        },
        permission: { select: { permissionId: true, permissionName: true } },
        createdByUser: {
          select: { userId: true, userFirstName: true, userLastName: true },
        },
      },
    });
  },

  update: async (userPermissionId, data) => {
    return prisma.userPermission.update({
      where: { userPermissionId },
      data,
      include: {
        user: {
          select: { userId: true, userFirstName: true, userLastName: true },
        },
        permission: { select: { permissionId: true, permissionName: true } },
        updatedByUser: {
          select: { userId: true, userFirstName: true, userLastName: true },
        },
      },
    });
  },
};

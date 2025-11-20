import prisma from "@/lib/prisma";

export const UserPermissionRepository = {
  getAll: async (skip = 0, take = 10) => {
    return prisma.userPermission.findMany({
      skip,
      take,
      orderBy: { userPermissionCreatedAt: "asc" },
      include: {
        createdByUser: {
          select: {userId: true, userFirstName: true, userLastName: true },
        },
        updatedByUser: {
          select: {userId: true, userFirstName: true, userLastName: true },
        },
      },
    });
  },

  countAll: async () => {
    return prisma.userPermission.count();
  },

  findById: async (userPermissionId) => {
    return prisma.userPermission.findUnique({
      where: { userPermissionId },
      include: {
        createdByUser: {
          select: {userId: true, userFirstName: true, userLastName: true },
        },
        updatedByUser: {
          select: {userId: true, userFirstName: true, userLastName: true },
        },
      },
    });
  },

  findByUserPermissionUserId: async (userPermissionUserId) => {
    return prisma.userPermission.findUnique({
      where: { userPermissionUserId },
    });
  },

  create: async (data) => {
    return prisma.userPermission.create({
      data,
      include: {
        createdByUser: {
          select: {userId: true, userFirstName: true, userLastName: true },
        },
      },
    });
  },

  update: async (userPermissionId, data) => {
    return prisma.userPermission.update({
      where: { userPermissionId },
      data,
      include: {
        updatedByUser: {
          select: {userId: true, userFirstName: true, userLastName: true },
        },
      },
    });
  },
};

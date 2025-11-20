import prisma from "@/lib/prisma";

export const PermissionRepository = {
  getAll: async (skip = 0, take = 10) => {
    return prisma.permission.findMany({
      skip,
      take,
      orderBy: { permissionCreatedAt: "asc" },
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
    return prisma.permission.count();
  },

  findById: async (permissionId) => {
    return prisma.permission.findUnique({
      where: { permissionId },
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

  findByPermissionName: async (permissionName) => {
    return prisma.permission.findUnique({
      where: { permissionName },
    });
  },

  create: async (data) => {
    return prisma.permission.create({
      data,
      include: {
        createdByUser: {
          select: {userId: true, userFirstName: true, userLastName: true },
        },
      },
    });
  },

  update: async (permissionId, data) => {
    return prisma.permission.update({
      where: { permissionId },
      data,
      include: {
        updatedByUser: {
          select: {userId: true, userFirstName: true, userLastName: true },
        },
      },
    });
  },
};

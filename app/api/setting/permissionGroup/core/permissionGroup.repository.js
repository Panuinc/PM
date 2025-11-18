import prisma from "@/lib/prisma";
import logger from "@/lib/logger.node";

export const PermissionGroupRepository = {
  getAll: async (skip = 0, take = 10) => {
    logger.info({ message: "PermissionGroupRepository.getAll", skip, take });

    return await prisma.permissionGroup.findMany({
      skip,
      take,
      orderBy: { permissionGroupOrder: "asc" },
      include: {
        createdByUser: {
          select: { userId: true, userFirstName: true, userLastName: true },
        },
        updatedByUser: {
          select: { userId: true, userFirstName: true, userLastName: true },
        },
      },
    });
  },

  countAll: async () => prisma.permissionGroup.count(),

  findById: async (permissionGroupId) => {
    logger.info({
      message: "PermissionGroupRepository.findById",
      permissionGroupId,
    });

    return await prisma.permissionGroup.findUnique({
      where: { permissionGroupId },
      include: {
        createdByUser: {
          select: { userId: true, userFirstName: true, userLastName: true },
        },
        updatedByUser: {
          select: { userId: true, userFirstName: true, userLastName: true },
        },
      },
    });
  },

  findByPermissionGroupName: async (permissionGroupName) => {
    logger.info({
      message: "PermissionGroupRepository.findByPermissionGroupName",
      permissionGroupName,
    });

    return await prisma.permissionGroup.findFirst({
      where: {
        permissionGroupName: {
          equals: permissionGroupName.trim(),
          mode: "insensitive",
        },
      },
    });
  },

  create: async (data) => {
    logger.info({ message: "PermissionGroupRepository.create", data });

    return await prisma.permissionGroup.create({
      data,
      include: {
        createdByUser: {
          select: { userId: true, userFirstName: true, userLastName: true },
        },
      },
    });
  },

  update: async (permissionGroupId, data) => {
    logger.info({
      message: "PermissionGroupRepository.update",
      permissionGroupId,
    });

    return await prisma.permissionGroup.update({
      where: { permissionGroupId },
      data,
      include: {
        updatedByUser: {
          select: { userId: true, userFirstName: true, userLastName: true },
        },
      },
    });
  },
};

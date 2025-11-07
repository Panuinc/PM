import prisma from "@/lib/prisma";
import logger from "@/lib/logger.node";

export const PermissionRepository = {
  getAll: async (skip = 0, take = 10) => {
    logger.info({ message: "PermissionRepository.getAll", skip, take });
    return await prisma.permission.findMany({
      skip,
      take,
      orderBy: { permissionCreatedAt: "asc" },
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

  countAll: async () => prisma.permission.count(),

  findById: async (permissionId) => {
    logger.info({ message: "PermissionRepository.findById", permissionId });
    return await prisma.permission.findUnique({
      where: { permissionId },
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

  findByPermissionKey: async (permissionKey) => {
    logger.info({
      message: "PermissionRepository.findByPermissionKey",
      permissionKey,
    });
    return await prisma.permission.findFirst({
      where: {
        permissionKey: { equals: permissionKey.trim(), mode: "insensitive" },
      },
    });
  },

  create: async (data) => {
    logger.info({ message: "PermissionRepository.create", data });
    return await prisma.permission.create({
      data,
      include: {
        createdByUser: {
          select: { userId: true, userFirstName: true, userLastName: true },
        },
      },
    });
  },

  update: async (permissionId, data) => {
    logger.info({ message: "PermissionRepository.update", permissionId });
    return await prisma.permission.update({
      where: { permissionId },
      data,
      include: {
        updatedByUser: {
          select: { userId: true, userFirstName: true, userLastName: true },
        },
      },
    });
  },
};

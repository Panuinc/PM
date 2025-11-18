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
        permissions: true,
      },
    });
  },

  countAll: async () => prisma.permissionGroup.count(),

  findById: async (permissionGroupId) => {
    logger.info({ message: "PermissionGroupRepository.findById", permissionGroupId });
    return prisma.permissionGroup.findUnique({
      where: { permissionGroupId },
      include: { permissions: true },
    });
  },

  findByPermissionGroupName: async (permissionGroupName) => {
    logger.info({
      message: "PermissionGroupRepository.findByPermissionGroupName",
      permissionGroupName,
    });

    return prisma.permissionGroup.findFirst({
      where: {
        permissionGroupName: { equals: permissionGroupName.trim(), mode: "insensitive" },
      },
    });
  },

  create: async (data) => {
    logger.info({ message: "PermissionGroupRepository.create", data });
    return await prisma.permissionGroup.create({
      data,
      include: { permissions: true },
    });
  },

  update: async (permissionGroupId, data) => {
    logger.info({ message: "PermissionGroupRepository.update", permissionGroupId });
    return await prisma.permissionGroup.update({
      where: { permissionGroupId },
      data,
      include: { permissions: true },
    });
  },
};

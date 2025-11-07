import prisma from "@/lib/prisma";
import logger from "@/lib/logger.node";

export const RolePermissionRepository = {
  getAll: async (skip = 0, take = 10) => {
    logger.info({ message: "RolePermissionRepository.getAll", skip, take });
    return await prisma.rolePermission.findMany({
      skip,
      take,
      orderBy: { rolePermissionCreatedAt: "asc" },
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

  countAll: async () => prisma.rolePermission.count(),

  findById: async (rolePermissionId) => {
    logger.info({ message: "RolePermissionRepository.findById", rolePermissionId });
    return await prisma.rolePermission.findUnique({
      where: { rolePermissionId },
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

  findByRolePermissionName: async (rolePermissionName) => {
    logger.info({ message: "RolePermissionRepository.findByRolePermissionName", rolePermissionName });
    return await prisma.rolePermission.findFirst({
      where: {
        rolePermissionName: { equals: rolePermissionName.trim(), mode: "insensitive" },
      },
    });
  },

  create: async (data) => {
    logger.info({ message: "RolePermissionRepository.create", data });
    return await prisma.rolePermission.create({
      data,
      include: {
        createdByUser: {
          select: { userId: true, userFirstName: true, userLastName: true },
        },
      },
    });
  },

  update: async (rolePermissionId, data) => {
    logger.info({ message: "RolePermissionRepository.update", rolePermissionId });
    return await prisma.rolePermission.update({
      where: { rolePermissionId },
      data,
      include: {
        updatedByUser: {
          select: { userId: true, userFirstName: true, userLastName: true },
        },
      },
    });
  },
};

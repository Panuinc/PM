import prisma from "@/lib/prisma";
import logger from "@/lib/logger.node";

export const UserPermissionRepository = {
  getAll: async (skip = 0, take = 10) => {
    logger.info({ message: "UserPermissionRepository.getAll", skip, take });
    return await prisma.userPermission.findMany({
      skip,
      take,
      orderBy: { userPermissionCreatedAt: "asc" },
      include: {
        permission: { select: { permissionId: true, permissionName: true } },
        user: {
          select: { userId: true, userFirstName: true, userLastName: true },
        },
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
    logger.info({ message: "UserPermissionRepository.findById", userPermissionId });
    return await prisma.userPermission.findUnique({
      where: { userPermissionId },
      include: {
        permission: { select: { permissionId: true, permissionName: true } },
        user: {
          select: { userId: true, userFirstName: true, userLastName: true },
        },
        createdByUser: {
          select: { userId: true, userFirstName: true, userLastName: true },
        },
        updatedByUser: {
          select: { userId: true, userFirstName: true, userLastName: true },
        },
      },
    });
  },

  findDuplicate: async (userPermissionPermissionId, userPermissionUserId) => {
    logger.info({
      message: "UserPermissionRepository.findDuplicate",
      userPermissionPermissionId,
      userPermissionUserId,
    });
    return await prisma.userPermission.findFirst({
      where: { userPermissionPermissionId, userPermissionUserId },
    });
  },

  create: async (data) => {
    logger.info({ message: "UserPermissionRepository.create", data });
    return await prisma.userPermission.create({
      data,
      include: {
        permission: { select: { permissionId: true, permissionName: true } },
        user: {
          select: { userId: true, userFirstName: true, userLastName: true },
        },
        createdByUser: {
          select: { userId: true, userFirstName: true, userLastName: true },
        },
      },
    });
  },

  update: async (userPermissionId, data) => {
    logger.info({ message: "UserPermissionRepository.update", userPermissionId });
    return await prisma.userPermission.update({
      where: { userPermissionId },
      data,
      include: {
        permission: { select: { permissionId: true, permissionName: true } },
        user: {
          select: { userId: true, userFirstName: true, userLastName: true },
        },
        updatedByUser: {
          select: { userId: true, userFirstName: true, userLastName: true },
        },
      },
    });
  },
};

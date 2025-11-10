import prisma from "@/lib/prisma";
import logger from "@/lib/logger.node";

export const UserRoleRepository = {
  getAll: async (skip = 0, take = 10) => {
    logger.info({ message: "UserRoleRepository.getAll", skip, take });
    return await prisma.userRole.findMany({
      skip,
      take,
      orderBy: { userRoleCreatedAt: "asc" },
      include: {
        role: { select: { roleId: true, roleName: true } },
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

  countAll: async () => prisma.userRole.count(),

  findById: async (userRoleId) => {
    logger.info({
      message: "UserRoleRepository.findById",
      userRoleId,
    });
    return await prisma.userRole.findUnique({
      where: { userRoleId },
      include: {
        role: { select: { roleId: true, roleName: true } },
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

  findDuplicate: async (userRoleRoleId, userUserRoleId) => {
    logger.info({
      message: "UserRoleRepository.findDuplicate",
      userRoleRoleId,
      userUserRoleId,
    });
    return await prisma.userRole.findFirst({
      where: { userRoleRoleId, userUserRoleId },
    });
  },

  create: async (data) => {
    logger.info({ message: "UserRoleRepository.create", data });
    return await prisma.userRole.create({
      data,
      include: {
        role: { select: { roleId: true, roleName: true } },
        permission: { select: { permissionId: true, permissionName: true } },
        createdByUser: {
          select: { userId: true, userFirstName: true, userLastName: true },
        },
      },
    });
  },

  update: async (userRoleId, data) => {
    logger.info({
      message: "UserRoleRepository.update",
      userRoleId,
    });
    return await prisma.userRole.update({
      where: { userRoleId },
      data,
      include: {
        role: { select: { roleId: true, roleName: true } },
        permission: { select: { permissionId: true, permissionName: true } },
        updatedByUser: {
          select: { userId: true, userFirstName: true, userLastName: true },
        },
      },
    });
  },
};

import prisma from "@/lib/prisma";
import logger from "@/lib/logger.node";

export const RoleRepository = {
  getAll: async (skip = 0, take = 10) => {
    logger.info({ message: "RoleRepository.getAll", skip, take });
    return await prisma.role.findMany({
      skip,
      take,
      orderBy: { roleCreatedAt: "asc" },
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

  countAll: async () => prisma.role.count(),

  findById: async (roleId) => {
    logger.info({ message: "RoleRepository.findById", roleId });
    return await prisma.role.findUnique({
      where: { roleId },
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

  findByRoleName: async (roleName) => {
    logger.info({ message: "RoleRepository.findByRoleName", roleName });
    return await prisma.role.findFirst({
      where: {
        roleName: { equals: roleName.trim(), mode: "insensitive" },
      },
    });
  },

  create: async (data) => {
    logger.info({ message: "RoleRepository.create", data });
    return await prisma.role.create({
      data,
      include: {
        createdByUser: {
          select: { userId: true, userFirstName: true, userLastName: true },
        },
      },
    });
  },

  update: async (roleId, data) => {
    logger.info({ message: "RoleRepository.update", roleId });
    return await prisma.role.update({
      where: { roleId },
      data,
      include: {
        updatedByUser: {
          select: { userId: true, userFirstName: true, userLastName: true },
        },
      },
    });
  },
};

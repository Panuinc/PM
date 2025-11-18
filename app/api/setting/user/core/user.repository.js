import prisma from "@/lib/prisma";
import logger from "@/lib/logger.node";

export const UserRepository = {
  getAll: async (skip = 0, take = 10) => {
    logger.info({ message: "UserRepository.getAll", skip, take });
    return await prisma.user.findMany({
      skip,
      take,
      orderBy: { userCreatedAt: "asc" },
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

  countAll: async () => prisma.user.count(),

  findById: async (userId) => {
    logger.info({ message: "UserRepository.findById", userId });
    return await prisma.user.findUnique({
      where: { userId },
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

  findByEmail: async (userEmail) => {
    logger.info({ message: "UserRepository.findByEmail", userEmail });
    return await prisma.user.findUnique({
      where: { userEmail },
    });
  },

  create: async (data) => {
    logger.info({ message: "UserRepository.create", data });
    return await prisma.user.create({
      data,
      include: {
        createdByUser: {
          select: { userId: true, userFirstName: true, userLastName: true },
        },
      },
    });
  },

  update: async (userId, data) => {
    logger.info({ message: "UserRepository.update", userId });
    return await prisma.user.update({
      where: { userId },
      data,
      include: {
        updatedByUser: {
          select: { userId: true, userFirstName: true, userLastName: true },
        },
      },
    });
  },
};

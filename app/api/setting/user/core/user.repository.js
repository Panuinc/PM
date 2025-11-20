import prisma from "@/lib/prisma";

export const UserRepository = {
  getAll: async (skip = 0, take = 10) => {
    return prisma.user.findMany({
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

  countAll: async () => {
    return prisma.user.count();
  },

  findById: async (userId) => {
    return prisma.user.findUnique({
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

  findByUserEmail: async (userEmail) => {
    return prisma.user.findUnique({
      where: { userEmail },
    });
  },

  create: async (data) => {
    return prisma.user.create({
      data,
      include: {
        createdByUser: {
          select: { userId: true, userFirstName: true, userLastName: true },
        },
      },
    });
  },

  update: async (userId, data) => {
    return prisma.user.update({
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

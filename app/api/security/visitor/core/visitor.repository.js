import prisma from "@/lib/prisma";

export const VisitorRepository = {
  getAll: async (skip = 0, take = 10) => {
    return prisma.visitor.findMany({
      skip,
      take,
      orderBy: { visitorCreatedAt: "asc" },
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
    return prisma.visitor.count();
  },

  findById: async (visitorId) => {
    return prisma.visitor.findUnique({
      where: { visitorId },
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

  findByVisitorName: async (visitorName) => {
    return prisma.visitor.findUnique({
      where: { visitorName },
    });
  },

  create: async (data) => {
    return prisma.visitor.create({
      data,
      include: {
        createdByUser: {
          select: {userId: true, userFirstName: true, userLastName: true },
        },
      },
    });
  },

  update: async (visitorId, data) => {
    return prisma.visitor.update({
      where: { visitorId },
      data,
      include: {
        updatedByUser: {
          select: {userId: true, userFirstName: true, userLastName: true },
        },
      },
    });
  },
};

import prisma from "@/lib/prisma";

export const DeliveryRepository = {
  getAll: async (skip = 0, take = 10) => {
    return prisma.delivery.findMany({
      skip,
      take,
      orderBy: { deliveryCreatedAt: "asc" },
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
    return prisma.delivery.count();
  },

  findById: async (deliveryId) => {
    return prisma.delivery.findUnique({
      where: { deliveryId },
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

  findByDeliveryName: async (deliveryName) => {
    return prisma.delivery.findUnique({
      where: { deliveryName },
    });
  },

  create: async (data) => {
    return prisma.delivery.create({
      data,
      include: {
        createdByUser: {
          select: {userId: true, userFirstName: true, userLastName: true },
        },
      },
    });
  },

  update: async (deliveryId, data) => {
    return prisma.delivery.update({
      where: { deliveryId },
      data,
      include: {
        updatedByUser: {
          select: {userId: true, userFirstName: true, userLastName: true },
        },
      },
    });
  },
};

import prisma from "@/lib/prisma";

export const DeliveryRepository = {
  getAll: async (skip = 0, take = 10) => {
    return prisma.delivery.findMany({
      skip,
      take,
      orderBy: { deliveryCreatedAt: "asc" },
      include: {
        deliveryReturn: true,
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
    return prisma.delivery.count();
  },

  findById: async (deliveryId) => {
    return prisma.delivery.findUnique({
      where: { deliveryId },
      include: {
        deliveryReturn: true,
        createdByUser: {
          select: { userId: true, userFirstName: true, userLastName: true },
        },
        updatedByUser: {
          select: { userId: true, userFirstName: true, userLastName: true },
        },
      },
    });
  },

  findByDeliveryInvoiceNumber: async (deliveryInvoiceNumber) => {
    return prisma.delivery.findUnique({
      where: { deliveryInvoiceNumber },
    });
  },

  create: async (data) => {
    return prisma.delivery.create({
      data: {
        ...data,
        deliveryReturn: {
          create:
            data.deliveryReturns?.map((r) => ({
              deliveryReturnCode: r.deliveryReturnCode,
              deliveryReturnQuantity: r.deliveryReturnQuantity,
              deliveryReturnRemark: r.deliveryReturnRemark || null,
            })) || [],
        },
      },
      include: {
        deliveryReturn: true,
        createdByUser: {
          select: { userId: true, userFirstName: true, userLastName: true },
        },
      },
    });
  },

  update: async (deliveryId, data) => {
    return prisma.delivery.update({
      where: { deliveryId },
      data: {
        ...data,
        deliveryReturn: {
          deleteMany: {},

          create:
            data.deliveryReturns?.map((r) => ({
              deliveryReturnCode: r.deliveryReturnCode,
              deliveryReturnQuantity: r.deliveryReturnQuantity,
              deliveryReturnRemark: r.deliveryReturnRemark || null,
            })) || [],
        },
      },
      include: {
        deliveryReturn: true,
        updatedByUser: {
          select: { userId: true, userFirstName: true, userLastName: true },
        },
      },
    });
  },
};

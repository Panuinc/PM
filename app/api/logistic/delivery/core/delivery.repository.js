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
    const { deliveryReturns, ...deliveryData } = data;

    return prisma.delivery.create({
      data: {
        ...deliveryData,
        deliveryReturn: {
          create:
            deliveryReturns?.map((r) => ({
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
    const { deliveryReturns = [], ...rest } = data;

    const existingReturns = await prisma.deliveryReturn.findMany({
      where: { deliveryReturnDeliveryId: deliveryId },
    });

    const existingMap = new Map(
      existingReturns.map((r) => [r.deliveryReturnId, r])
    );

    const incomingIds = [];

    for (const r of deliveryReturns) {
      if (r.deliveryReturnId && existingMap.has(r.deliveryReturnId)) {
        incomingIds.push(r.deliveryReturnId);

        await prisma.deliveryReturn.update({
          where: { deliveryReturnId: r.deliveryReturnId },
          data: {
            deliveryReturnCode: r.deliveryReturnCode,
            deliveryReturnQuantity: r.deliveryReturnQuantity,
            deliveryReturnRemark: r.deliveryReturnRemark || null,
          },
        });
      } else {
        const created = await prisma.deliveryReturn.create({
          data: {
            deliveryReturnDeliveryId: deliveryId,
            deliveryReturnCode: r.deliveryReturnCode,
            deliveryReturnQuantity: r.deliveryReturnQuantity,
            deliveryReturnRemark: r.deliveryReturnRemark || null,
          },
        });

        incomingIds.push(created.deliveryReturnId);
      }
    }

    const deleteIds = existingReturns
      .filter((r) => !incomingIds.includes(r.deliveryReturnId))
      .map((r) => r.deliveryReturnId);

    if (deleteIds.length > 0) {
      await prisma.deliveryReturn.deleteMany({
        where: { deliveryReturnId: { in: deleteIds } },
      });
    }

    return prisma.delivery.update({
      where: { deliveryId },
      data: {
        ...rest,
      },
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
};

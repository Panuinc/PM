import prisma from "@/lib/prisma";
import { deleteFile } from "@/lib/fileStore";

export const DeliveryRepository = {
  getAll: async (skip = 0, take = 10) => {
    return prisma.delivery.findMany({
      skip,
      take,
      orderBy: { deliveryCreatedAt: "asc" },
      include: {
        createdByUser: {
          select: { userId: true, userFirstName: true, userLastName: true },
        },
        updatedByUser: {
          select: { userId: true, userFirstName: true, userLastName: true },
        },
        deliveryPhotos: {
          orderBy: { deliveryPhotoCreatedAt: "asc" },
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
          select: { userId: true, userFirstName: true, userLastName: true },
        },
        updatedByUser: {
          select: { userId: true, userFirstName: true, userLastName: true },
        },
        deliveryPhotos: {
          orderBy: { deliveryPhotoCreatedAt: "asc" },
        },
      },
    });
  },

  findByDeliveryInvoiceNumber: async (deliveryInvoiceNumber) => {
    return prisma.delivery.findFirst({
      where: { deliveryInvoiceNumber },
    });
  },

  findByInvoiceAndCompany: async (
    deliveryInvoiceNumber,
    deliveryCompanyName
  ) => {
    return prisma.delivery.findUnique({
      where: {
        deliveryInvoiceNumber_deliveryCompanyName: {
          deliveryInvoiceNumber,
          deliveryCompanyName,
        },
      },
    });
  },

  create: async (data) => {
    return prisma.delivery.create({
      data: {
        ...data,
      },
      include: {
        createdByUser: {
          select: { userId: true, userFirstName: true, userLastName: true },
        },
        deliveryPhotos: { orderBy: { deliveryPhotoCreatedAt: "asc" } },
      },
    });
  },

  update: async (deliveryId, data) => {
    return prisma.delivery.update({
      where: { deliveryId },
      data: {
        ...data,
      },
      include: {
        createdByUser: {
          select: { userId: true, userFirstName: true, userLastName: true },
        },
        updatedByUser: {
          select: { userId: true, userFirstName: true, userLastName: true },
        },
        deliveryPhotos: { orderBy: { deliveryPhotoCreatedAt: "asc" } },
      },
    });
  },

  createPhoto: async (data) => {
    return prisma.deliveryPhoto.create({ data });
  },

  deletePhotosByIds: async (deliveryId, photoIds) => {
    if (!Array.isArray(photoIds) || photoIds.length === 0) return { count: 0 };

    const photos = await prisma.deliveryPhoto.findMany({
      where: {
        deliveryPhotoDeliveryId: deliveryId,
        deliveryPhotoId: { in: photoIds },
      },
      select: { deliveryPhotoPath: true },
    });

    const result = await prisma.deliveryPhoto.deleteMany({
      where: {
        deliveryPhotoDeliveryId: deliveryId,
        deliveryPhotoId: { in: photoIds },
      },
    });

    for (const p of photos) {
      if (p.deliveryPhotoPath) {
        await deleteFile(p.deliveryPhotoPath);
      }
    }

    return result;
  },
};

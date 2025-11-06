import prisma from "@/lib/prisma";
import logger from "@/lib/logger.node";

export const DepartmentRepository = {
  getAll: async (skip = 0, take = 10) => {
    logger.info({ message: "DepartmentRepository.getAll", skip, take });
    return await prisma.department.findMany({
      skip,
      take,
      orderBy: { departmentCreatedAt: "asc" },
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

  countAll: async () => prisma.department.count(),

  findById: async (departmentId) => {
    logger.info({ message: "DepartmentRepository.findById", departmentId });
    return await prisma.department.findUnique({
      where: { departmentId },
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

  findByDepartmentName: async (departmentName) => {
    logger.info({ message: "DepartmentRepository.findByDepartmentName", departmentName });
    return await prisma.department.findFirst({
      where: {
        departmentName: { equals: departmentName.trim(), mode: "insensitive" },
      },
    });
  },

  create: async (data) => {
    logger.info({ message: "DepartmentRepository.create", data });
    return await prisma.department.create({
      data,
      include: {
        createdByUser: {
          select: { userId: true, userFirstName: true, userLastName: true },
        },
      },
    });
  },

  update: async (departmentId, data) => {
    logger.info({ message: "DepartmentRepository.update", departmentId });
    return await prisma.department.update({
      where: { departmentId },
      data,
      include: {
        updatedByUser: {
          select: { userId: true, userFirstName: true, userLastName: true },
        },
      },
    });
  },
};

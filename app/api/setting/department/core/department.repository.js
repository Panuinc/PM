import prisma from "@/lib/prisma";

export const DepartmentRepository = {
  getAll: async (skip = 0, take = 10) => {
    return prisma.department.findMany({
      skip,
      take,
      orderBy: { departmentCreatedAt: "asc" },
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
    return prisma.department.count();
  },

  findById: async (departmentId) => {
    return prisma.department.findUnique({
      where: { departmentId },
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

  findByDepartmentName: async (departmentName) => {
    return prisma.department.findUnique({
      where: { departmentName },
    });
  },

  create: async (data) => {
    return prisma.department.create({
      data,
      include: {
        createdByUser: {
          select: {userId: true, userFirstName: true, userLastName: true },
        },
      },
    });
  },

  update: async (departmentId, data) => {
    return prisma.department.update({
      where: { departmentId },
      data,
      include: {
        updatedByUser: {
          select: {userId: true, userFirstName: true, userLastName: true },
        },
      },
    });
  },
};

import prisma from "@/lib/prisma";
import logger from "@/lib/logger.node";

export const RolePermissionRepository = {
  getAll: async (skip = 0, take = 10) => {
    logger.info({ message: "RolePermissionRepository.getAll", skip, take });
    return await prisma.rolePermission.findMany({
      skip,
      take,
      orderBy: { rolePermissionCreatedAt: "asc" },
      include: {
        role: { select: { roleId: true, roleName: true } },
        permission: { select: { permissionId: true, permissionName: true } },
        createdByUser: {
          select: { userId: true, userFirstName: true, userLastName: true },
        },
        updatedByUser: {
          select: { userId: true, userFirstName: true, userLastName: true },
        },
      },
    });
  },

  countAll: async () => prisma.rolePermission.count(),

  findById: async (rolePermissionId) => {
    logger.info({
      message: "RolePermissionRepository.findById",
      rolePermissionId,
    });
    return await prisma.rolePermission.findUnique({
      where: { rolePermissionId },
      include: {
        role: { select: { roleId: true, roleName: true } },
        permission: { select: { permissionId: true, permissionName: true } },
        createdByUser: {
          select: { userId: true, userFirstName: true, userLastName: true },
        },
        updatedByUser: {
          select: { userId: true, userFirstName: true, userLastName: true },
        },
      },
    });
  },

  findDuplicate: async (rolePermissionRoleId, rolePermissionPermissionId) => {
    logger.info({
      message: "RolePermissionRepository.findDuplicate",
      rolePermissionRoleId,
      rolePermissionPermissionId,
    });
    return await prisma.rolePermission.findFirst({
      where: { rolePermissionRoleId, rolePermissionPermissionId },
    });
  },

  create: async (data) => {
    logger.info({ message: "RolePermissionRepository.create", data });
    return await prisma.rolePermission.create({
      data,
      include: {
        role: { select: { roleId: true, roleName: true } },
        permission: { select: { permissionId: true, permissionName: true } },
        createdByUser: {
          select: { userId: true, userFirstName: true, userLastName: true },
        },
      },
    });
  },

  update: async (rolePermissionId, data) => {
    logger.info({
      message: "RolePermissionRepository.update",
      rolePermissionId,
    });
    return await prisma.rolePermission.update({
      where: { rolePermissionId },
      data,
      include: {
        role: { select: { roleId: true, roleName: true } },
        permission: { select: { permissionId: true, permissionName: true } },
        updatedByUser: {
          select: { userId: true, userFirstName: true, userLastName: true },
        },
      },
    });
  },
};

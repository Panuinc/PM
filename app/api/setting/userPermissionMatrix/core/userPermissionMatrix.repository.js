import prisma from "@/lib/prisma";
import logger from "@/lib/logger.node";

export const UserPermissionMatrixRepository = {
  async getAllUsersWithPermissions() {
    const users = await prisma.user.findMany({
      select: {
        userId: true,
        userFirstName: true,
        userLastName: true,
        userPermissions: {
          select: {
            permission: { select: { permissionId: true, permissionName: true } },
          },
        },
      },
    });
    return users;
  },

  async upsertUserPermission(userId, permissionId, status, updaterId) {
    const existing = await prisma.userPermission.findFirst({
      where: { userPermissionUserId: userId, userPermissionPermissionId: permissionId },
    });

    if (status) {
      if (existing) {
        await prisma.userPermission.update({
          where: { userPermissionId: existing.userPermissionId },
          data: {
            userPermissionStatus: "Enable",
            userPermissionUpdatedBy: updaterId,
            userPermissionUpdatedAt: new Date(),
          },
        });
      } else {
        await prisma.userPermission.create({
          data: {
            userPermissionUserId: userId,
            userPermissionPermissionId: permissionId,
            userPermissionStatus: "Enable",
            userPermissionCreatedBy: updaterId,
            userPermissionCreatedAt: new Date(),
          },
        });
      }
    } else if (existing) {
      await prisma.userPermission.delete({
        where: { userPermissionId: existing.userPermissionId },
      });
    }
  },
};

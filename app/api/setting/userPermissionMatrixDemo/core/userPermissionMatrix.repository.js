import prisma from "@/lib/prisma";
import logger from "@/lib/logger.node";

export const UserPermissionMatrixRepository = {
  async getAllUsersWithPermissions() {
    logger.info({
      message: "UserPermissionMatrixRepository.getAllUsersWithPermissions",
    });

    const users = await prisma.user.findMany({
      select: {
        userId: true,
        userFirstName: true,
        userLastName: true,
        userPermissions: {
          select: {
            permission: {
              select: { permissionId: true, permissionName: true },
            },
          },
        },
      },
    });

    logger.info({
      message:
        "UserPermissionMatrixRepository.getAllUsersWithPermissions success",
      count: users.length,
    });

    return users;
  },

  async upsertUserPermission(userId, permissionId, status, updaterId) {
    logger.info({
      message: "UserPermissionMatrixRepository.upsertUserPermission start",
      userId,
      permissionId,
      status,
      updaterId,
    });

    const existing = await prisma.userPermission.findFirst({
      where: {
        userPermissionUserId: userId,
        userPermissionPermissionId: permissionId,
      },
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
        logger.info({
          message: "UserPermissionMatrixRepository.update existing Enable",
          userPermissionId: existing.userPermissionId,
        });
      } else {
        const created = await prisma.userPermission.create({
          data: {
            userPermissionUserId: userId,
            userPermissionPermissionId: permissionId,
            userPermissionStatus: "Enable",
            userPermissionCreatedBy: updaterId,
            userPermissionCreatedAt: new Date(),
          },
        });
        logger.info({
          message: "UserPermissionMatrixRepository.create new Enable",
          createdId: created.userPermissionId,
        });
      }
    } else if (existing) {
      await prisma.userPermission.delete({
        where: { userPermissionId: existing.userPermissionId },
      });
      logger.info({
        message: "UserPermissionMatrixRepository.delete Disable",
        userPermissionId: existing.userPermissionId,
      });
    } else {
      logger.info({
        message:
          "UserPermissionMatrixRepository.noAction (no existing, status=false)",
        userId,
        permissionId,
      });
    }
  },
};

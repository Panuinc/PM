"use server";

import prisma from "@/lib/prisma";
import logger from "@/lib/logger.node";
import { UserPermissionMatrixRepository } from "@/app/api/setting/userPermissionMatrix/core/userPermissionMatrix.repository";
import { UserPermissionMatrixValidator } from "@/app/api/setting/userPermissionMatrix/core/userPermissionMatrix.validator";

export async function GetAllUserPermissionMatrixUseCase() {
  logger.info({ message: "GetAllUserPermissionMatrixUseCase start" });

  const permissions = await prisma.permission.findMany({
    select: { permissionId: true, permissionName: true },
  });
  logger.info({
    message: "GetAllUserPermissionMatrixUseCase fetched permissions",
    count: permissions.length,
  });

  const users =
    await UserPermissionMatrixRepository.getAllUsersWithPermissions();
  logger.info({
    message: "GetAllUserPermissionMatrixUseCase fetched users",
    count: users.length,
  });

  const matrix = users.map((u) => ({
    userId: u.userId,
    userName: `${u.userFirstName} ${u.userLastName}`,
    permissions: permissions.map((p) => ({
      permissionId: p.permissionId,
      permissionName: p.permissionName,
      hasPermission: u.userPermissions.some(
        (up) => up.permission.permissionId === p.permissionId
      ),
    })),
  }));

  logger.info({
    message: "GetAllUserPermissionMatrixUseCase success",
    matrixUsers: matrix.length,
  });

  return { permissions, matrix };
}

export async function UpdateUserPermissionMatrixUseCase(body) {
  logger.info({ message: "UpdateUserPermissionMatrixUseCase start" });

  const { matrix, updaterId } =
    UserPermissionMatrixValidator.validateMatrix(body);

  logger.info({
    message: "UpdateUserPermissionMatrixUseCase validated",
    updaterId,
    userCount: matrix.length,
  });

  for (const user of matrix) {
    for (const permission of user.permissions) {
      await UserPermissionMatrixRepository.upsertUserPermission(
        user.userId,
        permission.permissionId,
        permission.hasPermission,
        updaterId
      );
    }
  }

  logger.info({
    message: "UpdateUserPermissionMatrixUseCase completed all updates",
    totalUsers: matrix.length,
  });
}

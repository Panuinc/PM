"use server";

import prisma from "@/lib/prisma";
import { UserPermissionMatrixRepository } from "@/app/api/setting/userPermissionMatrix/core/userPermissionMatrix.repository";
import { UserPermissionMatrixValidator } from "@/app/api/setting/userPermissionMatrix/core/userPermissionMatrix.validator";

export async function GetAllUserPermissionMatrixUseCase() {
  const permissions = await prisma.permission.findMany({
    select: { permissionId: true, permissionName: true },
  });

  const users = await UserPermissionMatrixRepository.getAllUsersWithPermissions();

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

  return { permissions, matrix };
}

export async function UpdateUserPermissionMatrixUseCase(body) {
  const { matrix, updaterId } = UserPermissionMatrixValidator.validateMatrix(body);

  for (const user of matrix) {
    for (const perm of user.permissions) {
      await UserPermissionMatrixRepository.upsertUserPermission(
        user.userId,
        perm.permissionId,
        perm.hasPermission,
        updaterId
      );
    }
  }
}

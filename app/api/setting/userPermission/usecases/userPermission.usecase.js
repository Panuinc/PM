import { UserPermissionService } from "@/app/api/setting/userPermission/core/userPermission.service";
import { userPermissionAssignSchema } from "@/app/api/setting/userPermission/core/userPermission.schema";
import { getLocalNow } from "@/lib/getLocalNow";

export async function GetPermissionsForUserUseCase(userId) {
  if (!userId) throw { status: 400, message: "Invalid user ID" };

  return UserPermissionService.getPermissionsWithAssignmentForUser(userId);
}

export async function UpdateUserPermissionsForUserUseCase(data) {
  const parsed = userPermissionAssignSchema.safeParse(data);

  if (!parsed.success) {
    throw {
      status: 422,
      message: "Invalid input",
      details: parsed.error.flatten().fieldErrors,
    };
  }

  const userId = parsed.data.userPermissionUserId.toLowerCase();
  const updaterId = parsed.data.userPermissionUpdatedBy.toLowerCase();
  const now = getLocalNow();

  const normalizedIds = [
    ...new Set(parsed.data.permissionIds.map((id) => id.toLowerCase())),
  ];

  const existing = await UserPermissionService.getByUserId(userId);
  const existingSet = new Set(
    existing.map((e) => e.userPermissionPermissionId)
  );

  await UserPermissionService.deleteManyByUserAndPermissionIdsNotIn(
    userId,
    normalizedIds
  );

  for (const pid of normalizedIds) {
    if (!existingSet.has(pid)) {
      await UserPermissionService.create({
        userPermissionUserId: userId,
        userPermissionPermissionId: pid,
        userPermissionStatus: "Enable",
        userPermissionCreatedBy: updaterId,
        userPermissionCreatedAt: now,
      });
    }
  }

  return UserPermissionService.getPermissionsWithAssignmentForUser(userId);
}

"use client";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import UILoading from "@/components/UILoading";
import { useSessionUser } from "@/hooks/useSessionUser";
import { useSePermission } from "@/hooks/useSePermission";
import {
  useUserPermissionsForUser,
  useSubmitUserPermissionsForUser,
} from "@/app/api/setting/userPermission/hooks";
import { useUser } from "@/app/api/setting/user/hooks";
import UIAssignPermission from "@/components/setting/user/UIAssignPermission";

export default function UserPermissionAssignPage() {
  const router = useRouter();
  const { userId: targetUserId } = useParams();

  const { userId: sessionUserId, userName } = useSessionUser();
  const { can } = useSePermission();

  const { user, loading: loadingUser } = useUser(targetUserId);
  const { permissions, loading } = useUserPermissionsForUser(targetUserId);

  const submitUserPermissions = useSubmitUserPermissionsForUser({
    userId: targetUserId,
    currentUserId: sessionUserId,
  });

  const [selectedIds, setSelectedIds] = useState(new Set());

  useEffect(() => {
    if (!can("userPermission.update")) {
      router.replace("/forbidden");
    }
  }, [can, router]);

  // Initial selected permissions
  useEffect(() => {
    const initial = new Set(
      permissions.filter((p) => p.assigned).map((p) => p.permissionId)
    );
    setSelectedIds(initial);
  }, [permissions]);

  const handleToggle = (permissionId, checked) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (checked) next.add(permissionId);
      else next.delete(permissionId);
      return next;
    });
  };

  const handleSubmit = async () => {
    const permissionIds = Array.from(selectedIds);
    await submitUserPermissions(permissionIds);
  };

  const handleCancel = () => router.back();

  const total = permissions.length;
  const selectedCount = selectedIds.size;

  const headerTopic = useMemo(
    () => `Assign Permissions for User: ${targetUserId}`,
    [targetUserId]
  );

  if (loading || loadingUser) return <UILoading />;

  return (
    <UIAssignPermission
      headerTopic={headerTopic}
      userName={userName}
      targetUserFullName={user?.userFullName ?? targetUserId}
      total={total}
      selectedCount={selectedCount}
      permissions={permissions}
      selectedIds={selectedIds}
      handleToggle={handleToggle}
      handleSubmit={handleSubmit}
      handleCancel={handleCancel}
    />
  );
}

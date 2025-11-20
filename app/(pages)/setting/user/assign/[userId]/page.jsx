"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import UIHeader from "@/components/UIHeader";
import UILoading from "@/components/UILoading";
import { Button, Checkbox } from "@heroui/react";
import { useSessionUser } from "@/hooks/useSessionUser";
import { useSePermission } from "@/hooks/useSePermission";
import {
  useUserPermissionsForUser,
  useSubmitUserPermissionsForUser,
} from "@/app/api/setting/userPermission/hooks";
import { useUser } from "@/app/api/setting/user/hooks";

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

  const total = permissions.length;
  const selectedCount = selectedIds.size;

  const headerTopic = useMemo(
    () => `Assign Permissions for User: ${targetUserId}`,
    [targetUserId]
  );

  if (loading || loadingUser) return <UILoading />;

  return (
    <>
      <UIHeader header={headerTopic} />

      <div className="flex flex-row items-center justify-between w-full h-fit p-2 gap-2">
        <div className="flex flex-col items-start justify-center w-full h-full p-2 gap-1">
          <div className="text-sm">
            Update By : <span className="font-semibold">{userName}</span>
          </div>
          <div className="text-xs text-default-500">
            User :{" "}
            <span className="font-semibold">
              {user ? user.userFullName : targetUserId}
            </span>
          </div>
        </div>
        <div className="flex flex-row items-center justify-end w-full h-full p-2 gap-4">
          <div className="text-sm">
            Total Permissions : <span className="font-semibold">{total}</span>
          </div>
          <div className="text-sm">
            Selected :{" "}
            <span className="font-semibold text-success">{selectedCount}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-start w-full h-full p-2 gap-2 overflow-auto">
        <div className="flex flex-col items-start justify-start w-full max-w-3xl h-fit p-4 gap-2 border-1 rounded-md">
          {permissions.map((p) => (
            <div
              key={p.permissionId}
              className="flex flex-row items-center justify-between w-full py-1"
            >
              <div className="flex-1">
                <Checkbox
                  isSelected={selectedIds.has(p.permissionId)}
                  onValueChange={(checked) =>
                    handleToggle(p.permissionId, checked)
                  }
                  radius="none"
                >
                  <span className="font-mono text-sm">{p.permissionName}</span>
                </Checkbox>
              </div>
            </div>
          ))}

          {permissions.length === 0 && (
            <div className="text-sm text-default-500">
              No permissions defined.
            </div>
          )}
        </div>

        <div className="flex flex-row items-center justify-end w-full max-w-3xl h-fit p-2 gap-2">
          <div className="flex items-center justify-center w-full sm:w-2/12 h-full p-1">
            <Button
              type="button"
              color="primary"
              radius="none"
              className="w-full p-2 font-semibold"
              onPress={handleSubmit}
            >
              Save
            </Button>
          </div>
          <div className="flex items-center justify-center w-full sm:w-2/12 h-full p-1">
            <Button
              type="button"
              color="danger"
              radius="none"
              className="w-full p-2 font-semibold"
              onPress={() => router.back()}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

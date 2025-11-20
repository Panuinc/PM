"use client";
import React from "react";
import { useRouter } from "next/navigation";
import UIUserPermissionList from "@/components/setting/userPermission/UIUserPermissionList";
import { useUserPermissions } from "@/app/api/setting/userPermission/hooks";
import { useSePermission } from "@/hooks/useSePermission";

export default function UserPermissionPage() {
  const router = useRouter();
  const { userPermissions, loading } = useUserPermissions();
  const { can } = useSePermission();

  const handleAddNew = () => {
    if (!can("userPermission.create")) return;
    router.push("/setting/userPermission/create");
  };

  const handleEdit = (item) => {
    if (!can("userPermission.update")) return;
    router.push(`/setting/userPermission/${item.userPermissionId}`);
  };

  return (
    <UIUserPermissionList
      headerTopic="UserPermission"
      UserPermissions={userPermissions}
      loading={loading}
      onAddNew={can("userPermission.create") ? handleAddNew : null}
      onEdit={can("userPermission.update") ? handleEdit : null}
    />
  );
}

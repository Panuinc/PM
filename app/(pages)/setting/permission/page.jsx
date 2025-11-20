"use client";
import React from "react";
import { useRouter } from "next/navigation";
import UIPermissionList from "@/components/setting/permission/UIPermissionList";
import { usePermissions } from "@/app/api/setting/permission/hooks";
import { useSePermission } from "@/hooks/useSePermission";

export default function PermissionPage() {
  const router = useRouter();
  const { permissions, loading } = usePermissions();
  const { can } = useSePermission();

  const handleAddNew = () => {
    if (!can("permission.create")) return;
    router.push("/setting/permission/create");
  };

  const handleEdit = (item) => {
    if (!can("permission.update")) return;
    router.push(`/setting/permission/${item.permissionId}`);
  };

  return (
    <UIPermissionList
      headerTopic="Permission"
      Permissions={permissions}
      loading={loading}
      onAddNew={can("permission.create") ? handleAddNew : null}
      onEdit={can("permission.update") ? handleEdit : null}
    />
  );
}

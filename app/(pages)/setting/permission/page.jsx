"use client";
import React from "react";
import { useRouter } from "next/navigation";
import UIPermissionList from "@/components/setting/permission/UIPermissionList";
import { usePermissions } from "@/app/api/setting/permission/hooks";

export default function PermissionPage() {
  const router = useRouter();
  const { permissions, loading } = usePermissions();

  const handleAddNew = () => {
    router.push("/setting/permission/create");
  };

  const handleView = (item) => {
    router.push(`/setting/permission/view/${item.permissionId}`);
  };

  const handleEdit = (item) => {
    router.push(`/setting/permission/${item.permissionId}`);
  };

  return (
    <UIPermissionList
      headerTopic="Permission"
      Permissions={permissions}
      loading={loading}
      onAddNew={handleAddNew}
      onView={handleView}
      onEdit={handleEdit}
    />
  );
}

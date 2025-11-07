"use client";
import React from "react";
import { useRouter } from "next/navigation";
import UIRolePermissionList from "@/components/setting/rolePermission/UIRolePermissionList";
import { useRolePermissions } from "@/app/api/setting/rolePermission/hooks";

export default function RolePermissionPage() {
  const router = useRouter();
  const { rolePermissions, loading } = useRolePermissions();

  const handleAddNew = () => {
    router.push("/setting/rolePermission/create");
  };

  const handleView = (item) => {
    router.push(`/setting/rolePermission/view/${item.rolePermissionId}`);
  };

  const handleEdit = (item) => {
    router.push(`/setting/rolePermission/${item.rolePermissionId}`);
  };

  return (
    <UIRolePermissionList
      headerTopic="RolePermission"
      RolePermissions={rolePermissions}
      loading={loading}
      onAddNew={handleAddNew}
      onView={handleView}
      onEdit={handleEdit}
    />
  );
}

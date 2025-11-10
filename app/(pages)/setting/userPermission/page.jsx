"use client";
import React from "react";
import { useRouter } from "next/navigation";
import UIUserPermissionList from "@/components/setting/userPermission/UIUserPermissionList";
import { useUserPermissions } from "@/app/api/setting/userPermission/hooks";

export default function UserPermissionPage() {
  const router = useRouter();
  const { userPermissions, loading } = useUserPermissions();

  const handleAddNew = () => {
    router.push("/setting/userPermission/create");
  };

  const handleView = (item) => {
    router.push(`/setting/userPermission/view/${item.userPermissionId}`);
  };

  const handleEdit = (item) => {
    router.push(`/setting/userPermission/${item.userPermissionId}`);
  };

  return (
    <UIUserPermissionList
      headerTopic="UserPermission"
      UserPermissions={userPermissions}
      loading={loading}
      onAddNew={handleAddNew}
      onView={handleView}
      onEdit={handleEdit}
    />
  );
}

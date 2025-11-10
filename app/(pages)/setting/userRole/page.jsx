"use client";
import React from "react";
import { useRouter } from "next/navigation";
import UIUserRoleList from "@/components/setting/userRole/UIUserRoleList";
import { useUserRoles } from "@/app/api/setting/userRole/hooks";

export default function UserRolePage() {
  const router = useRouter();
  const { userRoles, loading } = useUserRoles();

  const handleAddNew = () => {
    router.push("/setting/userRole/create");
  };

  const handleView = (item) => {
    router.push(`/setting/userRole/view/${item.userRoleId}`);
  };

  const handleEdit = (item) => {
    router.push(`/setting/userRole/${item.userRoleId}`);
  };

  return (
    <UIUserRoleList
      headerTopic="UserRole"
      UserRoles={userRoles}
      loading={loading}
      onAddNew={handleAddNew}
      onView={handleView}
      onEdit={handleEdit}
    />
  );
}

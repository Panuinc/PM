"use client";
import React from "react";
import { useRouter } from "next/navigation";
import UIRoleList from "@/components/setting/role/UIRoleList";
import { useRoles } from "@/app/api/setting/role/hooks";

export default function RolePage() {
  const router = useRouter();
  const { roles, loading } = useRoles();

  const handleAddNew = () => {
    router.push("/setting/role/create");
  };

  const handleView = (item) => {
    router.push(`/setting/role/view/${item.roleId}`);
  };

  const handleEdit = (item) => {
    router.push(`/setting/role/${item.roleId}`);
  };

  return (
    <UIRoleList
      headerTopic="Role"
      Roles={roles}
      loading={loading}
      onAddNew={handleAddNew}
      onView={handleView}
      onEdit={handleEdit}
    />
  );
}

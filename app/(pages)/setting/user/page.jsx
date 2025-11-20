"use client";
import React from "react";
import { useRouter } from "next/navigation";
import UIUserList from "@/components/setting/user/UIUserList";
import { useUsers } from "@/app/api/setting/user/hooks";
import { useSePermission } from "@/hooks/useSePermission";

export default function UserPage() {
  const router = useRouter();
  const { users, loading } = useUsers();
  const { can } = useSePermission();

  const handleAddNew = () => {
    if (!can("user.create")) return;
    router.push("/setting/user/create");
  };

  const handleEdit = (item) => {
    if (!can("user.update")) return;
    router.push(`/setting/user/${item.userId}`);
  };

  return (
    <UIUserList
      headerTopic="User"
      Users={users}
      loading={loading}
      onAddNew={can("user.create") ? handleAddNew : null}
      onEdit={can("user.update") ? handleEdit : null}
    />
  );
}

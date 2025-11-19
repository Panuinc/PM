"use client";
import React from "react";
import { useRouter } from "next/navigation";
import UIUserList from "@/components/setting/user/UIUserList";
import { useUsers } from "@/app/api/setting/user/hooks";

export default function UserPage() {
  const router = useRouter();
  const { users, loading } = useUsers();

  const handleAddNew = () => {
    router.push("/setting/user/create");
  };

  const handleEdit = (item) => {
    router.push(`/setting/user/${item.userId}`);
  };

  return (
    <UIUserList
      headerTopic="User"
      Users={users}
      loading={loading}
      onAddNew={handleAddNew}
      onEdit={handleEdit}
    />
  );
}

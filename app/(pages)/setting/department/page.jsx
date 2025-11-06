"use client";
import React from "react";
import { useRouter } from "next/navigation";
import UIDepartmentList from "@/components/setting/department/UIDepartmentList";
import { useDepartments } from "@/app/api/setting/department/hooks";

export default function DepartmentPage() {
  const router = useRouter();
  const { departments, loading } = useDepartments();

  const handleAddNew = () => {
    router.push("/setting/department/create");
  };

  const handleView = (item) => {
    router.push(`/setting/department/view/${item.departmentId}`);
  };

  const handleEdit = (item) => {
    router.push(`/setting/department/${item.departmentId}`);
  };

  return (
    <UIDepartmentList
      headerTopic="Department"
      Departments={departments}
      loading={loading}
      onAddNew={handleAddNew}
      onView={handleView}
      onEdit={handleEdit}
    />
  );
}

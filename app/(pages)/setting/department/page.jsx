"use client";
import React from "react";
import { useRouter } from "next/navigation";
import UIDepartmentList from "@/components/setting/department/UIDepartmentList";
import { useDepartments } from "@/app/api/setting/department/hooks";
import { useSePermission } from "@/hooks/useSePermission";

export default function DepartmentPage() {
  const router = useRouter();
  const { departments, loading } = useDepartments();
  const { can } = useSePermission();

  const handleAddNew = () => {
    if (!can("department.create")) return;
    router.push("/setting/department/create");
  };

  const handleEdit = (item) => {
    if (!can("department.update")) return;
    router.push(`/setting/department/${item.departmentId}`);
  };

  return (
    <UIDepartmentList
      headerTopic="Department"
      Departments={departments}
      loading={loading}
      onAddNew={can("department.create") ? handleAddNew : null}
      onEdit={can("department.update") ? handleEdit : null}
    />
  );
}

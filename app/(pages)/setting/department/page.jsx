"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import UIDepartmentList from "@/components/setting/department/UIDepartmentList";
import { useDepartments } from "@/app/api/setting/department/hooks";
import { usePermissions } from "@/hooks/usePermissions";
import { PERMISSIONS } from "@/constants/permissions";
import UILoading from "@/components/UILoading";

export default function DepartmentPage() {
  const router = useRouter();
  const { hasPermission } = usePermissions();

  const canView = hasPermission(PERMISSIONS.DEPARTMENT_VIEW);
  const canCreate = hasPermission(PERMISSIONS.DEPARTMENT_CREATE);
  const canUpdate = hasPermission(PERMISSIONS.DEPARTMENT_UPDATE);

  const { departments, loading } = useDepartments();

  useEffect(() => {
    if (!canView) {
      router.push("/forbidden");
    }
  }, [canView, router]);

  const handleAddNew = () => {
    if (canCreate) {
      router.push("/setting/department/create");
    }
  };

  const handleView = (item) => {
    router.push(`/setting/department/view/${item.departmentId}`);
  };

  const handleEdit = (item) => {
    if (canUpdate) {
      router.push(`/setting/department/${item.departmentId}`);
    }
  };

  if (!canView) {
    return <UILoading />;
  }

  return (
    <UIDepartmentList
      headerTopic="Department"
      Departments={departments}
      loading={loading}
      onAddNew={canCreate ? handleAddNew : undefined}
      onView={handleView}
      onEdit={canUpdate ? handleEdit : undefined}
    />
  );
}

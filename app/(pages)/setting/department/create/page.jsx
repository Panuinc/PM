"use client";

import React, { useEffect } from "react";
import UIDepartmentForm from "@/components/setting/department/UIDepartmentForm";
import { useSessionUser } from "@/hooks/useSessionUser";
import { useSubmitDepartment } from "@/app/api/setting/department/hooks";
import { useFormHandler } from "@/hooks/useFormHandler";
import { usePermissions } from "@/hooks/usePermissions";
import { PERMISSIONS } from "@/constants/permissions";
import { useRouter } from "next/navigation";
import UILoading from "@/components/UILoading";

export default function DepartmentCreate() {
  const { userId, userName } = useSessionUser();
  const { hasPermission } = usePermissions();
  const router = useRouter();
  const canCreate = hasPermission(PERMISSIONS.DEPARTMENT_CREATE);
  
  const submitDepartment = useSubmitDepartment({ mode: "create", userId });

  const formHandler = useFormHandler(
    {
      departmentName: "",
    },
    submitDepartment
  );

  useEffect(() => {
    if (!canCreate) {
      router.push("/forbidden");
    }
  }, [canCreate, router]);

  if (!canCreate) {
    return <UILoading />;
  }

  return (
    <UIDepartmentForm
      headerTopic="Department Create"
      formHandler={formHandler}
      mode="create"
      operatedBy={userName}
    />
  );
}
"use client";

import React, { useEffect } from "react";
import UIDepartmentForm from "@/components/setting/department/UIDepartmentForm";
import UILoading from "@/components/UILoading";
import { useParams, useRouter } from "next/navigation";
import { useSessionUser } from "@/hooks/useSessionUser";
import {
  useDepartment,
  useSubmitDepartment,
} from "@/app/api/setting/department/hooks";
import { useFormHandler } from "@/hooks/useFormHandler";
import { usePermissions } from "@/hooks/usePermissions";
import { PERMISSIONS } from "@/constants/permissions";

export default function DepartmentUpdate() {
  const { departmentId } = useParams();
  const { userId, userName } = useSessionUser();
  const { hasPermission } = usePermissions();
  const router = useRouter();
  const canUpdate = hasPermission(PERMISSIONS.DEPARTMENT_UPDATE);
  
  const { department, loading } = useDepartment(departmentId);
  const submitDepartment = useSubmitDepartment({
    mode: "update",
    departmentId,
    userId,
  });

  const formHandler = useFormHandler(
    {
      departmentName: "",
      departmentStatus: "",
    },
    submitDepartment
  );

  useEffect(() => {
    if (!canUpdate) {
      router.push("/forbidden");
    }
  }, [canUpdate, router]);

  useEffect(() => {
    if (department) formHandler.setFormData(department);
  }, [department]);

  if (!canUpdate) {
    return <UILoading />;
  }

  if (loading) return <UILoading />;

  return (
    <UIDepartmentForm
      headerTopic="Department Update"
      formHandler={formHandler}
      mode="update"
      operatedBy={userName}
      isUpdate
    />
  );
}
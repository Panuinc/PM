"use client";

import React, { useEffect } from "react";
import UIDepartmentForm from "@/components/setting/department/UIDepartmentForm";
import UILoading from "@/components/UILoading";
import { useParams } from "next/navigation";
import { useFetchDepartmentById } from "@/app/api/setting/department/hooks";
import { useSessionUser } from "@/hooks/useSessionUser";
import { useSubmitDepartment } from "@/app/api/setting/department/hooks";
import { useFormHandler } from "@/hooks/useFormHandler";

export default function DepartmentUpdate() {
  const { departmentId } = useParams();
  const { userId, userName } = useSessionUser();
  const { department, loading } = useFetchDepartmentById(departmentId);
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
    if (department) formHandler.setFormData(department);
  }, [department]);

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

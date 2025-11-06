"use client";

import React from "react";
import UIDepartmentForm from "@/components/setting/department/UIDepartmentForm";
import { useSessionUser } from "@/hooks/useSessionUser";
import { useSubmitDepartment } from "@/app/api/setting/department/hooks";
import { useFormHandler } from "@/hooks/useFormHandler";

export default function DepartmentCreate() {
  const { userId, userName } = useSessionUser();
  const submitDepartment = useSubmitDepartment({ mode: "create", userId });

  const formHandler = useFormHandler(
    {
      departmentName: "",
    },
    submitDepartment
  );

  return (
    <UIDepartmentForm
      headerTopic="Department Create"
      formHandler={formHandler}
      mode="create"
      operatedBy={userName}
    />
  );
}

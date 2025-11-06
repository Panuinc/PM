"use client";

import React from "react";
import UIUserForm from "@/components/setting/user/UIUserForm";
import { useSessionUser } from "@/hooks/useSessionUser";
import { useSubmitUser } from "@/app/api/setting/user/hooks";
import { useFormHandler } from "@/hooks/useFormHandler";
import { useDepartments } from "@/app/api/setting/department/hooks";

export default function UserCreate() {
  const { userId, userName } = useSessionUser();
  const { departments, loading } = useDepartments();
const submitUser = useSubmitUser({ mode: "create", currentUserId: userId });

  const formHandler = useFormHandler(
    {
      userFirstName: "",
      userLastName: "",
      userEmail: "",
      userPassword: "",
      userDepartmentId: "",
    },
    submitUser
  );

  if (loading) return <div>Loading departments...</div>;

  return (
    <UIUserForm
      headerTopic="User Create"
      formHandler={formHandler}
      mode="create"
      operatedBy={userName}
      departments={departments}
    />
  );
}

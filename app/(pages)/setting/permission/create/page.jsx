"use client";

import React from "react";
import UIPermissionForm from "@/components/setting/permission/UIPermissionForm";
import { useSessionUser } from "@/hooks/useSessionUser";
import { useSubmitPermission } from "@/app/api/setting/permission/hooks";
import { useFormHandler } from "@/hooks/useFormHandler";

export default function PermissionCreate() {
  const { userId, userName } = useSessionUser();
  const submitPermission = useSubmitPermission({ mode: "create", userId });

  const formHandler = useFormHandler(
    {
      permissionName: "",
      permissionKey: "",
    },
    submitPermission
  );

  return (
    <UIPermissionForm
      headerTopic="Permission Create"
      formHandler={formHandler}
      mode="create"
      operatedBy={userName}
    />
  );
}

"use client";

import React from "react";
import UIRolePermissionForm from "@/components/setting/rolePermission/UIRolePermissionForm";
import { useSessionUser } from "@/hooks/useSessionUser";
import { useSubmitRolePermission } from "@/app/api/setting/rolePermission/hooks";
import { useFormHandler } from "@/hooks/useFormHandler";

export default function RolePermissionCreate() {
  const { userId, userName } = useSessionUser();
  const submitRolePermission = useSubmitRolePermission({
    mode: "create",
    userId,
  });

  const formHandler = useFormHandler(
    {
      rolePermissionRoleId: "",
      rolePermissionPermissionId: "",
    },
    submitRolePermission
  );

  return (
    <UIRolePermissionForm
      headerTopic="RolePermission Create"
      formHandler={formHandler}
      mode="create"
      operatedBy={userName}
    />
  );
}

"use client";

import React from "react";
import UIRoleForm from "@/components/setting/role/UIRoleForm";
import { useSessionUser } from "@/hooks/useSessionUser";
import { useSubmitRole } from "@/app/api/setting/role/hooks";
import { useFormHandler } from "@/hooks/useFormHandler";

export default function RoleCreate() {
  const { userId, userName } = useSessionUser();
  const submitRole = useSubmitRole({ mode: "create", userId });

  const formHandler = useFormHandler(
    {
      roleName: "",
    },
    submitRole
  );

  return (
    <UIRoleForm
      headerTopic="Role Create"
      formHandler={formHandler}
      mode="create"
      operatedBy={userName}
    />
  );
}

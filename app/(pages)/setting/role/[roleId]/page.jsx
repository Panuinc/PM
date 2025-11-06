"use client";

import React, { useEffect } from "react";
import UIRoleForm from "@/components/setting/role/UIRoleForm";
import UILoading from "@/components/UILoading";
import { useParams } from "next/navigation";
import { useSessionUser } from "@/hooks/useSessionUser";
import {
  useRole,
  useSubmitRole,
} from "@/app/api/setting/role/hooks";
import { useFormHandler } from "@/hooks/useFormHandler";

export default function RoleUpdate() {
  const { roleId } = useParams();
  const { userId, userName } = useSessionUser();
  const { role, loading } = useRole(roleId);
  const submitRole = useSubmitRole({
    mode: "update",
    roleId,
    userId,
  });

  const formHandler = useFormHandler(
    {
      roleName: "",
      roleStatus: "",
    },
    submitRole
  );

  useEffect(() => {
    if (role) formHandler.setFormData(role);
  }, [role]);

  if (loading) return <UILoading />;

  return (
    <UIRoleForm
      headerTopic="Role Update"
      formHandler={formHandler}
      mode="update"
      operatedBy={userName}
      isUpdate
    />
  );
}

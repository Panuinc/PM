"use client";

import React, { useEffect } from "react";
import UIRolePermissionForm from "@/components/setting/rolePermission/UIRolePermissionForm";
import UILoading from "@/components/UILoading";
import { useParams } from "next/navigation";
import { useSessionUser } from "@/hooks/useSessionUser";
import {
  useRolePermission,
  useSubmitRolePermission,
} from "@/app/api/setting/rolePermission/hooks";
import { useFormHandler } from "@/hooks/useFormHandler";

export default function RolePermissionUpdate() {
  const { rolePermissionId } = useParams();
  const { userId, userName } = useSessionUser();
  const { rolePermission, loading } = useRolePermission(rolePermissionId);
  const submitRolePermission = useSubmitRolePermission({
    mode: "update",
    rolePermissionId,
    userId,
  });

  const formHandler = useFormHandler(
    {
      rolePermissionRoleId: "",
      rolePermissionPermissionId: "",
      rolePermissionStatus: "",
    },
    submitRolePermission
  );

  useEffect(() => {
    if (rolePermission) formHandler.setFormData(rolePermission);
  }, [rolePermission]);

  if (loading) return <UILoading />;

  return (
    <UIRolePermissionForm
      headerTopic="RolePermission Update"
      formHandler={formHandler}
      mode="update"
      operatedBy={userName}
      isUpdate
    />
  );
}

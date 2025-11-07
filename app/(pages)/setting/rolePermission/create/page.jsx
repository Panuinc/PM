"use client";

import React from "react";
import UIRolePermissionForm from "@/components/setting/rolePermission/UIRolePermissionForm";
import { useSessionUser } from "@/hooks/useSessionUser";
import { useSubmitRolePermission } from "@/app/api/setting/rolePermission/hooks";
import { useFormHandler } from "@/hooks/useFormHandler";
import { useRoles } from "@/app/api/setting/role/hooks";
import { usePermissions } from "@/app/api/setting/permission/hooks";
import UILoading from "@/components/UILoading";

export default function RolePermissionCreate() {
  const { userId, userName } = useSessionUser();
  const { roles, loading: roleLoading } = useRoles();
  const { permissions, loading: permLoading } = usePermissions();

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

  if (roleLoading || permLoading) return <UILoading />;

  return (
    <UIRolePermissionForm
      headerTopic="RolePermission Create"
      formHandler={formHandler}
      mode="create"
      operatedBy={userName}
      roles={roles}
      permissions={permissions}
    />
  );
}

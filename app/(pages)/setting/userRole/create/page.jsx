"use client";

import React from "react";
import UIUserRoleForm from "@/components/setting/userRole/UIUserRoleForm";
import { useSessionUser } from "@/hooks/useSessionUser";
import { useSubmitUserRole } from "@/app/api/setting/userRole/hooks";
import { useFormHandler } from "@/hooks/useFormHandler";
import { useRoles } from "@/app/api/setting/role/hooks";
import { usePermissions } from "@/app/api/setting/permission/hooks";
import UILoading from "@/components/UILoading";

export default function UserRoleCreate() {
  const { userId, userName } = useSessionUser();
  const { roles, loading: roleLoading } = useRoles();
  const { permissions, loading: permLoading } = usePermissions();

  const submitUserRole = useSubmitUserRole({
    mode: "create",
    userId,
  });

  const formHandler = useFormHandler(
    {
      userRoleRoleId: "",
      userRolePermissionId: "",
    },
    submitUserRole
  );

  if (roleLoading || permLoading) return <UILoading />;

  return (
    <UIUserRoleForm
      headerTopic="UserRole Create"
      formHandler={formHandler}
      mode="create"
      operatedBy={userName}
      roles={roles}
      permissions={permissions}
    />
  );
}

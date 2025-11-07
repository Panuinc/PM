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
import { useRoles } from "@/app/api/setting/role/hooks";
import { usePermissions } from "@/app/api/setting/permission/hooks";

export default function RolePermissionUpdate() {
  const { rolePermissionId } = useParams();
  const { userId, userName } = useSessionUser();
  const { rolePermission, loading: rpLoading } =
    useRolePermission(rolePermissionId);
  const { roles, loading: roleLoading } = useRoles();
  const { permissions, loading: permLoading } = usePermissions();

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

  if (rpLoading || roleLoading || permLoading) return <UILoading />;

  return (
    <UIRolePermissionForm
      headerTopic="RolePermission Update"
      formHandler={formHandler}
      mode="update"
      operatedBy={userName}
      isUpdate
      roles={roles}
      permissions={permissions}
    />
  );
}

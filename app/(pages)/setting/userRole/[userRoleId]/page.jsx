"use client";

import React, { useEffect } from "react";
import UIUserRoleForm from "@/components/setting/userRole/UIUserRoleForm";
import UILoading from "@/components/UILoading";
import { useParams } from "next/navigation";
import { useSessionUser } from "@/hooks/useSessionUser";
import {
  useUserRole,
  useSubmitUserRole,
} from "@/app/api/setting/userRole/hooks";
import { useFormHandler } from "@/hooks/useFormHandler";
import { useRoles } from "@/app/api/setting/role/hooks";
import { usePermissions } from "@/app/api/setting/permission/hooks";

export default function UserRoleUpdate() {
  const { userRoleId } = useParams();
  const { userId, userName } = useSessionUser();
  const { userRole, loading: rpLoading } =
    useUserRole(userRoleId);
  const { roles, loading: roleLoading } = useRoles();
  const { permissions, loading: permLoading } = usePermissions();

  const submitUserRole = useSubmitUserRole({
    mode: "update",
    userRoleId,
    userId,
  });

  const formHandler = useFormHandler(
    {
      userRoleRoleId: "",
      userRolePermissionId: "",
      userRoleStatus: "",
    },
    submitUserRole
  );

  useEffect(() => {
    if (userRole) formHandler.setFormData(userRole);
  }, [userRole]);

  if (rpLoading || roleLoading || permLoading) return <UILoading />;

  return (
    <UIUserRoleForm
      headerTopic="UserRole Update"
      formHandler={formHandler}
      mode="update"
      operatedBy={userName}
      isUpdate
      roles={roles}
      permissions={permissions}
    />
  );
}

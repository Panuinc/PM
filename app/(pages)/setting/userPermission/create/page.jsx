"use client";

import React from "react";
import UIUserPermissionForm from "@/components/setting/userPermission/UIUserPermissionForm";
import { useSessionUser } from "@/hooks/useSessionUser";
import { useSubmitUserPermission } from "@/app/api/setting/userPermission/hooks";
import { useFormHandler } from "@/hooks/useFormHandler";
import { usePermissions } from "@/app/api/setting/permission/hooks";
import { useUsers } from "@/app/api/setting/user/hooks";
import UILoading from "@/components/UILoading";

export default function UserPermissionCreate() {
  const { userId, userName } = useSessionUser();
  const { permissions, loading: permissionLoading } = usePermissions();
  const { users, loading: userLoading } = useUsers();

  const submitUserPermission = useSubmitUserPermission({
    mode: "create",
    userId,
  });

  const formHandler = useFormHandler(
    {
      userPermissionPermissionId: "",
      userPermissionUserId: "",
    },
    submitUserPermission
  );

  if (permissionLoading || userLoading) return <UILoading />;

  return (
    <UIUserPermissionForm
      headerTopic="UserPermission Create"
      formHandler={formHandler}
      mode="create"
      operatedBy={userName}
      permissions={permissions}
      users={users}
    />
  );
}

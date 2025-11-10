"use client";

import React, { useEffect } from "react";
import UIUserPermissionForm from "@/components/setting/userPermission/UIUserPermissionForm";
import UILoading from "@/components/UILoading";
import { useParams } from "next/navigation";
import { useSessionUser } from "@/hooks/useSessionUser";
import {
  useUserPermission,
  useSubmitUserPermission,
} from "@/app/api/setting/userPermission/hooks";
import { useFormHandler } from "@/hooks/useFormHandler";
import { usePermissions } from "@/app/api/setting/permission/hooks";
import { useUsers } from "@/app/api/setting/user/hooks";

export default function UserPermissionUpdate() {
  const { userPermissionId } = useParams();
  const { userId, userName } = useSessionUser();
  const { userPermission, loading: rpLoading } = useUserPermission(userPermissionId);
  const { permissions, loading: permissionLoading } = usePermissions();
  const { users, loading: userLoading } = useUsers();

  const submitUserPermission = useSubmitUserPermission({
    mode: "update",
    userPermissionId,
    userId,
  });

  const formHandler = useFormHandler(
    {
      userPermissionPermissionId: "",
      userPermissionUserId: "",
      userPermissionStatus: "",
    },
    submitUserPermission
  );

  useEffect(() => {
    if (userPermission) formHandler.setFormData(userPermission);
  }, [userPermission]);

  if (rpLoading || permissionLoading || userLoading) return <UILoading />;

  return (
    <UIUserPermissionForm
      headerTopic="UserPermission Update"
      formHandler={formHandler}
      mode="update"
      operatedBy={userName}
      isUpdate
      permissions={permissions}
      users={users}
    />
  );
}

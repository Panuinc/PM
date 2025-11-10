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
import { useUsers } from "@/app/api/setting/user/hooks";

export default function UserRoleUpdate() {
  const { userRoleId } = useParams();
  const { userId, userName } = useSessionUser();
  const { userRole, loading: rpLoading } =
    useUserRole(userRoleId);
  const { roles, loading: roleLoading } = useRoles();
  const { users, loading: permLoading } = useUsers();

  const submitUserRole = useSubmitUserRole({
    mode: "update",
    userRoleId,
    userId,
  });

  const formHandler = useFormHandler(
    {
      userRoleRoleId: "",
      userRoleUserId: "",
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
      users={users}
    />
  );
}

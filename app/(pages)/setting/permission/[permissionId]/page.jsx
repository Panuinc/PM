"use client";

import React, { useEffect } from "react";
import UIPermissionForm from "@/components/setting/permission/UIPermissionForm";
import UILoading from "@/components/UILoading";
import { useParams } from "next/navigation";
import { useSessionUser } from "@/hooks/useSessionUser";
import {
  usePermission,
  useSubmitPermission,
} from "@/app/api/setting/permission/hooks";
import { useFormHandler } from "@/hooks/useFormHandler";

export default function PermissionUpdate() {
  const { permissionId } = useParams();
  const { userId, userName } = useSessionUser();
  const { permission, loading } = usePermission(permissionId);
  const submitPermission = useSubmitPermission({
    mode: "update",
    permissionId,
    userId,
  });

  const formHandler = useFormHandler(
    {
      permissionName: "",
      permissionKey: "",
      permissionStatus: "",
    },
    submitPermission
  );

  useEffect(() => {
    if (permission) formHandler.setFormData(permission);
  }, [permission]);

  if (loading) return <UILoading />;

  return (
    <UIPermissionForm
      headerTopic="Permission Update"
      formHandler={formHandler}
      mode="update"
      operatedBy={userName}
      isUpdate
    />
  );
}

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import UIPermissionForm from "@/components/setting/permission/UIPermissionForm";
import { useSessionUser } from "@/hooks/useSessionUser";
import { useSubmitPermission } from "@/app/api/setting/permission/hooks";
import { useFormHandler } from "@/hooks/useFormHandler";
import { useSePermission } from "@/hooks/useSePermission";

export default function PermissionCreate() {
  const router = useRouter();
  const { can } = useSePermission();
  const { userId, userName } = useSessionUser();

  useEffect(() => {
    if (!can("permission.create")) {
      router.replace("/forbidden");
    }
  }, [can]);

  const submitPermission = useSubmitPermission({
    mode: "create",
    currentPermissionId: userId,
  });

  const formHandler = useFormHandler(
    {
      permissionName: "",
    },
    submitPermission
  );

  return (
    <UIPermissionForm
      headerTopic="Permission Create"
      formHandler={formHandler}
      mode="create"
      operatedBy={userName}
    />
  );
}

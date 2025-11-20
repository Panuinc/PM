"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import UIUserPermissionForm from "@/components/setting/userPermission/UIUserPermissionForm";
import { useSessionUser } from "@/hooks/useSessionUser";
import { useSubmitUserPermission } from "@/app/api/setting/userPermission/hooks";
import { useFormHandler } from "@/hooks/useFormHandler";
import { useSePermission } from "@/hooks/useSePermission";

export default function UserPermissionCreate() {
  const router = useRouter();
  const { can } = useSePermission();
  const { userId, userName } = useSessionUser();

  useEffect(() => {
    if (!can("userPermission.create")) {
      router.replace("/forbidden");
    }
  }, [can]);

  const submitUserPermission = useSubmitUserPermission({
    mode: "create",
    currentUserPermissionId: userId,
  });

  const formHandler = useFormHandler(
    {
      userPermissionName: "",
    },
    submitUserPermission
  );

  return (
    <UIUserPermissionForm
      headerTopic="UserPermission Create"
      formHandler={formHandler}
      mode="create"
      operatedBy={userName}
    />
  );
}

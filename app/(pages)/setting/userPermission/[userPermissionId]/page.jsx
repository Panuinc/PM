"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import UIUserPermissionForm from "@/components/setting/userPermission/UIUserPermissionForm";
import UILoading from "@/components/UILoading";
import { useSessionUser } from "@/hooks/useSessionUser";
import {
  useUserPermission,
  useSubmitUserPermission,
} from "@/app/api/setting/userPermission/hooks";
import { useFormHandler } from "@/hooks/useFormHandler";
import { useSePermission } from "@/hooks/useSePermission";

export default function UserPermissionUpdate() {
  const router = useRouter();
  const { can } = useSePermission();

  const { userPermissionId } = useParams();
  const { userId: sessionUserId, userName } = useSessionUser();

  const { userPermission, loading: userPermissionLoading } =
    useUserPermission(userPermissionId);

  useEffect(() => {
    if (!can("userPermission.update")) {
      router.replace("/forbidden");
    }
  }, [can]);

  const submitUserPermission = useSubmitUserPermission({
    mode: "update",
    userPermissionId,
    currentUserPermissionId: sessionUserId,
  });

  const formHandler = useFormHandler(
    {
      userPermissionName: "",
      userPermissionStatus: "",
    },
    submitUserPermission
  );

  useEffect(() => {
    if (userPermission) formHandler.setFormData(userPermission);
  }, [userPermission]);

  if (userPermissionLoading) return <UILoading />;

  return (
    <UIUserPermissionForm
      headerTopic="UserPermission Update"
      formHandler={formHandler}
      mode="update"
      operatedBy={userName}
      isUpdate
    />
  );
}

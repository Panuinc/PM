"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import UIUserForm from "@/components/setting/user/UIUserForm";
import { useSessionUser } from "@/hooks/useSessionUser";
import { useSubmitUser } from "@/app/api/setting/user/hooks";
import { useFormHandler } from "@/hooks/useFormHandler";
import { useSePermission } from "@/hooks/useSePermission";

export default function UserCreate() {
  const router = useRouter();
  const { can } = useSePermission();
  const { userId, userName } = useSessionUser();

  useEffect(() => {
    if (!can("user.create")) {
      router.replace("/forbidden");
    }
  }, [can]);

  const submitUser = useSubmitUser({
    mode: "create",
    currentUserId: userId,
  });

  const formHandler = useFormHandler(
    {
      permissionName: "",
    },
    submitUser
  );

  return (
    <UIUserForm
      headerTopic="User Create"
      formHandler={formHandler}
      mode="create"
      operatedBy={userName}
    />
  );
}

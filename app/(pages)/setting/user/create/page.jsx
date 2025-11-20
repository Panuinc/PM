"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import UIUserForm from "@/components/setting/user/UIUserForm";
import { useSessionUser } from "@/hooks/useSessionUser";
import { useSubmitUser } from "@/app/api/setting/user/hooks";
import { useFormHandler } from "@/hooks/useFormHandler";
import { usePermission } from "@/hooks/usePermission";

export default function UserCreate() {
  const router = useRouter();
  const { can } = usePermission();
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
      userFirstName: "",
      userLastName: "",
      userEmail: "",
      userPassword: "",
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

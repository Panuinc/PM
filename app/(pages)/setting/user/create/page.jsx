"use client";

import React from "react";
import UIUserForm from "@/components/setting/user/UIUserForm";
import { useSessionUser } from "@/hooks/useSessionUser";
import { useSubmitUser } from "@/app/api/setting/user/hooks";
import { useFormHandler } from "@/hooks/useFormHandler";

export default function UserCreate() {
  const { userId, userName } = useSessionUser();
  const submitUser = useSubmitUser({ mode: "create", userId });

  const formHandler = useFormHandler(
    {
      userFirstName: "",
    },
    submitUser
  );

  return (
    <>
      <UIUserForm
        headerTopic="User Create"
        formHandler={formHandler}
        mode="create"
        operatedBy={userName}
      />
    </>
  );
}

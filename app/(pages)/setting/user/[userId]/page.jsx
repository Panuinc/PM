"use client";

import React, { useEffect } from "react";
import UIUserForm from "@/components/setting/user/UIUserForm";
import UILoading from "@/components/UILoading";
import { useParams } from "next/navigation";
import { useSessionUser } from "@/hooks/useSessionUser";
import { useUser, useSubmitUser } from "@/app/api/setting/user/hooks";
import { useFormHandler } from "@/hooks/useFormHandler";

export default function UserUpdate() {
  const { userId } = useParams();
  const { userId: sessionUserId, userName } = useSessionUser();
  const { user, loading } = useUser(userId);
  const submitUser = useSubmitUser({
    mode: "update",
    userId,
    userId: sessionUserId,
  });

  const formHandler = useFormHandler(
    {
      userFirstName: "",
      userLastName: "",
      userEmail: "",
      userDepartmentId: "",
      userStatus: "",
    },
    submitUser
  );

  useEffect(() => {
    if (user) formHandler.setFormData(user);
  }, [user]);

  if (loading) return <UILoading />;

  return (
    <UIUserForm
      headerTopic="User Update"
      formHandler={formHandler}
      mode="update"
      operatedBy={userName}
      isUpdate
    />
  );
}

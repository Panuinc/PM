"use client";

import React, { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import UIUserForm from "@/components/setting/user/UIUserForm";
import UILoading from "@/components/UILoading";
import { useSessionUser } from "@/hooks/useSessionUser";
import { useUser, useSubmitUser } from "@/app/api/setting/user/hooks";
import { useFormHandler } from "@/hooks/useFormHandler";
import { usePermission } from "@/hooks/usePermission";

export default function UserUpdate() {
  const router = useRouter();
  const { can } = usePermission();
  const { userId } = useParams();
  const { userId: sessionUserId, userName } = useSessionUser();
  const { user, loading: userLoading } = useUser(userId);

  useEffect(() => {
    if (!can("user.update")) {
      router.replace("/forbidden");
    }
  }, [can]);

  const submitUser = useSubmitUser({
    mode: "update",
    userId,
    currentUserId: sessionUserId,
  });

  const formHandler = useFormHandler(
    {
      userFirstName: "",
      userLastName: "",
      userEmail: "",
      userStatus: "",
    },
    submitUser
  );

  useEffect(() => {
    if (user) formHandler.setFormData(user);
  }, [user]);

  if (userLoading) return <UILoading />;

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

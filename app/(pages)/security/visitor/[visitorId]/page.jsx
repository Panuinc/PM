"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import UIVisitorForm from "@/components/security/visitor/UIVisitorForm";
import UILoading from "@/components/UILoading";
import { useSessionUser } from "@/hooks/useSessionUser";
import { useVisitor, useSubmitVisitor } from "@/app/api/security/visitor/hooks";
import { useUsers } from "@/app/api/setting/user/hooks";
import { useFormHandler } from "@/hooks/useFormHandler";
import { useSePermission } from "@/hooks/useSePermission";

export default function VisitorUpdate() {
  const router = useRouter();
  const { can } = useSePermission();

  const { visitorId } = useParams();
  const { userId: sessionUserId, userName } = useSessionUser();

  const { visitor, loading: visitorLoading } = useVisitor(visitorId);
  const { users, loading: usersLoading } = useUsers();

  useEffect(() => {
    if (!can("visitor.update")) {
      router.replace("/forbidden");
    }
  }, [can]);

  const submitVisitor = useSubmitVisitor({
    mode: "update",
    visitorId,
    currentUserId: sessionUserId,
  });

  const formHandler = useFormHandler(
    {
      visitorFirstName: "",
      visitorLastName: "",
      visitorCompany: "",
      visitorCarRegistration: "",
      visitorProvince: "",
      visitorContactUserId: "",
      visitorContactReason: "",
      visitorPhoto: "",
      visitorDocumentPhotos: "",
      visitorStatus: "",
    },
    submitVisitor
  );

  useEffect(() => {
    if (visitor) formHandler.setFormData(visitor);
  }, [visitor]);

  if (visitorLoading || usersLoading) return <UILoading />;

  return (
    <UIVisitorForm
      headerTopic="Visitor Update"
      formHandler={formHandler}
      mode="update"
      operatedBy={userName}
      contactUsers={users}
      isUpdate
    />
  );
}

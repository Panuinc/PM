"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import UIVisitorForm from "@/components/security/visitor/UIVisitorForm";
import UILoading from "@/components/UILoading";
import { useSessionUser } from "@/hooks/useSessionUser";
import { useSubmitVisitor } from "@/app/api/security/visitor/hooks";
import { useUsers } from "@/app/api/setting/user/hooks";
import { useFormHandler } from "@/hooks/useFormHandler";
import { useSePermission } from "@/hooks/useSePermission";

export default function VisitorCreate() {
  const router = useRouter();
  const { can } = useSePermission();
  const { userId, userName } = useSessionUser();
  const { users, loading: usersLoading } = useUsers();

  useEffect(() => {
    if (!can("visitor.create")) {
      router.replace("/forbidden");
    }
  }, [can, router]);

  const submitVisitor = useSubmitVisitor({
    mode: "create",
    currentUserId: userId,
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
      // Photo fields
      visitorPhoto: "",
      visitorPhotoFile: null,
      visitorDocumentPhotos: "",
      visitorDocumentFiles: [],
    },
    submitVisitor
  );

  if (usersLoading) return <UILoading />;

  return (
    <UIVisitorForm
      headerTopic="Visitor Check-In"
      formHandler={formHandler}
      mode="create"
      operatedBy={userName}
      contactUsers={users}
    />
  );
}
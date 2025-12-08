"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import UIVisitorForm from "@/components/security/visitor/UIVisitorForm";
import UILoading from "@/components/UILoading";
import { useSessionUser } from "@/hooks/useSessionUser";
import {
  useVisitor,
  useSubmitVisitor,
} from "@/app/api/security/visitor/hooks";
import { useFormHandler } from "@/hooks/useFormHandler";
import { useSePermission } from "@/hooks/useSePermission";

export default function VisitorUpdate() {
  const router = useRouter();
  const { can } = useSePermission();

  const { visitorId } = useParams();
  const { userId: sessionUserId, userName } = useSessionUser();

  const { visitor, loading: visitorLoading } =
    useVisitor(visitorId);

  useEffect(() => {
    if (!can("visitor.update")) {
      router.replace("/forbidden");
    }
  }, [can]);

  const submitVisitor = useSubmitVisitor({
    mode: "update",
    visitorId,
    currentVisitorId: sessionUserId,
  });

  const formHandler = useFormHandler(
    {
      visitorName: "",
      visitorStatus: "",
    },
    submitVisitor
  );

  useEffect(() => {
    if (visitor) formHandler.setFormData(visitor);
  }, [visitor]);

  if (visitorLoading) return <UILoading />;

  return (
    <UIVisitorForm
      headerTopic="Visitor Update"
      formHandler={formHandler}
      mode="update"
      operatedBy={userName}
      isUpdate
    />
  );
}

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import UIVisitorForm from "@/components/security/visitor/UIVisitorForm";
import { useSessionUser } from "@/hooks/useSessionUser";
import { useSubmitVisitor } from "@/app/api/security/visitor/hooks";
import { useFormHandler } from "@/hooks/useFormHandler";
import { useSePermission } from "@/hooks/useSePermission";

export default function VisitorCreate() {
  const router = useRouter();
  const { can } = useSePermission();
  const { userId, userName } = useSessionUser();

  useEffect(() => {
    if (!can("visitor.create")) {
      router.replace("/forbidden");
    }
  }, [can]);

  const submitVisitor = useSubmitVisitor({
    mode: "create",
    currentVisitorId: userId,
  });

  const formHandler = useFormHandler(
    {
      visitorName: "",
    },
    submitVisitor
  );

  return (
    <UIVisitorForm
      headerTopic="Visitor Create"
      formHandler={formHandler}
      mode="create"
      operatedBy={userName}
    />
  );
}

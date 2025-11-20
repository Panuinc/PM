"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import UIDepartmentForm from "@/components/setting/department/UIDepartmentForm";
import { useSessionUser } from "@/hooks/useSessionUser";
import { useSubmitDepartment } from "@/app/api/setting/department/hooks";
import { useFormHandler } from "@/hooks/useFormHandler";
import { useSePermission } from "@/hooks/useSePermission";

export default function DepartmentCreate() {
  const router = useRouter();
  const { can } = useSePermission();
  const { userId, userName } = useSessionUser();

  useEffect(() => {
    if (!can("department.create")) {
      router.replace("/forbidden");
    }
  }, [can]);

  const submitDepartment = useSubmitDepartment({
    mode: "create",
    currentDepartmentId: userId,
  });

  const formHandler = useFormHandler(
    {
      departmentName: "",
    },
    submitDepartment
  );

  return (
    <UIDepartmentForm
      headerTopic="Department Create"
      formHandler={formHandler}
      mode="create"
      operatedBy={userName}
    />
  );
}

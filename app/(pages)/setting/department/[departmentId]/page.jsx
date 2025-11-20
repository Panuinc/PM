"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import UIDepartmentForm from "@/components/setting/department/UIDepartmentForm";
import UILoading from "@/components/UILoading";
import { useSessionUser } from "@/hooks/useSessionUser";
import {
  useDepartment,
  useSubmitDepartment,
} from "@/app/api/setting/department/hooks";
import { useFormHandler } from "@/hooks/useFormHandler";
import { useSePermission } from "@/hooks/useSePermission";

export default function DepartmentUpdate() {
  const router = useRouter();
  const { can } = useSePermission();

  const { departmentId } = useParams();
  const { userId: sessionUserId, userName } = useSessionUser();

  const { department, loading: departmentLoading } =
    useDepartment(departmentId);

  useEffect(() => {
    if (!can("department.update")) {
      router.replace("/forbidden");
    }
  }, [can]);

  const submitDepartment = useSubmitDepartment({
    mode: "update",
    departmentId,
    currentDepartmentId: sessionUserId,
  });

  const formHandler = useFormHandler(
    {
      departmentName: "",
      departmentStatus: "",
    },
    submitDepartment
  );

  useEffect(() => {
    if (department) formHandler.setFormData(department);
  }, [department]);

  if (departmentLoading) return <UILoading />;

  return (
    <UIDepartmentForm
      headerTopic="Department Update"
      formHandler={formHandler}
      mode="update"
      operatedBy={userName}
      isUpdate
    />
  );
}

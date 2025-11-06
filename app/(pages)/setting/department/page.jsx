"use client";

import UIDepartmentList from "@/components/setting/department/UIDepartmentList";
import React from "react";
import { useFetchDepartments } from "@/app/api/setting/department/hooks";

export default function Department() {
  const { departments, loading } = useFetchDepartments();

  return (
    <>
      <UIDepartmentList
        headerTopic="Department"
        Departments={departments}
        loading={loading}
      />
    </>
  );
}

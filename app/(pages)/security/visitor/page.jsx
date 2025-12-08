"use client";
import React from "react";
import { useRouter } from "next/navigation";
import UIVisitorList from "@/components/security/visitor/UIVisitorList";
import { useVisitors } from "@/app/api/security/visitor/hooks";
import { useSePermission } from "@/hooks/useSePermission";

export default function VisitorPage() {
  const router = useRouter();
  const { visitors, loading } = useVisitors();
  const { can } = useSePermission();

  const handleAddNew = () => {
    if (!can("visitor.create")) return;
    router.push("/security/visitor/create");
  };

  const handleEdit = (item) => {
    if (!can("visitor.update")) return;
    router.push(`/security/visitor/${item.visitorId}`);
  };

  return (
    <UIVisitorList
      headerTopic="Visitor"
      Visitors={visitors}
      loading={loading}
      onAddNew={can("visitor.create") ? handleAddNew : null}
      onEdit={can("visitor.update") ? handleEdit : null}
    />
  );
}

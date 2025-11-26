"use client";
import React from "react";
import { useRouter } from "next/navigation";
import UIDeliveryList from "@/components/logistic/delivery/UIDeliveryList";
import { useDeliverys } from "@/app/api/logistic/delivery/hooks";
import { useSePermission } from "@/hooks/useSePermission";

export default function DeliveryPage() {
  const router = useRouter();
  const { deliverys, loading } = useDeliverys();
  const { can } = useSePermission();

  const handleAddNew = () => {
    if (!can("delivery.create")) return;
    router.push("/logistic/delivery/create");
  };

  const handleEdit = (item) => {
    if (!can("delivery.update")) return;
    router.push(`/logistic/delivery/${item.deliveryId}`);
  };

  return (
    <UIDeliveryList
      headerTopic="Delivery"
      Deliverys={deliverys}
      loading={loading}
      onAddNew={can("delivery.create") ? handleAddNew : null}
      onEdit={can("delivery.update") ? handleEdit : null}
    />
  );
}

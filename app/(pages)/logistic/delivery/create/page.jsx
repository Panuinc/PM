"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import UIDeliveryForm from "@/components/logistic/delivery/UIDeliveryForm";
import { useSessionUser } from "@/hooks/useSessionUser";
import { useSubmitDelivery } from "@/app/api/logistic/delivery/hooks";
import { useFormHandler } from "@/hooks/useFormHandler";
import { useSePermission } from "@/hooks/useSePermission";

export default function DeliveryCreate() {
  const router = useRouter();
  const { can } = useSePermission();
  const { userId, userName } = useSessionUser();

  useEffect(() => {
    if (!can("delivery.create")) {
      router.replace("/forbidden");
    }
  }, [can]);

  const submitDelivery = useSubmitDelivery({
    mode: "create",
    currentDeliveryId: userId,
  });

  const formHandler = useFormHandler(
    {
      deliveryName: "",
    },
    submitDelivery
  );

  return (
    <UIDeliveryForm
      headerTopic="Delivery Create"
      formHandler={formHandler}
      mode="create"
      operatedBy={userName}
    />
  );
}

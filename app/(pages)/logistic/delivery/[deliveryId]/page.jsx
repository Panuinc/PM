"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import UIDeliveryForm from "@/components/logistic/delivery/UIDeliveryForm";
import UILoading from "@/components/UILoading";
import { useSessionUser } from "@/hooks/useSessionUser";
import {
  useDelivery,
  useSubmitDelivery,
} from "@/app/api/logistic/delivery/hooks";
import { useFormHandler } from "@/hooks/useFormHandler";
import { useSePermission } from "@/hooks/useSePermission";

export default function DeliveryUpdate() {
  const router = useRouter();
  const { can } = useSePermission();

  const { deliveryId } = useParams();
  const { userId: sessionUserId, userName } = useSessionUser();

  const { delivery, loading: deliveryLoading } =
    useDelivery(deliveryId);

  useEffect(() => {
    if (!can("delivery.update")) {
      router.replace("/forbidden");
    }
  }, [can]);

  const submitDelivery = useSubmitDelivery({
    mode: "update",
    deliveryId,
    currentDeliveryId: sessionUserId,
  });

  const formHandler = useFormHandler(
    {
      deliveryInvoiceNumber: "",
      deliveryLocation: "",
      deliveryPicture: "",
      deliveryFile: null,
      deliveryStatus: "",
      deliveryReturns: [],
    },
    submitDelivery
  );

  useEffect(() => {
    if (delivery) {
      formHandler.setFormData({
        deliveryInvoiceNumber: delivery.deliveryInvoiceNumber || "",
        deliveryLocation: delivery.deliveryLocation || "",
        deliveryPicture: delivery.deliveryPicture || "",
        deliveryFile: null,
        deliveryStatus: delivery.deliveryStatus || "",
        deliveryReturns: delivery.deliveryReturns || [],
      });
    }
  }, [delivery]);

  if (deliveryLoading) return <UILoading />;

  return (
    <UIDeliveryForm
      headerTopic="Delivery Update"
      formHandler={formHandler}
      mode="update"
      operatedBy={userName}
      isUpdate
    />
  );
}

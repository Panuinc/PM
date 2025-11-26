"use client";

import { useState, useEffect, useCallback } from "react";
import { showToast } from "@/components/UIToast";
import { useRouter } from "next/navigation";

function formatDeliveryFromApi(delivery, index) {
  if (!delivery) return null;

  const fullName = `${delivery.userFirstName ?? ""} ${
    delivery.userLastName ?? ""
  }`.trim();

  return {
    ...delivery,
    deliveryIndex: index != null ? index + 1 : undefined,
    deliveryFullName: fullName || "-",
    deliveryStatus: delivery.deliveryStatus || "-",
    deliveryCreatedBy: delivery.createdByUser
      ? `${delivery.createdByUser.userFirstName} ${delivery.createdByUser.userLastName}`
      : "-",
    deliveryUpdatedBy: delivery.updatedByUser
      ? `${delivery.updatedByUser.userFirstName} ${delivery.updatedByUser.userLastName}`
      : "-",
  };
}

export function useDeliverys(apiUrl = "/api/setting/delivery") {
  const [deliverys, setDeliverys] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const res = await fetch(apiUrl, {
          credentials: "include",
        });

        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
          throw new Error(data.error || "Failed to load deliverys.");
        }

        if (!active) return;

        const formatted = Array.isArray(data.deliverys)
          ? data.deliverys.map((u, i) => formatDeliveryFromApi(u, i)).filter(Boolean)
          : [];

        setDeliverys(formatted);
      } catch (err) {
        if (!active) return;
        showToast("danger", "Error: " + (err?.message || "Unknown error"));
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [apiUrl]);

  return { deliverys, loading };
}

export function useDelivery(deliveryId) {
  const [delivery, setDelivery] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!deliveryId) {
      setLoading(false);
      return;
    }

    let active = true;
    setLoading(true);

    (async () => {
      try {
        const res = await fetch(`/api/setting/delivery/${deliveryId}`, {
          credentials: "include",
        });

        const result = await res.json().catch(() => ({}));

        if (!res.ok) {
          throw new Error(result.error || "Failed to load Delivery.");
        }

        if (!active) return;

        const raw = result.delivery;

        if (!raw) {
          showToast("warning", "No Delivery data found.");
          return;
        }

        const formatted = formatDeliveryFromApi(raw, null);
        setDelivery(formatted);
      } catch (err) {
        if (!active) return;
        showToast("danger", "Error: " + (err?.message || "Unknown error"));
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [deliveryId]);

  return { delivery, loading };
}

export function useSubmitDelivery({ mode = "create", deliveryId, currentDeliveryId }) {
  const router = useRouter();

  return useCallback(
    async (formRef, formData, setErrors) => {
      const byField = mode === "create" ? "deliveryCreatedBy" : "deliveryUpdatedBy";

      const payload = {
        ...formData,
        [byField]: currentDeliveryId,
      };

      const url =
        mode === "create" ? "/api/setting/delivery" : `/api/setting/delivery/${deliveryId}`;

      const method = mode === "create" ? "POST" : "PUT";

      try {
        const res = await fetch(url, {
          method,
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(payload),
        });

        const result = await res.json().catch(() => ({}));

        if (res.ok) {
          showToast("success", result.message || "Success");
          setTimeout(() => router.push("/setting/delivery"), 1500);
        } else {
          if (result.details && typeof result.details === "object") {
            setErrors(result.details);
          } else {
            setErrors({});
          }

          showToast("danger", result.error || "Failed to submit Delivery.");
        }
      } catch (err) {
        showToast(
          "danger",
          `Failed to submit Delivery: ${err?.message || "Unknown error"}`
        );
      }
    },
    [mode, deliveryId, currentDeliveryId, router]
  );
}

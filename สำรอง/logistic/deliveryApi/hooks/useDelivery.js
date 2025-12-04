"use client";

import { useState, useEffect, useCallback } from "react";
import { showToast } from "@/components/UIToast";
import { useRouter } from "next/navigation";

function formatDeliveryFromApi(delivery, index) {
  if (!delivery) return null;

  const photos = Array.isArray(delivery.deliveryPhotos)
    ? delivery.deliveryPhotos
    : [];

  return {
    ...delivery,
    deliveryIndex: index != null ? index + 1 : undefined,
    deliveryCreatedBy: delivery.createdByUser
      ? `${delivery.createdByUser.userFirstName} ${delivery.createdByUser.userLastName}`
      : "-",
    deliveryUpdatedBy: delivery.updatedByUser
      ? `${delivery.updatedByUser.userFirstName} ${delivery.updatedByUser.userLastName}`
      : "-",
  };
}

export function useDeliverys(apiUrl = "/api/logistic/delivery") {
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
          ? data.deliverys
              .map((u, i) => formatDeliveryFromApi(u, i))
              .filter(Boolean)
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
        const res = await fetch(`/api/logistic/delivery/${deliveryId}`, {
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

        setDelivery(formatDeliveryFromApi(raw, null));
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

export function useSubmitDelivery({
  mode = "create",
  deliveryId,
  currentDeliveryId,
}) {
  const router = useRouter();

  return useCallback(
    async (formRef, formData, setErrors) => {
      const byField =
        mode === "create" ? "deliveryCreatedBy" : "deliveryUpdatedBy";
      const url =
        mode === "create"
          ? "/api/logistic/delivery"
          : `/api/logistic/delivery/${deliveryId}`;
      const method = mode === "create" ? "POST" : "PUT";

      try {
        const hasInvoiceFile = !!formData?.deliveryFile;
        const hasProductFiles =
          Array.isArray(formData?.deliveryProductFiles) &&
          formData.deliveryProductFiles.length > 0;

        if (hasInvoiceFile || hasProductFiles) {
          const fd = new FormData();

          fd.append(
            "deliveryInvoiceNumber",
            formData.deliveryInvoiceNumber || ""
          );
          fd.append("deliveryCompanyName", formData.deliveryCompanyName || "");
          fd.append("deliveryLocation", formData.deliveryLocation || "");

          if (mode === "update")
            fd.append("deliveryStatus", formData.deliveryStatus || "");

          fd.append(byField, currentDeliveryId || "");

          if (hasInvoiceFile) fd.append("file", formData.deliveryFile);

          if (formData.deliveryPicture)
            fd.append("deliveryPicture", formData.deliveryPicture);

          for (const f of formData.deliveryProductFiles || []) {
            if (f) fd.append("productFiles", f);
          }

          if (mode === "update") {
            const ids = Array.isArray(formData.deliveryDeletePhotoIds)
              ? formData.deliveryDeletePhotoIds
              : [];
            fd.append("deliveryDeletePhotoIds", JSON.stringify(ids));
          }

          const res = await fetch(url, {
            method,
            credentials: "include",
            body: fd,
          });
          const result = await res.json().catch(() => ({}));

          if (res.ok) {
            showToast("success", result.message || "Success");
            setTimeout(() => router.push("/logistic/delivery"), 1500);
          } else {
            setErrors(
              result.details && typeof result.details === "object"
                ? result.details
                : {}
            );
            showToast("danger", result.error || "Failed to submit Delivery.");
          }
          return;
        }

        const payload = { ...formData, [byField]: currentDeliveryId };

        const res = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(payload),
        });

        const result = await res.json().catch(() => ({}));

        if (res.ok) {
          showToast("success", result.message || "Success");
          setTimeout(() => router.push("/logistic/delivery"), 1500);
        } else {
          setErrors(
            result.details && typeof result.details === "object"
              ? result.details
              : {}
          );
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

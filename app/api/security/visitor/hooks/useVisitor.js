"use client";

import { useState, useEffect, useCallback } from "react";
import { showToast } from "@/components/UIToast";
import { useRouter } from "next/navigation";

function formatVisitorFromApi(visitor, index) {
  if (!visitor) return null;

  let documentPhotos = [];
  try {
    if (visitor.visitorDocumentPhotos) {
      documentPhotos = JSON.parse(visitor.visitorDocumentPhotos);
    }
  } catch {
    documentPhotos = [];
  }

  return {
    ...visitor,
    visitorIndex: index != null ? index + 1 : undefined,
    visitorFullName: `${visitor.visitorFirstName} ${visitor.visitorLastName}`,
    visitorDocumentPhotosArray: documentPhotos,
    visitorContactUserName: visitor.contactUser
      ? `${visitor.contactUser.userFirstName} ${visitor.contactUser.userLastName}`
      : "-",
    visitorCreatedByName: visitor.createdByUser
      ? `${visitor.createdByUser.userFirstName} ${visitor.createdByUser.userLastName}`
      : "-",
    visitorUpdatedByName: visitor.updatedByUser
      ? `${visitor.updatedByUser.userFirstName} ${visitor.updatedByUser.userLastName}`
      : "-",
  };
}

export function useVisitors(apiUrl = "/api/security/visitor") {
  const [visitors, setVisitors] = useState([]);
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
          throw new Error(data.error || "Failed to load visitors.");
        }

        if (!active) return;

        const formatted = Array.isArray(data.visitors)
          ? data.visitors
              .map((u, i) => formatVisitorFromApi(u, i))
              .filter(Boolean)
          : [];

        setVisitors(formatted);
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

  return { visitors, loading };
}

export function useVisitor(visitorId) {
  const [visitor, setVisitor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!visitorId) {
      setLoading(false);
      return;
    }

    let active = true;
    setLoading(true);

    (async () => {
      try {
        const res = await fetch(`/api/security/visitor/${visitorId}`, {
          credentials: "include",
        });

        const result = await res.json().catch(() => ({}));

        if (!res.ok) {
          throw new Error(result.error || "Failed to load Visitor.");
        }

        if (!active) return;

        const raw = result.visitor;

        if (!raw) {
          showToast("warning", "No Visitor data found.");
          return;
        }

        const formatted = formatVisitorFromApi(raw, null);
        setVisitor(formatted);
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
  }, [visitorId]);

  return { visitor, loading };
}

export function useSubmitVisitor({
  mode = "create",
  visitorId,
  currentUserId,
}) {
  const router = useRouter();

  return useCallback(
    async (formRef, formData, setErrors) => {
      const byField =
        mode === "create" ? "visitorCreatedBy" : "visitorUpdatedBy";

      const url =
        mode === "create"
          ? "/api/security/visitor"
          : `/api/security/visitor/${visitorId}`;

      const method = mode === "create" ? "POST" : "PUT";

      try {
        const hasVisitorPhotoFile = !!formData?.visitorPhotoFile;
        const hasDocumentFiles =
          Array.isArray(formData?.visitorDocumentFiles) &&
          formData.visitorDocumentFiles.length > 0;

        if (hasVisitorPhotoFile || hasDocumentFiles) {
          const fd = new FormData();

          fd.append("visitorFirstName", formData.visitorFirstName || "");
          fd.append("visitorLastName", formData.visitorLastName || "");
          fd.append("visitorCompany", formData.visitorCompany || "");
          fd.append(
            "visitorCarRegistration",
            formData.visitorCarRegistration || ""
          );
          fd.append("visitorProvince", formData.visitorProvince || "");
          fd.append(
            "visitorContactUserId",
            formData.visitorContactUserId || ""
          );
          fd.append(
            "visitorContactReason",
            formData.visitorContactReason || ""
          );

          if (mode === "update") {
            fd.append("visitorStatus", formData.visitorStatus || "");
          }

          fd.append(byField, currentUserId || "");

          if (hasVisitorPhotoFile) {
            fd.append("visitorPhotoFile", formData.visitorPhotoFile);
          }

          if (formData.visitorPhoto) {
            fd.append("visitorPhoto", formData.visitorPhoto);
          }

          for (const f of formData.visitorDocumentFiles || []) {
            if (f) fd.append("visitorDocumentFiles", f);
          }

          if (formData.visitorDocumentPhotos) {
            fd.append("visitorDocumentPhotos", formData.visitorDocumentPhotos);
          }

          const res = await fetch(url, {
            method,
            credentials: "include",
            body: fd,
          });

          const result = await res.json().catch(() => ({}));

          if (res.ok) {
            showToast("success", result.message || "Success");
            setTimeout(() => router.push("/security/visitor"), 1500);
          } else {
            setErrors(
              result.details && typeof result.details === "object"
                ? result.details
                : {}
            );
            showToast("danger", result.error || "Failed to submit Visitor.");
          }
          return;
        }

        const payload = {
          ...formData,
          [byField]: currentUserId,
        };

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
          setTimeout(() => router.push("/security/visitor"), 1500);
        } else {
          if (result.details && typeof result.details === "object") {
            setErrors(result.details);
          } else {
            setErrors({});
          }

          showToast("danger", result.error || "Failed to submit Visitor.");
        }
      } catch (err) {
        showToast(
          "danger",
          `Failed to submit Visitor: ${err?.message || "Unknown error"}`
        );
      }
    },
    [mode, visitorId, currentUserId, router]
  );
}

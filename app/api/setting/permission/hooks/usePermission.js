"use client";

import { useState, useEffect, useCallback } from "react";
import { showToast } from "@/components/UIToast";
import { useRouter } from "next/navigation";

function formatPermissionFromApi(permission, index) {
  if (!permission) return null;

  return {
    ...permission,
    permissionIndex: index != null ? index + 1 : undefined,
    permissionCreatedBy: permission.createdByUser
      ? `${permission.createdByUser.userFirstName} ${permission.createdByUser.userLastName}`
      : "-",
    permissionUpdatedBy: permission.updatedByUser
      ? `${permission.updatedByUser.userFirstName} ${permission.updatedByUser.userLastName}`
      : "-",
  };
}

export function usePermissions(apiUrl = "/api/setting/permission") {
  const [permissions, setPermissions] = useState([]);
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
          throw new Error(data.error || "Failed to load permissions.");
        }

        if (!active) return;

        const formatted = Array.isArray(data.permissions)
          ? data.permissions.map((u, i) => formatPermissionFromApi(u, i)).filter(Boolean)
          : [];

        setPermissions(formatted);
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

  return { permissions, loading };
}

export function usePermission(permissionId) {
  const [permission, setPermission] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!permissionId) {
      setLoading(false);
      return;
    }

    let active = true;
    setLoading(true);

    (async () => {
      try {
        const res = await fetch(`/api/setting/permission/${permissionId}`, {
          credentials: "include",
        });

        const result = await res.json().catch(() => ({}));

        if (!res.ok) {
          throw new Error(result.error || "Failed to load Permission.");
        }

        if (!active) return;

        const raw = result.permission;

        if (!raw) {
          showToast("warning", "No Permission data found.");
          return;
        }

        const formatted = formatPermissionFromApi(raw, null);
        setPermission(formatted);
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
  }, [permissionId]);

  return { permission, loading };
}

export function useSubmitPermission({ mode = "create", permissionId, currentPermissionId }) {
  const router = useRouter();

  return useCallback(
    async (formRef, formData, setErrors) => {
      const byField = mode === "create" ? "permissionCreatedBy" : "permissionUpdatedBy";

      const payload = {
        ...formData,
        [byField]: currentPermissionId,
      };

      const url =
        mode === "create" ? "/api/setting/permission" : `/api/setting/permission/${permissionId}`;

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
          setTimeout(() => router.push("/setting/permission"), 1500);
        } else {
          if (result.details && typeof result.details === "object") {
            setErrors(result.details);
          } else {
            setErrors({});
          }

          showToast("danger", result.error || "Failed to submit Permission.");
        }
      } catch (err) {
        showToast(
          "danger",
          `Failed to submit Permission: ${err?.message || "Unknown error"}`
        );
      }
    },
    [mode, permissionId, currentPermissionId, router]
  );
}

"use client";

import { useState, useEffect, useCallback } from "react";
import { showToast } from "@/components/UIToast";
import { useRouter } from "next/navigation";

function formatUserPermissionFromApi(userPermission, index) {
  if (!userPermission) return null;

  const fullName = userPermission.user
    ? `${userPermission.user.userFirstName ?? ""} ${
        userPermission.user.userLastName ?? ""
      }`.trim()
    : "-";

  return {
    ...userPermission,
    userPermissionIndex: index != null ? index + 1 : undefined,
    userPermissionFullName: fullName || "-",
    permissionName: userPermission.permission?.permissionName || "-",
    userPermissionCreatedBy: userPermission.createdByUser
      ? `${userPermission.createdByUser.userFirstName} ${userPermission.createdByUser.userLastName}`
      : "-",
    userPermissionUpdatedBy: userPermission.updatedByUser
      ? `${userPermission.updatedByUser.userFirstName} ${userPermission.updatedByUser.userLastName}`
      : "-",
  };
}

export function useUserPermissions(apiUrl = "/api/setting/userPermission") {
  const [userPermissions, setUserPermissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const res = await fetch(apiUrl, { credentials: "include" });
        const data = await res.json();

        if (!res.ok)
          throw new Error(data.error || "Failed to load userPermissions.");

        const formatted = Array.isArray(data.userPermissions)
          ? data.userPermissions.map((u, i) =>
              formatUserPermissionFromApi(u, i)
            )
          : [];

        if (active) setUserPermissions(formatted);
      } catch (err) {
        if (active)
          showToast("danger", "Error: " + (err?.message || "Unknown error"));
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [apiUrl]);

  return { userPermissions, loading };
}

export function useUserPermission(userPermissionId) {
  const [userPermission, setUserPermission] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userPermissionId) {
      setLoading(false);
      return;
    }

    let active = true;

    (async () => {
      try {
        const res = await fetch(
          `/api/setting/userPermission/${userPermissionId}`,
          {
            credentials: "include",
          }
        );

        const result = await res.json();

        if (!res.ok)
          throw new Error(result.error || "Failed to load UserPermission.");

        const formatted = formatUserPermissionFromApi(
          result.userPermission,
          null
        );
        if (active) setUserPermission(formatted);
      } catch (err) {
        if (active)
          showToast("danger", "Error: " + (err?.message || "Unknown error"));
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [userPermissionId]);

  return { userPermission, loading };
}

export function useSubmitUserPermission({
  mode = "create",
  userPermissionId,
  currentUserPermissionId,
}) {
  const router = useRouter();

  return useCallback(
    async (formRef, formData, setErrors) => {
      const byField =
        mode === "create"
          ? "userPermissionCreatedBy"
          : "userPermissionUpdatedBy";

      const payload = {
        ...formData,
        userPermissionPermissionId: formData.userPermissionPermissionId,
        [byField]: currentUserPermissionId,
      };

      const url =
        mode === "create"
          ? "/api/setting/userPermission"
          : `/api/setting/userPermission/${userPermissionId}`;
      const method = mode === "create" ? "POST" : "PUT";

      try {
        const res = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(payload),
        });

        const result = await res.json();

        if (res.ok) {
          showToast("success", result.message || "Success");
          setTimeout(() => router.push("/setting/userPermission"), 1500);
        } else {
          if (result.details && typeof result.details === "object") {
            setErrors(result.details);
          } else {
            setErrors({});
          }

          showToast(
            "danger",
            result.error || "Failed to submit UserPermission."
          );
        }
      } catch (err) {
        showToast(
          "danger",
          `Failed to submit UserPermission: ${err?.message || "Unknown error"}`
        );
      }
    },
    [mode, userPermissionId, currentUserPermissionId, router]
  );
}

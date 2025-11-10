"use client";
import { useState, useEffect, useCallback } from "react";
import { showToast } from "@/components/UIToast";
import { useRouter } from "next/navigation";

export function useUserPermissions(apiUrl = "/api/setting/userPermission") {
  const [userPermissions, setUserPermissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const res = await fetch(apiUrl, {
          headers: {
            "x-api-key": process.env.NEXT_PUBLIC_SECRET_TOKEN || "",
          },
        });
        const data = await res.json();
        if (!res.ok)
          throw new Error(data.error || "Failed to load userPermissions.");

        if (active) {
          const formatted = Array.isArray(data.userPermissions)
            ? data.userPermissions.map((userPermission, index) => ({
                ...userPermission,
                userPermissionIndex: index + 1,
                userPermissionCreatedBy: userPermission.createdByUser
                  ? `${userPermission.createdByUser.userFirstName} ${userPermission.createdByUser.userLastName}`
                  : "-",
                userPermissionUpdatedBy: userPermission.updatedByUser
                  ? `${userPermission.updatedByUser.userFirstName} ${userPermission.updatedByUser.userLastName}`
                  : "-",
              }))
            : [];
          setUserPermissions(formatted);
        }
      } catch (err) {
        showToast("danger", "Error: " + err.message);
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
    setLoading(true);

    (async () => {
      try {
        const res = await fetch(`/api/setting/userPermission/${userPermissionId}`, {
          headers: {
            "x-api-key": process.env.NEXT_PUBLIC_SECRET_TOKEN || "",
          },
        });
        const result = await res.json();
        if (!res.ok)
          throw new Error(result.error || "Failed to load UserPermission.");

        if (active) {
          const userPermission =
            result.userPermission ||
            (Array.isArray(result.userPermissions) ? result.userPermissions[0] : null);

          if (userPermission) {
            const formatted = {
              ...userPermission,
              userPermissionCreatedBy: userPermission.createdByUser
                ? `${userPermission.createdByUser.userFirstName} ${userPermission.createdByUser.userLastName}`
                : "-",
              userPermissionUpdatedBy: userPermission.updatedByUser
                ? `${userPermission.updatedByUser.userFirstName} ${userPermission.updatedByUser.userLastName}`
                : "-",
            };
            setUserPermission(formatted);
          } else showToast("warning", "No UserPermission data found.");
        }
      } catch (err) {
        showToast("danger", "Error: " + err.message);
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

export function useSubmitUserPermission({ mode = "create", userPermissionId, userId }) {
  const router = useRouter();

  return useCallback(
    async (formRef, formData, setErrors) => {
      const byField =
        mode === "create" ? "userPermissionCreatedBy" : "userPermissionUpdatedBy";

      const payload = { ...formData, [byField]: userId };
      const url =
        mode === "create"
          ? "/api/setting/userPermission"
          : `/api/setting/userPermission/${userPermissionId}`;
      const method = mode === "create" ? "POST" : "PUT";

      try {
        const res = await fetch(url, {
          method,
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.NEXT_PUBLIC_SECRET_TOKEN || "",
          },
          body: JSON.stringify(payload),
        });

        const result = await res.json();
        if (res.ok) {
          showToast("success", result.message || "Success");
          setTimeout(() => router.push("/setting/userPermission"), 1500);
        } else {
          setErrors(result.details || {});
          showToast("danger", result.error || "Failed to submit UserPermission.");
        }
      } catch (err) {
        showToast("danger", `Failed to submit UserPermission: ${err.message}`);
      }
    },
    [mode, userPermissionId, userId, router]
  );
}

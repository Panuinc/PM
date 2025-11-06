"use client";
import { useState, useEffect, useCallback } from "react";
import { showToast } from "@/components/UIToast";
import { useRouter } from "next/navigation";

export function usePermissions(apiUrl = "/api/setting/permission") {
  const [permissions, setPermissions] = useState([]);
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
          throw new Error(data.error || "Failed to load permissions.");

        if (active) {
          const formatted = Array.isArray(data.permissions)
            ? data.permissions.map((d, index) => ({
                ...d,
                permissionIndex: index + 1,
                permissionCreatedBy: d.createdByUser
                  ? `${d.createdByUser.userFirstName} ${d.createdByUser.userLastName}`
                  : "-",
                permissionUpdatedBy: d.updatedByUser
                  ? `${d.updatedByUser.userFirstName} ${d.updatedByUser.userLastName}`
                  : "-",
              }))
            : [];
          setPermissions(formatted);
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
          headers: {
            "x-api-key": process.env.NEXT_PUBLIC_SECRET_TOKEN || "",
          },
        });
        const result = await res.json();
        if (!res.ok)
          throw new Error(result.error || "Failed to load Permission.");

        if (active) {
          const dept =
            result.permission ||
            (Array.isArray(result.permissions) ? result.permissions[0] : null);

          if (dept) {
            const formatted = {
              ...dept,
              permissionCreatedBy: dept.createdByUser
                ? `${dept.createdByUser.userFirstName} ${dept.createdByUser.userLastName}`
                : "-",
              permissionUpdatedBy: dept.updatedByUser
                ? `${dept.updatedByUser.userFirstName} ${dept.updatedByUser.userLastName}`
                : "-",
            };
            setPermission(formatted);
          } else showToast("warning", "No Permission data found.");
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
  }, [permissionId]);

  return { permission, loading };
}

export function useSubmitPermission({ mode = "create", permissionId, userId }) {
  const router = useRouter();

  return useCallback(
    async (formRef, formData, setErrors) => {
      const byField =
        mode === "create" ? "permissionCreatedBy" : "permissionUpdatedBy";

      const payload = { ...formData, [byField]: userId };
      const url =
        mode === "create"
          ? "/api/setting/permission"
          : `/api/setting/permission/${permissionId}`;
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
          setTimeout(() => router.push("/setting/permission"), 1500);
        } else {
          setErrors(result.details || {});
          showToast("danger", result.error || "Failed to submit Permission.");
        }
      } catch (err) {
        showToast("danger", `Failed to submit Permission: ${err.message}`);
      }
    },
    [mode, permissionId, userId, router]
  );
}

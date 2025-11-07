"use client";
import { useState, useEffect, useCallback } from "react";
import { showToast } from "@/components/UIToast";
import { useRouter } from "next/navigation";

export function useRolePermissions(apiUrl = "/api/setting/rolePermission") {
  const [rolePermissions, setRolePermissions] = useState([]);
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
          throw new Error(data.error || "Failed to load rolePermissions.");

        if (active) {
          const formatted = Array.isArray(data.rolePermissions)
            ? data.rolePermissions.map((rolePermission, index) => ({
                ...rolePermission,
                rolePermissionIndex: index + 1,
                rolePermissionCreatedBy: rolePermission.createdByUser
                  ? `${rolePermission.createdByUser.userFirstName} ${rolePermission.createdByUser.userLastName}`
                  : "-",
                rolePermissionUpdatedBy: rolePermission.updatedByUser
                  ? `${rolePermission.updatedByUser.userFirstName} ${rolePermission.updatedByUser.userLastName}`
                  : "-",
              }))
            : [];
          setRolePermissions(formatted);
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

  return { rolePermissions, loading };
}

export function useRolePermission(rolePermissionId) {
  const [rolePermission, setRolePermission] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!rolePermissionId) {
      setLoading(false);
      return;
    }

    let active = true;
    setLoading(true);

    (async () => {
      try {
        const res = await fetch(`/api/setting/rolePermission/${rolePermissionId}`, {
          headers: {
            "x-api-key": process.env.NEXT_PUBLIC_SECRET_TOKEN || "",
          },
        });
        const result = await res.json();
        if (!res.ok)
          throw new Error(result.error || "Failed to load RolePermission.");

        if (active) {
          const rolePermission =
            result.rolePermission ||
            (Array.isArray(result.rolePermissions) ? result.rolePermissions[0] : null);

          if (rolePermission) {
            const formatted = {
              ...rolePermission,
              rolePermissionCreatedBy: rolePermission.createdByUser
                ? `${rolePermission.createdByUser.userFirstName} ${rolePermission.createdByUser.userLastName}`
                : "-",
              rolePermissionUpdatedBy: rolePermission.updatedByUser
                ? `${rolePermission.updatedByUser.userFirstName} ${rolePermission.updatedByUser.userLastName}`
                : "-",
            };
            setRolePermission(formatted);
          } else showToast("warning", "No RolePermission data found.");
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
  }, [rolePermissionId]);

  return { rolePermission, loading };
}

export function useSubmitRolePermission({ mode = "create", rolePermissionId, userId }) {
  const router = useRouter();

  return useCallback(
    async (formRef, formData, setErrors) => {
      const byField =
        mode === "create" ? "rolePermissionCreatedBy" : "rolePermissionUpdatedBy";

      const payload = { ...formData, [byField]: userId };
      const url =
        mode === "create"
          ? "/api/setting/rolePermission"
          : `/api/setting/rolePermission/${rolePermissionId}`;
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
          setTimeout(() => router.push("/setting/rolePermission"), 1500);
        } else {
          setErrors(result.details || {});
          showToast("danger", result.error || "Failed to submit RolePermission.");
        }
      } catch (err) {
        showToast("danger", `Failed to submit RolePermission: ${err.message}`);
      }
    },
    [mode, rolePermissionId, userId, router]
  );
}

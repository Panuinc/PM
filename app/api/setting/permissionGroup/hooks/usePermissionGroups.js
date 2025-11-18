"use client";
import { useState, useEffect, useCallback } from "react";
import { showToast } from "@/components/UIToast";
import { useRouter } from "next/navigation";

export function usePermissionGroups(apiUrl = "/api/setting/permissionGroup") {
  const [permissionGroups, setPermissionGroups] = useState([]);
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
          throw new Error(data.error || "Failed to load permissionGroups.");

        if (active) {
          const formatted = Array.isArray(data.permissionGroups)
            ? data.permissionGroups.map((permissionGroup, index) => ({
                ...permissionGroup,
                permissionGroupIndex: index + 1,
                permissionGroupCreatedBy: permissionGroup.createdByUser
                  ? `${permissionGroup.createdByUser.userFirstName} ${permissionGroup.createdByUser.userLastName}`
                  : "-",
                permissionGroupUpdatedBy: permissionGroup.updatedByUser
                  ? `${permissionGroup.updatedByUser.userFirstName} ${permissionGroup.updatedByUser.userLastName}`
                  : "-",
              }))
            : [];
          setPermissionGroups(formatted);
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

  return { permissionGroups, loading };
}

export function usePermissionGroup(permissionGroupId) {
  const [permissionGroup, setPermissionGroup] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!permissionGroupId) {
      setLoading(false);
      return;
    }

    let active = true;
    setLoading(true);

    (async () => {
      try {
        const res = await fetch(`/api/setting/permissionGroup/${permissionGroupId}`, {
          headers: {
            "x-api-key": process.env.NEXT_PUBLIC_SECRET_TOKEN || "",
          },
        });
        const result = await res.json();
        if (!res.ok)
          throw new Error(result.error || "Failed to load PermissionGroup.");

        if (active) {
          const permissionGroup =
            result.permissionGroup ||
            (Array.isArray(result.permissionGroups) ? result.permissionGroups[0] : null);

          if (permissionGroup) {
            const formatted = {
              ...permissionGroup,
              permissionGroupCreatedBy: permissionGroup.createdByUser
                ? `${permissionGroup.createdByUser.userFirstName} ${permissionGroup.createdByUser.userLastName}`
                : "-",
              permissionGroupUpdatedBy: permissionGroup.updatedByUser
                ? `${permissionGroup.updatedByUser.userFirstName} ${permissionGroup.updatedByUser.userLastName}`
                : "-",
            };
            setPermissionGroup(formatted);
          } else showToast("warning", "No PermissionGroup data found.");
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
  }, [permissionGroupId]);

  return { permissionGroup, loading };
}

export function useSubmitPermissionGroup({ mode = "create", permissionGroupId, userId }) {
  const router = useRouter();

  return useCallback(
    async (formRef, formData, setErrors) => {
      const byField =
        mode === "create" ? "permissionGroupCreatedBy" : "permissionGroupUpdatedBy";

      const payload = { ...formData, [byField]: userId };
      const url =
        mode === "create"
          ? "/api/setting/permissionGroup"
          : `/api/setting/permissionGroup/${permissionGroupId}`;
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
          setTimeout(() => router.push("/setting/permissionGroup"), 1500);
        } else {
          setErrors(result.details || {});
          showToast("danger", result.error || "Failed to submit PermissionGroup.");
        }
      } catch (err) {
        showToast("danger", `Failed to submit PermissionGroup: ${err.message}`);
      }
    },
    [mode, permissionGroupId, userId, router]
  );
}

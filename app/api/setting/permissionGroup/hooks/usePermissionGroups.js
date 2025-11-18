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

        if (!res.ok) throw new Error(data.error);

        if (active) {
          const formatted =
            data.permissionGroups?.map((item, index) => ({
              ...item,
              permissionGroupIndex: index + 1,
              permissionGroupCreatedBy: item.createdByUser
                ? `${item.createdByUser.userFirstName} ${item.createdByUser.userLastName}`
                : "-",
              permissionGroupUpdatedBy: item.updatedByUser
                ? `${item.updatedByUser.userFirstName} ${item.updatedByUser.userLastName}`
                : "-",
            })) ?? [];

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

export function usePermissionGroup(id) {
  const [permissionGroup, setPermissionGroup] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    let active = true;

    (async () => {
      try {
        const res = await fetch(`/api/setting/permissionGroup/${id}`, {
          headers: {
            "x-api-key": process.env.NEXT_PUBLIC_SECRET_TOKEN || "",
          },
        });

        const result = await res.json();

        if (!res.ok) throw new Error(result.error);

        if (active) {
          const pg = result.permissionGroup;

          setPermissionGroup({
            ...pg,
            permissionGroupCreatedBy: pg.createdByUser
              ? `${pg.createdByUser.userFirstName} ${pg.createdByUser.userLastName}`
              : "-",
            permissionGroupUpdatedBy: pg.updatedByUser
              ? `${pg.updatedByUser.userFirstName} ${pg.updatedByUser.userLastName}`
              : "-",
          });
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
  }, [id]);

  return { permissionGroup, loading };
}

export function useSubmitPermissionGroup({
  mode = "create",
  permissionGroupId,
  userId,
}) {
  const router = useRouter();

  return useCallback(
    async (formRef, formData, setErrors) => {
      const byField =
        mode === "create"
          ? "permissionGroupCreatedBy"
          : "permissionGroupUpdatedBy";

      const payload = {
        ...formData,
        permissionGroupOrder: Number(formData.permissionGroupOrder ?? 0),
        [byField]: userId,
      };

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
          showToast("danger", result.error);
        }
      } catch (err) {
        showToast("danger", "Failed to submit PermissionGroup: " + err.message);
      }
    },
    [mode, permissionGroupId, userId, router]
  );
}

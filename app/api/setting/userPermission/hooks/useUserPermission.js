"use client";

import { useState, useEffect, useCallback } from "react";
import { showToast } from "@/components/UIToast";
import { useRouter } from "next/navigation";

export function useUserPermissionsForUser(userId) {
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    let active = true;

    (async () => {
      try {
        const res = await fetch(`/api/setting/userPermission/user/${userId}`, {
          credentials: "include",
        });
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Failed");

        if (active) setPermissions(data.permissions || []);
      } catch (err) {
        if (active) showToast("danger", err.message || "Unknown error");
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [userId]);

  return { permissions, loading };
}

export function useSubmitUserPermissionsForUser({ userId, currentUserId }) {
  const router = useRouter();

  return useCallback(
    async (permissionIds) => {
      if (!userId) return showToast("danger", "Missing user");

      try {
        const res = await fetch(`/api/setting/userPermission/user/${userId}`, {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            permissionIds,
            userPermissionUpdatedBy: currentUserId,
          }),
        });

        const data = await res.json();

        if (res.ok) {
          showToast("success", "Updated");
          setTimeout(() => router.push("/setting/user"), 1200);
        } else {
          showToast("danger", data.error || "Failed");
        }
      } catch (err) {
        showToast("danger", err.message || "Unknown error");
      }
    },
    [userId, currentUserId, router]
  );
}

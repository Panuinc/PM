"use client";

import { useState, useEffect, useCallback } from "react";
import { showToast } from "@/components/UIToast";
import { useRouter } from "next/navigation";

function formatUserFromApi(user, index) {
  if (!user) return null;

  const fullName = `${user.userFirstName ?? ""} ${
    user.userLastName ?? ""
  }`.trim();

  return {
    ...user,
    userIndex: index != null ? index + 1 : undefined,
    userFullName: fullName || "-",
    userStatus: user.userStatus || "-",
    userCreatedBy: user.createdByUser
      ? `${user.createdByUser.userFirstName} ${user.createdByUser.userLastName}`
      : "-",
    userUpdatedBy: user.updatedByUser
      ? `${user.updatedByUser.userFirstName} ${user.updatedByUser.userLastName}`
      : "-",
  };
}

export function useUsers(apiUrl = "/api/setting/user") {
  const [users, setUsers] = useState([]);
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
          throw new Error(data.error || "Failed to load users.");
        }

        if (!active) return;

        const formatted = Array.isArray(data.users)
          ? data.users.map((u, i) => formatUserFromApi(u, i)).filter(Boolean)
          : [];

        setUsers(formatted);
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

  return { users, loading };
}

export function useUser(userId) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    let active = true;
    setLoading(true);

    (async () => {
      try {
        const res = await fetch(`/api/setting/user/${userId}`, {
          credentials: "include",
        });

        const result = await res.json().catch(() => ({}));

        if (!res.ok) {
          throw new Error(result.error || "Failed to load User.");
        }

        if (!active) return;

        const raw = result.user;

        if (!raw) {
          showToast("warning", "No User data found.");
          return;
        }

        const formatted = formatUserFromApi(raw, null);
        setUser(formatted);
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
  }, [userId]);

  return { user, loading };
}

export function useSubmitUser({ mode = "create", userId, currentUserId }) {
  const router = useRouter();

  return useCallback(
    async (formRef, formData, setErrors) => {
      const byField = mode === "create" ? "userCreatedBy" : "userUpdatedBy";

      const payload = {
        ...formData,
        [byField]: currentUserId,
      };

      const url =
        mode === "create" ? "/api/setting/user" : `/api/setting/user/${userId}`;

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
          setTimeout(() => router.push("/setting/user"), 1500);
        } else {
          if (result.details && typeof result.details === "object") {
            setErrors(result.details);
          } else {
            setErrors({});
          }

          showToast("danger", result.error || "Failed to submit User.");
        }
      } catch (err) {
        showToast(
          "danger",
          `Failed to submit User: ${err?.message || "Unknown error"}`
        );
      }
    },
    [mode, userId, currentUserId, router]
  );
}

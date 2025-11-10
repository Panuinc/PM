"use client";
import { useState, useEffect, useCallback } from "react";
import { showToast } from "@/components/UIToast";
import { useRouter } from "next/navigation";

export function useUserRoles(apiUrl = "/api/setting/userRole") {
  const [userRoles, setUserRoles] = useState([]);
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
          throw new Error(data.error || "Failed to load userRoles.");

        if (active) {
          const formatted = Array.isArray(data.userRoles)
            ? data.userRoles.map((userRole, index) => ({
                ...userRole,
                userRoleIndex: index + 1,
                userRoleCreatedBy: userRole.createdByUser
                  ? `${userRole.createdByUser.userFirstName} ${userRole.createdByUser.userLastName}`
                  : "-",
                userRoleUpdatedBy: userRole.updatedByUser
                  ? `${userRole.updatedByUser.userFirstName} ${userRole.updatedByUser.userLastName}`
                  : "-",
              }))
            : [];
          setUserRoles(formatted);
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

  return { userRoles, loading };
}

export function useUserRole(userRoleId) {
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userRoleId) {
      setLoading(false);
      return;
    }

    let active = true;
    setLoading(true);

    (async () => {
      try {
        const res = await fetch(`/api/setting/userRole/${userRoleId}`, {
          headers: {
            "x-api-key": process.env.NEXT_PUBLIC_SECRET_TOKEN || "",
          },
        });
        const result = await res.json();
        if (!res.ok)
          throw new Error(result.error || "Failed to load UserRole.");

        if (active) {
          const userRole =
            result.userRole ||
            (Array.isArray(result.userRoles) ? result.userRoles[0] : null);

          if (userRole) {
            const formatted = {
              ...userRole,
              userRoleCreatedBy: userRole.createdByUser
                ? `${userRole.createdByUser.userFirstName} ${userRole.createdByUser.userLastName}`
                : "-",
              userRoleUpdatedBy: userRole.updatedByUser
                ? `${userRole.updatedByUser.userFirstName} ${userRole.updatedByUser.userLastName}`
                : "-",
            };
            setUserRole(formatted);
          } else showToast("warning", "No UserRole data found.");
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
  }, [userRoleId]);

  return { userRole, loading };
}

export function useSubmitUserRole({ mode = "create", userRoleId, userId }) {
  const router = useRouter();

  return useCallback(
    async (formRef, formData, setErrors) => {
      const byField =
        mode === "create" ? "userRoleCreatedBy" : "userRoleUpdatedBy";

      const payload = { ...formData, [byField]: userId };
      const url =
        mode === "create"
          ? "/api/setting/userRole"
          : `/api/setting/userRole/${userRoleId}`;
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
          setTimeout(() => router.push("/setting/userRole"), 1500);
        } else {
          setErrors(result.details || {});
          showToast("danger", result.error || "Failed to submit UserRole.");
        }
      } catch (err) {
        showToast("danger", `Failed to submit UserRole: ${err.message}`);
      }
    },
    [mode, userRoleId, userId, router]
  );
}

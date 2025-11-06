"use client";
import { useState, useEffect, useCallback } from "react";
import { showToast } from "@/components/UIToast";
import { useRouter } from "next/navigation";

export function useRoles(apiUrl = "/api/setting/role") {
  const [roles, setRoles] = useState([]);
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
          throw new Error(data.error || "Failed to load roles.");

        if (active) {
          const formatted = Array.isArray(data.roles)
            ? data.roles.map((role, index) => ({
                ...role,
                roleIndex: index + 1,
                roleCreatedBy: role.createdByUser
                  ? `${role.createdByUser.userFirstName} ${role.createdByUser.userLastName}`
                  : "-",
                roleUpdatedBy: role.updatedByUser
                  ? `${role.updatedByUser.userFirstName} ${role.updatedByUser.userLastName}`
                  : "-",
              }))
            : [];
          setRoles(formatted);
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

  return { roles, loading };
}

export function useRole(roleId) {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!roleId) {
      setLoading(false);
      return;
    }

    let active = true;
    setLoading(true);

    (async () => {
      try {
        const res = await fetch(`/api/setting/role/${roleId}`, {
          headers: {
            "x-api-key": process.env.NEXT_PUBLIC_SECRET_TOKEN || "",
          },
        });
        const result = await res.json();
        if (!res.ok)
          throw new Error(result.error || "Failed to load Role.");

        if (active) {
          const role =
            result.role ||
            (Array.isArray(result.roles) ? result.roles[0] : null);

          if (role) {
            const formatted = {
              ...role,
              roleCreatedBy: role.createdByUser
                ? `${role.createdByUser.userFirstName} ${role.createdByUser.userLastName}`
                : "-",
              roleUpdatedBy: role.updatedByUser
                ? `${role.updatedByUser.userFirstName} ${role.updatedByUser.userLastName}`
                : "-",
            };
            setRole(formatted);
          } else showToast("warning", "No Role data found.");
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
  }, [roleId]);

  return { role, loading };
}

export function useSubmitRole({ mode = "create", roleId, userId }) {
  const router = useRouter();

  return useCallback(
    async (formRef, formData, setErrors) => {
      const byField =
        mode === "create" ? "roleCreatedBy" : "roleUpdatedBy";

      const payload = { ...formData, [byField]: userId };
      const url =
        mode === "create"
          ? "/api/setting/role"
          : `/api/setting/role/${roleId}`;
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
          setTimeout(() => router.push("/setting/role"), 1500);
        } else {
          setErrors(result.details || {});
          showToast("danger", result.error || "Failed to submit Role.");
        }
      } catch (err) {
        showToast("danger", `Failed to submit Role: ${err.message}`);
      }
    },
    [mode, roleId, userId, router]
  );
}

"use client";
import { useState, useEffect, useCallback } from "react";
import { showToast } from "@/components/UIToast";
import { useRouter } from "next/navigation";

export function useUsers(apiUrl = "/api/setting/user") {
  const [users, setUsers] = useState([]);
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

        if (!res.ok) throw new Error(data.error || "Failed to load users.");

        if (active) {
          const formatted = Array.isArray(data.users)
            ? data.users.map((u, index) => ({
                ...u,
                userIndex: index + 1,
                userFullName: `${u.userFirstName} ${u.userLastName}`,
                userDepartment: u.department
                  ? u.department.departmentName
                  : "-",
                userStatus: u.userStatus || "-",
                userCreatedBy: u.createdByUser
                  ? `${u.createdByUser.userFirstName} ${u.createdByUser.userLastName}`
                  : "-",
                userUpdatedBy: u.updatedByUser
                  ? `${u.updatedByUser.userFirstName} ${u.updatedByUser.userLastName}`
                  : "-",
              }))
            : [];

          setUsers(formatted);
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
          headers: {
            "x-api-key": process.env.NEXT_PUBLIC_SECRET_TOKEN || "",
          },
        });
        const result = await res.json();

        if (!res.ok) throw new Error(result.error || "Failed to load User.");

        if (active) {
          const u =
            result.user ||
            (Array.isArray(result.users) ? result.users[0] : null);

          if (u) {
            const formatted = {
              ...u,
              userFullName: `${u.userFirstName} ${u.userLastName}`,
              userDepartment: u.department ? u.department.departmentName : "-",
              userCreatedBy: u.createdByUser
                ? `${u.createdByUser.userFirstName} ${u.createdByUser.userLastName}`
                : "-",
              userUpdatedBy: u.updatedByUser
                ? `${u.updatedByUser.userFirstName} ${u.updatedByUser.userLastName}`
                : "-",
            };
            setUser(formatted);
          } else showToast("warning", "No User data found.");
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
            "x-api-key": process.env.NEXT_PUBLIC_SECRET_TOKEN || "",
          },
          body: JSON.stringify(payload),
        });

        const result = await res.json();
        if (res.ok) {
          showToast("success", result.message || "Success");
          setTimeout(() => router.push("/setting/user"), 1500);
        } else {
          setErrors(result.details || {});
          showToast("danger", result.error || "Failed to submit User.");
        }
      } catch (err) {
        showToast("danger", `Failed to submit User: ${err.message}`);
      }
    },
    [mode, userId, currentUserId, router]
  );
}

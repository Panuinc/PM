"use client";
import { useState, useEffect, useCallback } from "react";
import { showToast } from "@/components/UIToast";
import { useRouter } from "next/navigation";

export function useDepartments(apiUrl = "/api/setting/department") {
  const [departments, setDepartments] = useState([]);
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
          throw new Error(data.error || "Failed to load departments.");

        if (active) {
          const formatted = Array.isArray(data.departments)
            ? data.departments.map((department, index) => ({
                ...department,
                departmentIndex: index + 1,
                departmentCreatedBy: department.createdByUser
                  ? `${department.createdByUser.userFirstName} ${department.createdByUser.userLastName}`
                  : "-",
                departmentUpdatedBy: department.updatedByUser
                  ? `${department.updatedByUser.userFirstName} ${department.updatedByUser.userLastName}`
                  : "-",
              }))
            : [];
          setDepartments(formatted);
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

  return { departments, loading };
}

export function useDepartment(departmentId) {
  const [department, setDepartment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!departmentId) {
      setLoading(false);
      return;
    }

    let active = true;
    setLoading(true);

    (async () => {
      try {
        const res = await fetch(`/api/setting/department/${departmentId}`, {
          headers: {
            "x-api-key": process.env.NEXT_PUBLIC_SECRET_TOKEN || "",
          },
        });
        const result = await res.json();
        if (!res.ok)
          throw new Error(result.error || "Failed to load Department.");

        if (active) {
          const department =
            result.department ||
            (Array.isArray(result.departments) ? result.departments[0] : null);

          if (department) {
            const formatted = {
              ...department,
              departmentCreatedBy: department.createdByUser
                ? `${department.createdByUser.userFirstName} ${department.createdByUser.userLastName}`
                : "-",
              departmentUpdatedBy: department.updatedByUser
                ? `${department.updatedByUser.userFirstName} ${department.updatedByUser.userLastName}`
                : "-",
            };
            setDepartment(formatted);
          } else showToast("warning", "No Department data found.");
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
  }, [departmentId]);

  return { department, loading };
}

export function useSubmitDepartment({ mode = "create", departmentId, userId }) {
  const router = useRouter();

  return useCallback(
    async (formRef, formData, setErrors) => {
      const byField =
        mode === "create" ? "departmentCreatedBy" : "departmentUpdatedBy";

      const payload = { ...formData, [byField]: userId };
      const url =
        mode === "create"
          ? "/api/setting/department"
          : `/api/setting/department/${departmentId}`;
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
          setTimeout(() => router.push("/setting/department"), 1500);
        } else {
          setErrors(result.details || {});
          showToast("danger", result.error || "Failed to submit Department.");
        }
      } catch (err) {
        showToast("danger", `Failed to submit Department: ${err.message}`);
      }
    },
    [mode, departmentId, userId, router]
  );
}

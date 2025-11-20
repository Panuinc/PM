"use client";

import { useState, useEffect, useCallback } from "react";
import { showToast } from "@/components/UIToast";
import { useRouter } from "next/navigation";

function formatDepartmentFromApi(department, index) {
  if (!department) return null;

  const fullName = `${department.userFirstName ?? ""} ${
    department.userLastName ?? ""
  }`.trim();

  return {
    ...department,
    departmentIndex: index != null ? index + 1 : undefined,
    departmentFullName: fullName || "-",
    departmentStatus: department.departmentStatus || "-",
    departmentCreatedBy: department.createdByUser
      ? `${department.createdByUser.userFirstName} ${department.createdByUser.userLastName}`
      : "-",
    departmentUpdatedBy: department.updatedByUser
      ? `${department.updatedByUser.userFirstName} ${department.updatedByUser.userLastName}`
      : "-",
  };
}

export function useDepartments(apiUrl = "/api/setting/department") {
  const [departments, setDepartments] = useState([]);
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
          throw new Error(data.error || "Failed to load departments.");
        }

        if (!active) return;

        const formatted = Array.isArray(data.departments)
          ? data.departments.map((u, i) => formatDepartmentFromApi(u, i)).filter(Boolean)
          : [];

        setDepartments(formatted);
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
          credentials: "include",
        });

        const result = await res.json().catch(() => ({}));

        if (!res.ok) {
          throw new Error(result.error || "Failed to load Department.");
        }

        if (!active) return;

        const raw = result.department;

        if (!raw) {
          showToast("warning", "No Department data found.");
          return;
        }

        const formatted = formatDepartmentFromApi(raw, null);
        setDepartment(formatted);
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
  }, [departmentId]);

  return { department, loading };
}

export function useSubmitDepartment({ mode = "create", departmentId, currentDepartmentId }) {
  const router = useRouter();

  return useCallback(
    async (formRef, formData, setErrors) => {
      const byField = mode === "create" ? "departmentCreatedBy" : "departmentUpdatedBy";

      const payload = {
        ...formData,
        [byField]: currentDepartmentId,
      };

      const url =
        mode === "create" ? "/api/setting/department" : `/api/setting/department/${departmentId}`;

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
          setTimeout(() => router.push("/setting/department"), 1500);
        } else {
          if (result.details && typeof result.details === "object") {
            setErrors(result.details);
          } else {
            setErrors({});
          }

          showToast("danger", result.error || "Failed to submit Department.");
        }
      } catch (err) {
        showToast(
          "danger",
          `Failed to submit Department: ${err?.message || "Unknown error"}`
        );
      }
    },
    [mode, departmentId, currentDepartmentId, router]
  );
}

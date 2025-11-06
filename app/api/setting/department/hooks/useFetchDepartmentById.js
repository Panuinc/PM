"use client";
import { useEffect, useState } from "react";
import { showToast } from "@/components/UIToast";

export function useFetchDepartmentById(departmentId) {
  const [department, setDepartment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!departmentId) {
      setLoading(false);
      return;
    }

    let isActive = true;
    setLoading(true);

    (async () => {
      try {
        const res = await fetch(`/api/setting/department/${departmentId}`, {
          headers: {
            "x-api-key": process.env.NEXT_PUBLIC_SECRET_TOKEN || "",
          },
        });

        const result = await res.json();
        if (!res.ok) {
          throw new Error(result.error || "Failed to load Department.");
        }

        if (isActive) {
          const dept =
            result.department ||
            (Array.isArray(result.departments)
              ? result.departments[0]
              : null);

          if (dept) {
            const formatted = {
              ...dept,
              departmentCreatedBy: dept.createdByUser
                ? `${dept.createdByUser.userFirstName} ${dept.createdByUser.userLastName}`
                : "-",
              departmentUpdatedBy: dept.updatedByUser
                ? `${dept.updatedByUser.userFirstName} ${dept.updatedByUser.userLastName}`
                : "-",
            };
            setDepartment(formatted);
          } else {
            showToast("warning", "No Department data found.");
          }
        }
      } catch (err) {
        showToast("danger", "Error: " + err.message);
      } finally {
        if (isActive) setLoading(false);
      }
    })();

    return () => {
      isActive = false;
    };
  }, [departmentId]);

  return { department, loading };
}

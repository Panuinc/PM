"use client";
import { useEffect, useState } from "react";
import { showToast } from "@/components/UIToast";

export function useFetchDepartments(apiUrl = "/api/setting/department") {
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

        if (!res.ok) {
          throw new Error(data.error || "Failed to load departments.");
        }

        if (active) {
          const formatted = Array.isArray(data.departments)
            ? data.departments.map((d, index) => ({
                ...d,
                departmentId: index + 1,
                departmentCreatedBy: d.createdByUser
                  ? `${d.createdByUser.userFirstName} ${d.createdByUser.userLastName}`
                  : "-",
                departmentUpdatedBy: d.updatedByUser
                  ? `${d.updatedByUser.userFirstName} ${d.updatedByUser.userLastName}`
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

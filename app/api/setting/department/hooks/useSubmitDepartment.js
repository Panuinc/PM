import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { showToast } from "@/components/UIToast";
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

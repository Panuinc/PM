"use client";

import { useEffect, useState } from "react";
import { showToast } from "@/components/UIToast";

export function useUserPermissionMatrix() {
  const [data, setData] = useState({ permissions: [], matrix: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/setting/userPermissionMatrix", {
          headers: {
            "x-api-key": process.env.NEXT_PUBLIC_SECRET_TOKEN || "",
          },
        });
        const result = await res.json();
        if (res.ok) setData(result.data);
        else throw new Error(result.error);
      } catch (e) {
        showToast("danger", e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { data, setData, loading };
}

export async function saveUserPermissionMatrix(data, updaterId) {
  const res = await fetch("/api/setting/userPermissionMatrix", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.NEXT_PUBLIC_SECRET_TOKEN || "",
    },
    body: JSON.stringify({ matrix: data, updaterId }),
  });
  return res.json();
}

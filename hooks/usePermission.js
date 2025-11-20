"use client";

import { useSessionUser } from "@/hooks/useSessionUser";

export function usePermission() {
  const { permissions = [], isSuperAdmin } = useSessionUser();

  const can = (permName) => {
    if (isSuperAdmin) return true;
    if (!permName) return false;
    return permissions.includes(permName);
  };

  return { can };
}

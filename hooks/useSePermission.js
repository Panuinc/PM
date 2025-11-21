"use client";

import { useSessionUser } from "@/hooks/useSessionUser";

export function useSePermission () {
  const { permissions = [], isAdminSuperAdmin } = useSessionUser();

  const can = (permName) => {
    if (isAdminSuperAdmin) return true;
    if (!permName) return false;
    return permissions.includes(permName);
  };

  return { can };
}

"use client";
import { useSession } from "next-auth/react";

export function useSessionUser() {
  const { data: sessionData, status } = useSession();
  const user = sessionData?.user ?? {};

  const permissions = user.permissions ?? [];

  return {
    ...user,
    permissions,
    isLoading: status === "loading",
    session: sessionData,
    isSuperAdmin: permissions.includes("superadmin"),
  };
}

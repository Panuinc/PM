"use client";
import { useSession } from "next-auth/react";

export function useSessionUser() {
  const { data: sessionData, status } = useSession();
  const user = sessionData?.user ?? {};

  return {
    ...user,
    isLoading: status === "loading",
    session: sessionData,
  };
}

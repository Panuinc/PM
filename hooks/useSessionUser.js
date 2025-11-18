import { useSession } from "next-auth/react";

export function useSessionUser() {
  const { data: sessionData, status } = useSession();
  const user = sessionData?.user ?? {};

  const userId = user.id ?? "";
  const userName = `${user.userFirstName ?? ""} ${
    user.userLastName ?? ""
  }`.trim();
  const userEmail = user.email ?? "";
  const userStatus = user.status ?? "";

  return {
    userId,
    userName,
    userEmail,
    userStatus,
    isLoading: status === "loading",
    session: sessionData,
  };
}

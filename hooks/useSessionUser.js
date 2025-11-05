import { useSession } from "next-auth/react";

export function useSessionUser() {
  const { data: sessionData, status } = useSession();
  const user = sessionData?.user ?? {};

  const userId = user.id || "";
  const userName = `${user.userFirstName ?? ""} ${
    user.userLastName ?? ""
  }`.trim();
  const userEmail = user.email || "";
  const userStatus = user.status || "";
  const department = user.department || null;
  const roles = user.roles || [];

  const permissions =
    roles.flatMap((r) => r.permissions.map((p) => p.key)) || [];

  return {
    userId,
    userName,
    userEmail,
    userStatus,
    department,
    roles,
    permissions,
    session: sessionData,
    isLoading: status === "loading",
  };
}

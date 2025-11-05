import { useSession } from "next-auth/react";

export function useSessionUser() {
  const { data: sessionData } = useSession();
  const user = sessionData?.user ?? {};
  const userId = user.id || "";
  const userName = user.userFirstName + " " + user.userLastName || "";

  return { userId, userName, session: sessionData };
}

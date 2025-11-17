import { useSession } from "next-auth/react";
import { getUserPermissions, hasPermission, hasAnyPermission, hasAllPermissions } from "@/lib/permissions";

export function usePermissions() {
  const { data: session } = useSession();

  return {
    permissions: getUserPermissions(session),
    hasPermission: (key) => hasPermission(session, key),
    hasAnyPermission: (keys) => hasAnyPermission(session, keys),
    hasAllPermissions: (keys) => hasAllPermissions(session, keys),
    canView: (resource) => hasPermission(session, `${resource}.view`),
    canCreate: (resource) => hasPermission(session, `${resource}.create`),
    canUpdate: (resource) => hasPermission(session, `${resource}.update`),
    canDelete: (resource) => hasPermission(session, `${resource}.delete`),
  };
}
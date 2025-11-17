export function getUserPermissions(session) {
  if (!session?.user) return [];

  const rolePermissions =
    session.user.roles?.flatMap((role) =>
      role.permissions?.filter((p) => p.status === "Enable").map((p) => p.key)
    ) || [];

  const directPermissions =
    session.user.permissions
      ?.filter((p) => p.status === "Enable")
      .map((p) => p.key) || [];

  return [...new Set([...rolePermissions, ...directPermissions])];
}

export function hasPermission(session, permissionKey) {
  const permissions = getUserPermissions(session);
  return permissions.includes(permissionKey);
}

export function hasAnyPermission(session, permissionKeys) {
  const permissions = getUserPermissions(session);
  return permissionKeys.some((key) => permissions.includes(key));
}

export function hasAllPermissions(session, permissionKeys) {
  const permissions = getUserPermissions(session);
  return permissionKeys.every((key) => permissions.includes(key));
}

export function getAuthorizedMenus(session, menuData) {
  const permissions = getUserPermissions(session);

  if (permissions.includes("superadmin")) {
    return menuData;
  }

  const authorized = {};

  for (const [key, menu] of Object.entries(menuData)) {
    if (
      !menu.requiredPermission ||
      permissions.includes(menu.requiredPermission)
    ) {
      const authorizedSubMenus = menu.subMenus.filter(
        (sub) =>
          !sub.requiredPermission ||
          permissions.includes(sub.requiredPermission)
      );

      if (authorizedSubMenus.length > 0) {
        authorized[key] = {
          ...menu,
          subMenus: authorizedSubMenus,
        };
      }
    }
  }

  return authorized;
}

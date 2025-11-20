export * from "./api";
export * from "./menu";

import { menuConfig } from "./menu";

export const uiMenuRules = Object.values(menuConfig)
  .flatMap((menu) => menu.subMenus)
  .reduce((acc, sub) => {
    if (Array.isArray(sub.requiredPermissions) && sub.requiredPermissions.length > 0) {
      acc[sub.path] = sub.requiredPermissions[0];
    }
    return acc;
  }, {});
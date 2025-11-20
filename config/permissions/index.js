export * from "./api";
export * from "./menu";

import { menuConfig } from "./menu";

export const uiMenuRules = Object.values(menuConfig)
  .flatMap((menu) => menu.subMenus)
  .reduce((acc, sub) => {
    acc[sub.path] = sub.requiredPermissions?.[0] ?? null;
    return acc;
  }, {});

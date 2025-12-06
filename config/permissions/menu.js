import { Forklift, LayoutDashboard, Settings, ShieldBan } from "lucide-react";

export const menuConfig = {
  dashboard: {
    icon: <LayoutDashboard />,
    label: "Dashboard",
    requiredPermissions: [],
    subMenus: [
      {
        text: "Home",
        path: "/home",
        requiredPermissions: [],
      },
    ],
  },

  setting: {
    icon: <Settings />,
    label: "Settings",
    requiredPermissions: ["menu.setting"],
    subMenus: [
      {
        text: "User",
        path: "/setting/user",
        requiredPermissions: ["user.read"],
      },
      {
        text: "Permission",
        path: "/setting/permission",
        requiredPermissions: ["permission.read"],
      },
      {
        text: "Department",
        path: "/setting/department",
        requiredPermissions: ["department.read"],
      },
    ],
  },
  logistic: {
    icon: <Forklift />,
    label: "Logistic",
    requiredPermissions: ["menu.logistic"],
    subMenus: [
      {
        text: "Delivery",
        path: "/logistic/delivery",
        requiredPermissions: ["delivery.read"],
      },
    ],
  },
  security: {
    icon: <ShieldBan />,
    label: "Security",
    requiredPermissions: ["menu.security"],
    subMenus: [
      {
        text: "Visitor",
        path: "/security/visitor",
        requiredPermissions: ["visitor.read"],
      },
    ],
  },
};

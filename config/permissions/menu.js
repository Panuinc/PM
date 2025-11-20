import { LayoutDashboard, Settings } from "lucide-react";

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
};

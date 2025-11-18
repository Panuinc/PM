/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { Avatar, Button, Tooltip } from "@heroui/react";
import {
  Bell,
  Cat,
  ChevronLeft,
  ChevronRight,
  Factory,
  Wrench,
  Key,
  LayoutDashboard,
  Menu,
  Settings,
  X,
} from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import { signOut, useSession } from "next-auth/react";
import UILoading from "@/components/UILoading";
import { getAuthorizedMenus } from "@/lib/permissions";
import { PERMISSIONS } from "@/constants/permissions";

function MainMenu({ icons, content, onClick, isActive, isMobile }) {
  const menuContent = (
    <div
      className={`flex items-center justify-center w-full aspect-square p-3 gap-2 cursor-pointer ${
        isActive
          ? "border-1 border-white text-white"
          : "hover:border-1 border-white text-white"
      }`}
      onClick={onClick}
    >
      {icons}
    </div>
  );

  if (isMobile) {
    return menuContent;
  }

  return (
    <Tooltip
      color="primary"
      content={content}
      placement="right"
      offset={15}
      className="px-4 py-2 font-semibold text-white"
    >
      {menuContent}
    </Tooltip>
  );
}

function SubMenu({ text, onClick, path }) {
  const pathname = usePathname();
  const isActive =
    pathname === path ||
    pathname.startsWith(path + "/") ||
    pathname.startsWith(path);

  return (
    <div
      className={`flex items-center justify-start w-full h-fit p-3 gap-2 cursor-pointer ${
        isActive ? "border-1 border-dark" : "hover:border-1 border-dark"
      }`}
      onClick={onClick}
    >
      {text}
    </div>
  );
}

export default function PagesLayout({ children }) {
  const { data: session, status } = useSession();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const allMenuData = useMemo(
    () => ({
      dashboard: {
        icon: <LayoutDashboard />,
        label: "Dashboard",
        subMenus: [
          {
            text: "Home",
            path: "/home",
          },
        ],
      },
      setting: {
        icon: <Settings />,
        label: "Settings",
        subMenus: [
          {
            text: "Role",
            path: "/setting/role",
            requiredPermission: PERMISSIONS.ROLE_VIEW,
          },
          {
            text: "Permission",
            path: "/setting/permission",
            requiredPermission: PERMISSIONS.PERMISSION_VIEW,
          },
          {
            text: "Role Permission",
            path: "/setting/rolePermission",
            requiredPermission: PERMISSIONS.ROLE_PERMISSION_VIEW,
          },
          {
            text: "User",
            path: "/setting/user",
            requiredPermission: PERMISSIONS.USER_VIEW,
          },
          {
            text: "User Role",
            path: "/setting/userRole",
            requiredPermission: PERMISSIONS.USER_ROLE_VIEW,
          },
          {
            text: "User Permission",
            path: "/setting/userPermission",
            requiredPermission: PERMISSIONS.USER_PERMISSION_VIEW,
          },
          {
            text: "Permission Group",
            path: "/setting/permissionGroup",
            requiredPermission: PERMISSIONS.PERMISSION_GROUP_VIEW,
          },
        ],
      },
    }),
    []
  );

  const menuData = useMemo(() => {
    if (!session) return {};
    return getAuthorizedMenus(session, allMenuData);
  }, [session, allMenuData]);

  useEffect(() => {
    const currentPath = pathname;

    for (const [menuKey, menuValue] of Object.entries(menuData)) {
      const hasMatchingPath = menuValue.subMenus.some(
        (subMenu) =>
          currentPath === subMenu.path || currentPath.startsWith(subMenu.path)
      );

      if (hasMatchingPath) {
        setSelectedMenu(menuKey);
        break;
      }
    }
  }, [pathname, menuData]);

  const handleMenuClick = (menuKey) => {
    if (isCollapsed) setIsCollapsed(false);
    setSelectedMenu(menuKey);
  };

  const handleSubMenuClick = (path) => {
    setIsMobileMenuOpen(false);
    router.push(path);
  };

  useEffect(() => {
    if (status === "unauthenticated") router.push("/");
  }, [status, router]);

  if (status === "loading" || !session) {
    return <UILoading />;
  }

  return (
    <div className="flex flex-col xl:flex-row items-center justify-center w-full h-full">
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 xl:hidden"
          onClick={toggleMobileMenu}
        />
      )}

      <div
        className={`fixed xl:relative inset-y-0 left-0 z-50 flex flex-row items-center justify-center ${
          isCollapsed ? "w-fit" : "w-[300px] xl:w-[500px]"
        } h-full bg-white transition-all duration-300 ${
          isMobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full xl:translate-x-0"
        }`}
      >
        <div className="flex flex-col items-center justify-between min-w-fit h-full p-2 gap-2 border-1 border-dark bg-dark overflow-auto">
          <div
            className="xl:hidden flex items-center justify-center w-full h-fit p-3 gap-2 cursor-pointer text-white hover:text-dark hover:bg-white"
            onClick={toggleMobileMenu}
          >
            <X />
          </div>

          <div className="flex items-center justify-center w-full h-fit p-3 gap-2 border-b-2 border-default text-white">
            <Cat />
          </div>

          <div className="flex flex-col items-center justify-start w-full h-full gap-2">
            {Object.entries(menuData).map(([key, data]) => (
              <MainMenu
                key={key}
                content={data.label}
                icons={data.icon}
                onClick={() => handleMenuClick(key)}
                isActive={selectedMenu === key}
                isMobile={isMobileMenuOpen}
              />
            ))}
          </div>

          <div
            className="flex items-center justify-center w-full h-fit p-3 gap-2 border-t-2 border-default cursor-pointer text-white"
            onClick={toggleSidebar}
          >
            {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
          </div>
        </div>

        {!isCollapsed && (
          <div className="flex flex-col items-center justify-start w-full h-full py-2 gap-2 border-1 border-dark overflow-auto">
            <div className="flex items-center justify-start w-full h-fit p-3 gap-2 border-b-2 border-dark">
              <Factory /> {menuData[selectedMenu]?.label || "Menu"}
            </div>
            <div className="flex flex-col items-center justify-start w-full h-full p-2 gap-2 overflow-auto">
              {menuData[selectedMenu]?.subMenus.map((subMenu, index) => (
                <SubMenu
                  key={index}
                  text={subMenu.text}
                  path={subMenu.path}
                  onClick={() => handleSubMenuClick(subMenu.path)}
                />
              ))}
            </div>
            <div className="xl:flex hidden items-center justify-center w-fit h-fit p-2 gap-2">
              <Image
                src="/images/images.png"
                alt="pic"
                width={125}
                height={125}
                className="object-cover"
              />
            </div>
            <div
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex items-center justify-start w-full h-fit p-3 gap-2 border-t-2 border-dark cursor-pointer"
            >
              <Key className="hover:scale-150" /> Logout
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col items-stretch justify-start w-full h-screen overflow-hidden">
        <div className="flex flex-row items-center justify-between w-full h-fit p-1 gap-2 border-1 border-dark">
          <button
            className="flex xl:hidden items-center justify-center aspect-square h-full p-2 gap-2 cursor-pointer"
            onClick={toggleMobileMenu}
          >
            <Menu />
          </button>
          <div className="flex items-center justify-start w-full xl:w-fit h-full p-2 gap-2 whitespace-nowrap">
            CHH Industry
          </div>
          <div className="hidden xl:flex items-center justify-center w-full h-full p-2 gap-2">
            {" "}
          </div>
          <div className="flex items-center justify-center aspect-square h-full p-2 gap-2 hover:scale-105">
            <Bell />
          </div>
          <div className="flex items-center justify-center w-fit h-full p-2 gap-2">
            <Avatar
              size="sm"
              isBordered
              color="default"
              src="/images/images.png"
            />
          </div>
        </div>
        <div className="flex flex-col items-stretch justify-start w-full flex-1 p-2 gap-2 border-1 border-dark overflow-y-auto overflow-x-hidden">
          {children}
        </div>
      </div>
    </div>
  );
}

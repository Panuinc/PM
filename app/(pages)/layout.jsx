/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { Avatar, Tooltip } from "@heroui/react";
import { Bell, Cat, Factory, Key, Menu } from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import { signOut, useSession } from "next-auth/react";
import UILoading from "@/components/UILoading";
import { useSessionUser } from "@/hooks/useSessionUser";
import { menuConfig } from "@/config/permissions";

function MainMenu({ icons, content, onClick, isActive, isMobile }) {
  const menuContent = (
    <div
      className={`flex items-center justify-center w-full aspect-square p-4 gap-2 text-background cursor-pointer ${
        isActive
          ? "bg-background shadow-md rounded-xl text-primary"
          : "hover:bg-background hover:shadow-md hover:rounded-xl hover:text-primary"
      }`}
      onClick={onClick}
    >
      {icons}
    </div>
  );

  if (isMobile) return menuContent;

  return (
    <Tooltip
      color="primary"
      content={content}
      placement="right"
      offset={15}
      className="px-4 py-2 text-background"
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
      className={`flex items-center justify-start w-full h-fit p-4 gap-2 cursor-pointer ${
        isActive
          ? "bg-foreground shadow-md rounded-xl text-background"
          : "hover:bg-foreground hover:shadow-md hover:rounded-xl hover:text-background"
      }`}
      onClick={onClick}
    >
      {text}
    </div>
  );
}

export default function PagesLayout({ children }) {
  const { data: session, status } = useSession();
  const { isAdminSuperAdmin, permissions } = useSessionUser();

  const [selectedMenu, setSelectedMenu] = useState("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const allMenuData = useMemo(() => menuConfig, []);

  const hasPermission = (required) => {
    if (!Array.isArray(required) || required.length === 0) return true;
    if (!Array.isArray(permissions)) return false;
    return required.every((p) => permissions?.includes?.(p));
  };

  const menuData = useMemo(() => {
    if (isAdminSuperAdmin) return allMenuData;

    const result = {};
    for (const [menuKey, menuValue] of Object.entries(allMenuData)) {
      if (!hasPermission(menuValue.requiredPermissions)) continue;

      const allowedSubMenus = menuValue.subMenus.filter((sub) =>
        hasPermission(sub.requiredPermissions)
      );

      if (allowedSubMenus.length > 0) {
        result[menuKey] = { ...menuValue, subMenus: allowedSubMenus };
      }
    }

    return result;
  }, [allMenuData, permissions, isAdminSuperAdmin]);

  useEffect(() => {
    for (const [menuKey, menuValue] of Object.entries(menuData)) {
      const matched = menuValue.subMenus.some(
        (sub) => pathname === sub.path || pathname.startsWith(sub.path)
      );
      if (matched) {
        setSelectedMenu(menuKey);
        break;
      }
    }
  }, [pathname, menuData]);

  const handleMenuClick = (menuKey) => {
    if (isMobileMenuOpen) setIsMobileMenuOpen(false);
    setSelectedMenu(menuKey);
  };

  const handleSubMenuClick = (path) => {
    setIsMobileMenuOpen(false);
    router.push(path);
  };

  useEffect(() => {
    if (status === "unauthenticated") router.push("/");
  }, [status, router]);

  if (status === "loading" || !session) return <UILoading />;

  return (
    <div className="flex flex-col xl:flex-row items-center justify-center w-full h-full">
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 xl:hidden bg-foreground/75"
          onClick={toggleMobileMenu}
        />
      )}

      <div
        className={`fixed xl:relative inset-y-0 left-0 z-50 flex flex-row items-center justify-center 
        w-[350px] xl:w-[500px] h-full transition-all duration-300
        ${
          isMobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full xl:translate-x-0"
        }`}
      >
        <div className="flex flex-col items-center justify-between min-w-fit h-full p-2 gap-2 bg-primary overflow-auto">
          <div className="flex items-center justify-center w-full h-fit p-4 gap-2 bg-background shadow-md rounded-xl text-primary cursor-pointer">
            <Cat />
          </div>

          <div className="flex flex-col items-center justify-start w-full h-full gap-2">
            {Object.entries(menuData).map(([key, data]) => (
              <MainMenu
                key={key}
                content={data.label}
                icons={data.icon}
                isMobile={isMobileMenuOpen}
                isActive={selectedMenu === key}
                onClick={() => handleMenuClick(key)}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center justify-start w-full h-full p-2 gap-2 bg-background border-r-1 border-default overflow-auto">
          <div className="flex items-center justify-start w-full h-fit p-4 gap-2 text-foreground border-b-1 border-default cursor-pointer">
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

          <div className="xl:flex hidden items-center justify-center w-full h-fit p-2 gap-2">
            <Image
              src="/images/logo.png"
              alt="pic"
              width={125}
              height={125}
              className="object-cover"
            />
          </div>

          <div
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex items-center justify-start w-full h-fit p-4 gap-2 text-foreground border-t-1 border-default cursor-pointer"
          >
            <Key className="hover:scale-150" /> Logout
          </div>
        </div>
      </div>

      <div className="flex flex-col items-stretch justify-start w-full h-full overflow-hidden">
        <div className="flex flex-row items-center justify-between w-full h-fit p-2 gap-2 border-b-1 border-default">
          <button
            className="flex xl:hidden items-center justify-center aspect-square h-full p-2 gap-2 cursor-pointer"
            onClick={toggleMobileMenu}
          >
            <Menu />
          </button>

          <div className="flex items-center justify-start w-full xl:w-fit h-full p-2 gap-2 whitespace-nowrap">
            CHH Industry
          </div>

          <div className="hidden xl:flex items-center justify-center w-full h-full p-2 gap-2"></div>

          <div className="flex items-center justify-center aspect-square h-full p-2 gap-2 hover:scale-105">
            <Bell />
          </div>

          <div className="flex items-center justify-center w-fit h-full p-2 gap-2">
            <Avatar
              size="sm"
              isBordered
              color="default"
              src="/images/logo.png"
            />
          </div>
        </div>

        <div className="flex flex-col items-center justify-start w-full py-2 px-4 gap-6 overflow-y-auto overflow-x-hidden">
          {children}
        </div>
      </div>
    </div>
  );
}

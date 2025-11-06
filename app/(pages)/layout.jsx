/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { Avatar, Button, Tooltip } from "@heroui/react";
import {
  Bell,
  BookOpen,
  Calendar,
  Cat,
  ChevronLeft,
  ChevronRight,
  Clipboard,
  Factory,
  HardDrive,
  History,
  Key,
  LayoutDashboard,
  Menu,
  Settings,
  Wrench,
  X,
} from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import UILoading from "@/components/UILoading";

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
  const isActive = pathname === path;

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

  const menuData = {
    dashboard: {
      icon: <LayoutDashboard />,
      label: "Dashboard",
      subMenus: [
        { text: "Home", path: "/home" },
        { text: "Analytics", path: "/dashboard/analytics" },
        { text: "Reports", path: "/dashboard/reports" },
        { text: "Settings", path: "/dashboard/settings" },
      ],
    },
    mcMaster: {
      icon: <HardDrive />,
      label: "Mc Master",
      subMenus: [
        { text: "Machine List", path: "/mcMaster" },
        { text: "Add Machine", path: "/mc-master/add" },
        { text: "Edit Machine", path: "/mc-master/edit" },
        { text: "Delete Machine", path: "/mc-master/delete" },
      ],
    },
    pmPlan: {
      icon: <Calendar />,
      label: "PM Plan",
      subMenus: [
        { text: "Daily Plan", path: "/pm-plan/daily" },
        { text: "Weekly Plan", path: "/pm-plan/weekly" },
        { text: "Monthly Plan", path: "/pm-plan/monthly" },
        { text: "Yearly Plan", path: "/pm-plan/yearly" },
      ],
    },
    mcRepairLog: {
      icon: <Wrench />,
      label: "Mc Repair Log",
      subMenus: [
        { text: "View Logs", path: "/mc-repair-log/view" },
        { text: "Add Log", path: "/mc-repair-log/add" },
        { text: "Edit Log", path: "/mc-repair-log/edit" },
        { text: "Export Logs", path: "/mc-repair-log/export" },
      ],
    },
    pmRecord: {
      icon: <BookOpen />,
      label: "PM Record",
      subMenus: [
        { text: "All Records", path: "/pm-record/all" },
        { text: "Pending", path: "/pm-record/pending" },
        { text: "Completed", path: "/pm-record/completed" },
        { text: "Archived", path: "/pm-record/archived" },
      ],
    },
    mcJobOrder: {
      icon: <Clipboard />,
      label: "Mc Job Order",
      subMenus: [
        { text: "New Order", path: "/mc-job-order/new" },
        { text: "In Progress", path: "/mc-job-order/in-progress" },
        { text: "Completed", path: "/mc-job-order/completed" },
        { text: "Cancelled", path: "/mc-job-order/cancelled" },
      ],
    },
    mcHistory: {
      icon: <History />,
      label: "Mc History",
      subMenus: [
        { text: "View History", path: "/mc-history/view" },
        { text: "Search", path: "/mc-history/search" },
        { text: "Filter", path: "/mc-history/filter" },
        { text: "Export", path: "/mc-history/export" },
      ],
    },
    setting: {
      icon: <Settings />,
      label: "Settings",
      subMenus: [
        { text: "User", path: "/setting/user" },
        { text: "Change Password", path: "/setting/changePassword" },
      ],
    },
  };

  useEffect(() => {
    const currentPath = pathname;

    for (const [menuKey, menuValue] of Object.entries(menuData)) {
      const hasMatchingPath = menuValue.subMenus.some(
        (subMenu) =>
          currentPath === subMenu.path ||
          currentPath.startsWith(subMenu.path + "/")
      );

      if (hasMatchingPath) {
        setSelectedMenu(menuKey);
        break;
      }
    }
  }, [pathname]);

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
    <div className="flex flex-col lg:flex-row items-center justify-center w-full h-full">
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={toggleMobileMenu}
        />
      )}

      <div
        className={`
          fixed lg:relative inset-y-0 left-0 z-50
          flex flex-row items-center justify-center
          ${isCollapsed ? "w-fit" : "w-[300px] lg:w-[500px]"}
          h-full bg-white transition-all duration-300
          ${
            isMobileMenuOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
        `}
      >
        <div className="flex flex-col items-center justify-between min-w-fit h-full p-2 gap-2 border-1 border-dark bg-dark overflow-auto">
          <div
            className="lg:hidden flex items-center justify-center w-full h-fit p-3 gap-2 cursor-pointer text-white hover:text-dark hover:bg-white"
            onClick={toggleMobileMenu}
          >
            <X />
          </div>

          <div className="flex items-center justify-center w-full h-fit p-3 gap-2 border-b-2 border-default text-white">
            <Cat />
          </div>

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
              <Factory /> {menuData[selectedMenu].label}
            </div>
            <div className="flex flex-col items-center justify-start w-full h-full p-2 gap-2 overflow-auto">
              {menuData[selectedMenu].subMenus.map((subMenu, index) => (
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

      <div className="flex flex-col items-center justify-center w-full h-full">
        <div className="flex flex-row items-center justify-between w-full h-fit p-1 gap-2 border-1 border-dark">
          <button
            className="flex lg:hidden items-center justify-center aspect-square h-full p-2 gap-2 cursor-pointer"
            onClick={toggleMobileMenu}
          >
            <Menu />
          </button>
          <div className="flex items-center justify-center w-full xl:w-fit h-full p-2 gap-2 whitespace-nowrap">
            <span className="hidden sm:inline">Preventive Maintenance</span>
            <span className="sm:hidden"> </span>
          </div>
          <div className="hidden md:flex items-center justify-center w-full h-full p-2 gap-2">
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
        <div className="flex flex-col items-center justify-start w-full h-full p-2 gap-2 border-1 border-dark overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
}

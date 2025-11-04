"use client";

import { Avatar, Tooltip } from "@heroui/react";
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
  Wrench,
  X,
} from "lucide-react";
import { useState } from "react";

function MainMenu({ icons, content, onClick, isActive, isMobile }) {
  const menuContent = (
    <div
      className={`flex items-center justify-center w-full aspect-square p-3 gap-2 cursor-pointer rounded-xl hover:text-dark hover:bg-white ${
        isActive ? "bg-white text-dark" : "text-white"
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

function SubMenu({ text, onClick }) {
  return (
    <div
      className="flex items-center justify-start w-full h-fit p-3 gap-2 cursor-pointer rounded-xl hover:text-white hover:bg-dark"
      onClick={onClick}
    >
      {text}
    </div>
  );
}

export default function PagesLayout({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const handleMenuClick = (menuKey) => {
    if (isCollapsed) setIsCollapsed(false);
    setSelectedMenu(menuKey);
  };

  const handleSubMenuClick = () => {
    setIsMobileMenuOpen(false);
  };

  const menuData = {
    dashboard: {
      icon: <LayoutDashboard />,
      label: "Dashboard",
      subMenus: ["Overview", "Analytics", "Reports", "Settings"],
    },
    mcMaster: {
      icon: <HardDrive />,
      label: "Mc Master",
      subMenus: [
        "Machine List",
        "Add Machine",
        "Edit Machine",
        "Delete Machine",
      ],
    },
    pmPlan: {
      icon: <Calendar />,
      label: "PM Plan",
      subMenus: ["Daily Plan", "Weekly Plan", "Monthly Plan", "Yearly Plan"],
    },
    mcRepairLog: {
      icon: <Wrench />,
      label: "Mc Repair Log",
      subMenus: ["View Logs", "Add Log", "Edit Log", "Export Logs"],
    },
    pmRecord: {
      icon: <BookOpen />,
      label: "PM Record",
      subMenus: ["All Records", "Pending", "Completed", "Archived"],
    },
    mcJobOrder: {
      icon: <Clipboard />,
      label: "Mc Job Order",
      subMenus: ["New Order", "In Progress", "Completed", "Cancelled"],
    },
    mcHistory: {
      icon: <History />,
      label: "Mc History",
      subMenus: ["View History", "Search", "Filter", "Export"],
    },
  };

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
            className="lg:hidden flex items-center justify-center w-full h-fit p-3 gap-2 cursor-pointer rounded-xl text-white hover:text-dark hover:bg-white"
            onClick={toggleMobileMenu}
          >
            <X />
          </div>

          <div className="flex items-center justify-center w-full h-fit p-3 gap-2 border-b-2 border-default text-white hover:text-primary">
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
            className="flex items-center justify-center w-full h-fit p-3 gap-2 border-t-2 border-default cursor-pointer text-white hover:text-primary"
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
                  text={subMenu}
                  onClick={handleSubMenuClick}
                />
              ))}
            </div>
            <div className="flex items-center justify-start w-full h-fit p-3 gap-2 border-t-2 border-dark hover:text-primary cursor-pointer">
              <Key /> Logout
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col items-center justify-center w-full h-full">
        <div className="flex flex-row items-center justify-between w-full h-fit p-1 gap-2 border-1 border-dark">
          <button
            className="flex lg:hidden items-center justify-center aspect-square h-full p-2 gap-2 cursor-pointer hover:text-white hover:bg-dark"
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
              color="primary"
              src="https://i.pravatar.cc/150?u=a04258114e29026302d"
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

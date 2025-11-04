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
  Wrench,
} from "lucide-react";
import { useState } from "react";

function MainMenu({ icons, content, onClick, isActive }) {
  return (
    <>
      <Tooltip
        color="default"
        content={content}
        placement="right"
        showArrow={true}
        className="px-4 py-2 font-semibold"
      >
        <div
          className={`flex items-center justify-center w-full aspect-square p-3 gap-2 border-2 border-default border-dashed cursor-pointer hover:text-white hover:bg-dark ${
            isActive ? "bg-dark text-white" : ""
          }`}
          onClick={onClick}
        >
          {icons}
        </div>
      </Tooltip>
    </>
  );
}

function SubMenu({ text }) {
  return (
    <>
      <div className="flex items-center justify-start w-full h-fit p-3 gap-2 border-2 border-default border-dashed hover:text-white hover:bg-dark cursor-pointer">
        {text}
      </div>
    </>
  );
}

export default function PagesLayout({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState("dashboard");

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleMenuClick = (menuKey) => {
    if (isCollapsed) {
      setIsCollapsed(false);
    }
    setSelectedMenu(menuKey);
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
    <div className="flex flex-row items-center justify-center w-full h-full gap-2">
      <div
        className={`flex flex-row items-center justify-center ${
          isCollapsed ? "w-fit" : "w-[500px]"
        } h-full p-2 gap-2 border-2 border-default border-dashed transition-all duration-300`}
      >
        <div className="flex flex-col items-center justify-between min-w-fit h-full p-2 gap-2 border-2 border-default overflow-auto">
          <div className="flex items-center justify-center w-full h-fit p-3 gap-2 border-2 border-default border-dashed">
            <Cat />
          </div>

          {Object.entries(menuData).map(([key, data]) => (
            <MainMenu
              key={key}
              content={data.label}
              icons={data.icon}
              onClick={() => handleMenuClick(key)}
              isActive={selectedMenu === key}
            />
          ))}

          <div
            className="flex items-center justify-center w-full h-fit p-3 gap-2 border-2 border-default border-dashed cursor-pointer hover:text-white hover:bg-dark"
            onClick={toggleSidebar}
          >
            {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
          </div>
        </div>

        {!isCollapsed && (
          <div className="flex flex-col items-center justify-start w-full h-full p-2 gap-2 border-2 border-default overflow-auto">
            <div className="flex items-center justify-start w-full h-fit p-3 gap-2 border-2 border-default border-dashed">
              <Factory /> {menuData[selectedMenu].label}
            </div>
            <div className="flex flex-col items-center justify-start w-full h-full gap-2 overflow-auto">
              {menuData[selectedMenu].subMenus.map((subMenu, index) => (
                <SubMenu key={index} text={subMenu} />
              ))}
            </div>
            <div className="flex items-center justify-start w-full h-fit p-3 gap-2 border-2 border-default border-dashed hover:text-white hover:bg-dark cursor-pointer">
              <Key /> Logout
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col items-center justify-center w-full h-full p-2 gap-2 border-2 border-default border-dashed">
        <div className="flex flex-row items-center justify-center w-full h-fit p-2 gap-2 border-2 border-default">
          <div className="flex items-center justify-center w-fit h-full p-2 gap-2 border-2 border-default border-dashed whitespace-nowrap">
            Preventive Maintenance
          </div>
          <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-default border-dashed">
            Header
          </div>
          <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-default border-dashed">
            Header
          </div>
          <div className="flex items-center justify-center aspect-square h-full p-2 gap-2 border-2 border-default border-dashed">
            <Bell />
          </div>
          <div className="flex items-center justify-center w-fit h-full p-2 gap-2 border-2 border-default border-dashed">
            <Avatar
              size="sm"
              isBordered
              color="primary"
              src="https://i.pravatar.cc/150?u=a04258114e29026302d"
            />
          </div>
        </div>
        <div className="flex flex-col items-center justify-start w-full h-full p-2 gap-2 border-2 border-default overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
}

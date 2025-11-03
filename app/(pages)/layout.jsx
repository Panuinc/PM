"use client";

import {
  Bell,
  BookOpen,
  Calendar,
  Cat,
  ChevronLeft,
  Clipboard,
  Construction,
  Factory,
  HardDrive,
  History,
  Key,
  LayoutDashboard,
  Wrench,
} from "lucide-react";
import { Avatar, Tooltip } from "@heroui/react";

function MainMenu({ icons, content }) {
  return (
    <>
      <Tooltip
        color="primary"
        content={content}
        placement="right"
        showArrow={true}
        className="px-4 py-2 text-white font-semibold"
      >
        <div className="flex items-center justify-center w-full aspect-square p-3 gap-2 border-2 border-default border-dashed hover:text-white hover:bg-dark">
          {icons}
        </div>
      </Tooltip>
    </>
  );
}

function SubMenu({ text }) {
  return (
    <>
      <div className="flex items-center justify-start w-full h-fit p-3 gap-2 border-2 border-default border-dashed hover:text-white hover:bg-dark">
        {text}
      </div>
    </>
  );
}

export default function PagesLayout({ children }) {
  return (
    <div className="flex flex-row items-center justify-center w-full h-full gap-2">
      <div className="flex flex-row items-center justify-center w-[500px] h-full p-2 gap-2 border-2 border-default border-dashed">
        <div className="flex flex-col items-center justify-between min-w-fit h-full p-2 gap-2 border-2 border-default overflow-auto">
          <div className="flex items-center justify-center w-full h-fit p-3 gap-2 border-2 border-default border-dashed">
            <Cat />
          </div>
          <MainMenu content="Dashboard" icons={<LayoutDashboard />} />
          <MainMenu content="Dashboard" icons={<HardDrive />} />
          <MainMenu content="Dashboard" icons={<Calendar />} />
          <MainMenu content="Dashboard" icons={<Wrench />} />
          <MainMenu content="Dashboard" icons={<BookOpen />} />
          <MainMenu content="Dashboard" icons={<Clipboard />} />
          <MainMenu content="Dashboard" icons={<History />} />
          <div className="flex items-center justify-center w-full h-fit p-3 gap-2 border-2 border-default border-dashed">
            <ChevronLeft />
          </div>
        </div>
        <div className="flex flex-col items-center justify-start w-full h-full p-2 gap-2 border-2 border-default overflow-auto">
          <div className="flex items-center justify-start w-full h-fit p-3 gap-2 border-2 border-default border-dashed">
            <Factory /> Text
          </div>
          <div className="flex flex-col items-center justify-start w-full h-full gap-2 overflow-auto">
            <SubMenu text="Text 1" />
            <SubMenu text="Text 2" />
            <SubMenu text="Text 3" />
            <SubMenu text="Text 4" />
          </div>
          <div className="flex items-center justify-start w-full h-fit p-3 gap-2 border-2 border-default border-dashed hover:text-white hover:bg-dark">
            <Key /> Logout
          </div>
        </div>
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

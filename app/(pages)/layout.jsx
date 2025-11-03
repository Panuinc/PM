"use client";

import {
  Bell,
  Cat,
  ChevronLeft,
  Construction,
  Key,
  Wrench,
} from "lucide-react";
import { Avatar } from "@heroui/react";

export default function PagesLayout({ children }) {
  return (
    <div className="flex flex-row items-center justify-center w-full h-full gap-2">
      <div className="flex flex-row items-center justify-center w-[450px] h-full p-2 gap-2 border-2 border-dark border-dashed">
        <div className="flex flex-col items-center justify-between w-3/12 h-full p-2 gap-2 border-2 border-dark overflow-auto">
          <div className="flex items-center justify-center w-full h-fit p-2 gap-2 border-2 border-dark border-dashed">
            <Cat />
          </div>
          <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
            Main
          </div>
          <div className="flex items-center justify-center w-full h-fit p-2 gap-2 border-2 border-dark border-dashed">
            <ChevronLeft />
          </div>
        </div>
        <div className="flex flex-col items-center justify-start w-9/12 h-full p-2 gap-2 border-2 border-dark overflow-auto">
          <div className="flex items-center justify-start w-full h-fit p-2 gap-2 border-2 border-dark border-dashed">
            <Wrench /> Text
          </div>
          <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
            Sub
          </div>
          <div className="flex items-center justify-start w-full h-fit p-2 gap-2 border-2 border-dark border-dashed">
            <Key /> Logout
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
        <div className="flex flex-row items-center justify-center w-full h-fit p-2 gap-2 border-2 border-dark">
          <div className="flex items-center justify-center w-fit h-full p-2 gap-2 border-2 border-dark border-dashed whitespace-nowrap">
            Preventive Maintenance
          </div>
          <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
            Header
          </div>
          <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
            Header
          </div>
          <div className="flex items-center justify-center aspect-square h-full p-2 gap-2 border-2 border-dark border-dashed">
            <Bell />
          </div>
          <div className="flex items-center justify-center w-fit h-full p-2 gap-2 border-2 border-dark border-dashed">
            <Avatar
              size="sm"
              isBordered
              color="success"
              src="https://i.pravatar.cc/150?u=a04258114e29026302d"
            />
          </div>
        </div>
        <div className="flex flex-col items-center justify-start w-full h-full p-2 gap-2 border-2 border-dark overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
}

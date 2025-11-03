"use client";

import { ChevronLeft } from "lucide-react";

export default function PagesLayout({ children }) {
  return (
    <div className="flex flex-row items-center justify-center w-full h-full gap-2">
      <div className="flex flex-row items-center justify-center w-3/12 h-full p-2 gap-2 border-2 border-dark border-dashed">
        <div className="flex flex-col items-center justify-between w-3/12 h-full p-2 gap-2 border-2 border-dark overflow-auto">
          <div className="flex items-center justify-center w-full h-fit p-2 gap-2 border-2 border-dark border-dashed">
            Main
          </div>
          <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
            Main
          </div>
          <div className="flex items-center justify-center w-full h-fit p-2 gap-2 border-2 border-dark border-dashed">
            <ChevronLeft />
          </div>
        </div>
        <div className="flex flex-col items-center justify-start w-9/12 h-full p-2 gap-2 border-2 border-dark overflow-auto">
          <div className="flex items-center justify-center w-full h-fit p-2 gap-2 border-2 border-dark border-dashed">
            Sub
          </div>
          <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
            Sub
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center w-9/12 h-full p-2 gap-2 border-2 border-dark border-dashed">
        <div className="flex flex-row items-center justify-center w-full h-fit p-2 gap-2 border-2 border-dark">
          <div className="flex items-center justify-center w-fit h-fit p-2 gap-2 border-2 border-dark border-dashed whitespace-nowrap">
            Preventive Maintenance
          </div>
          <div className="flex items-center justify-center w-full h-fit p-2 gap-2 border-2 border-dark border-dashed">
            Header
          </div>
          <div className="flex items-center justify-center w-full h-fit p-2 gap-2 border-2 border-dark border-dashed">
            Header
          </div>
        </div>
        <div className="flex flex-col items-center justify-start w-full h-full p-2 gap-2 border-2 border-dark overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
}

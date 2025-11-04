"use client";
import React from "react";
import UIHeader from "../UIHeader";

export default function UIMcMasterList({ headerTopic }) {
  return (
    <>
      <UIHeader header={headerTopic} />

      <div className="flex flex-col xl:flex-row items-center justify-center w-full h-fit p-2 gap-2 border-2 border-dark border-dashed">
        <div className="flex items-center justify-center w-full h-24 p-2 gap-2 border-2 border-dark border-dashed">
          1
        </div>
        <div className="flex items-center justify-center w-full h-24 p-2 gap-2 border-2 border-dark border-dashed">
          2
        </div>
        <div className="flex items-center justify-center w-full h-24 p-2 gap-2 border-2 border-dark border-dashed">
          3
        </div>
        <div className="flex items-center justify-center w-full h-24 p-2 gap-2 border-2 border-dark border-dashed">
          4
        </div>
      </div>
      <div className="flex items-center justify-center w-full h-fit p-2 gap-2 border-2 border-dark border-dashed">
        1
      </div>
    </>
  );
}

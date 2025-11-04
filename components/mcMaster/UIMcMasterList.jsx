"use client";
import React from "react";
import UIHeader from "../UIHeader";
import { Download, Filter, Plus, Search } from "lucide-react";
import { Button, Input } from "@heroui/react";

export default function UIMcMasterList({ headerTopic }) {
  return (
    <>
      <UIHeader header={headerTopic} />
      <div className="flex flex-row items-center justify-center w-full h-fit p-2 gap-2 border-2 border-dark border-dashed">
        <div className="flex items-center justify-center w-full h-full gap-2">
          <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
            <Input
              name="email"
              type="email"
              color="default"
              variant="faded"
              radius="none"
              placeholder="Search Machine Master"
              startContent={<Search />}
              //   value={email}
              //   onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="xl:flex hidden items-center justify-center aspect-square h-full p-2 gap-2 border-2 border-dark border-dashed">
            <Filter />
          </div>
        </div>
        <div className="xl:flex hidden items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark border-dashed">
          {" "}
        </div>
        <div className="flex items-center justify-center aspect-square h-full p-2 gap-2 border-2 border-dark border-dashed whitespace-nowrap">
          <Download />
        </div>
        <div className="flex items-center justify-center aspect-square h-full p-2 gap-2 border-2 border-dark border-dashed whitespace-nowrap">
          <Plus />
        </div>
      </div>
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

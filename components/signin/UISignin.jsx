"use client";
import { Button, Input } from "@heroui/react";
import Image from "next/image";
import React from "react";

export default function UISignin() {
  return (
    <div className="flex flex-row items-center justify-center w-full h-full p-2 gap-2 border-2 border-default">
      <div className="flex flex-col items-center justify-center w-full xl:w-4/12 h-full p-2 gap-2 border-2 border-default shadow">
        <div className="flex items-center justify-center w-full h-fit p-2 gap-2 border-2 border-default text-2xl">
          maintannance
        </div>
        <div className="flex items-center justify-center w-full h-fit p-2 gap-2 border-2 border-default">
          <Input
            name="email"
            type="email"
            label="Email"
            color="default"
            variant="faded"
            radius="none"
            labelPlacement="outside"
            placeholder="Enter your email"
            isRequired
            //   value={email}
            //   onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="flex items-center justify-center w-full h-fit p-2 gap-2 border-2 border-default">
          <Input
            name="password"
            type="password"
            label="password"
            color="default"
            variant="faded"
            radius="none"
            labelPlacement="outside"
            placeholder="Enter your password"
            isRequired
            //   value={email}
            //   onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="flex items-center justify-center w-6/12 h-fit p-2 gap-2 border-2 border-default">
          <Button
            color="default"
            variant="faded"
            radius="none"
            className="w-full p-2 gap-2 border-2 border-default"
          >
            test
          </Button>
        </div>
      </div>
      <div className="xl:flex hidden flex-col items-center justify-center w-full xl:w-8/12 h-full p-2 gap-2 border-2 border-default">
        <div className="flex items-center justify-center w-full h-full p-2 gap-2 border-2 border-default">
          <Image
            src="/images/images.png"
            alt="images"
            width={500}
            height={500}
            className="object-cover"
            priority
          />
        </div>
      </div>
    </div>
  );
}

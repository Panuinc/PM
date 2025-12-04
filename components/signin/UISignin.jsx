"use client";
import { Button, Input } from "@heroui/react";
import Image from "next/image";
import React from "react";

export default function UISignin({
  email,
  password,
  setEmail,
  setPassword,
  handleLogin,
}) {
  return (
    <div className="flex flex-row items-center justify-center w-full h-full gap-2">
      <div className="flex flex-col items-center justify-center w-full xl:w-4/12 h-full p-2 gap-2">
        <div className="flex items-center justify-center w-full h-fit p-2 gap-2">
          <Image
            src="/images/logo.png"
            alt="images"
            width={100}
            height={100}
            className="object-cover"
            priority
          />
        </div>
        <div className="flex items-center justify-center w-full h-fit p-2 gap-2 text-2xl">
          CHH Internal System
        </div>
        <div className="flex items-center justify-center w-full h-fit p-2 gap-2">
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="flex items-center justify-center w-full h-fit p-2 gap-2">
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="flex items-center justify-center w-6/12 h-fit p-2 gap-2">
          <Button
            onPress={handleLogin}
            type="submit"
            color="primary"
            radius="none"
            className="w-full p-2 gap-2 text-background font-semibold"
          >
            Signin
          </Button>
        </div>
      </div>
      <div className="xl:flex hidden flex-col items-center justify-center w-full xl:w-8/12 h-full p-14 gap-2 border-l-2 border-default">
        <div className="flex items-center justify-center w-full h-full p-2 gap-2">
          <Image
            src="/images/logo.png"
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

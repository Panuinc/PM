"use client";
import React from "react";
import { Home, ArrowLeft, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@heroui/react";

export default function UIForbidden() {
  return (
    <>
      <div className="flex flex-col items-center justify-center w-full h-screen p-2 gap-2">
        <div className="flex items-center justify-center w-full h-fit p-2 gap-2">
          <motion.div
            animate={{
              scale: [1, 1.2],
              y: [0, -30],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatType: "mirror",
              ease: "easeInOut",
            }}
            className="flex items-center justify-center w-full h-full p-2 gap-2 text-danger text-[200px]"
          >
            403
          </motion.div>
        </div>
        <div className="flex items-center justify-center w-full h-fit p-2 gap-2 text-2xl font-semibold">
          Access Denied
        </div>
        <div className="flex items-center justify-center w-full h-fit p-2 gap-2 text-center max-w-2xl">
          <ShieldAlert className="text-danger" size={24} />
          คุณไม่ได้รับอนุญาตให้เข้าถึงหน้านี้ กรุณาติดต่อผู้ดูแลระบบหากคุณคิดว่านี่เป็นข้อผิดพลาด
        </div>
        <div className="flex items-center justify-center w-full h-fit p-2 gap-2 text-center max-w-2xl text-default-500">
          You don't have permission to access this page. Please contact your administrator if you believe this is an error.
        </div>
        <div className="flex flex-row items-center justify-center w-6/12 h-fit p-2 gap-2">
          <div className="flex items-center justify-center w-full h-full p-2 gap-2">
            <Link
              href="/home"
              className="flex items-center justify-center w-full h-full p-2 gap-2"
            >
              <Button
                color="primary"
                className="w-6/12 p-2 gap-2 font-semibold text-white"
              >
                <Home />
                Go Home
              </Button>
            </Link>
          </div>
          <div className="flex items-center justify-center w-full h-full p-2 gap-2">
            <Button
              color="default"
              onPress={() => window.history.back()}
              className="w-6/12 p-2 gap-2 font-semibold"
            >
              <ArrowLeft />
              Go Back
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
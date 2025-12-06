"use client";
import React from "react";
import { Home, ArrowLeft, Search } from "lucide-react";
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
            className="flex items-center justify-center w-full h-full p-2 gap-2 text-warning text-[200px]"
          >
            403
          </motion.div>
        </div>
        <div className="flex items-center justify-center w-full h-fit p-2 gap-2 text-2xl">
          You are not authorized to access this page. Please contact your
          administrator if you believe this is a mistake.
        </div>
        <div className="flex items-center justify-center w-full h-fit p-2 gap-2">
          You don't have permission to access this page. Please reach out to
          your admin if you think this was done in error.
        </div>
        <div className="flex flex-row items-center justify-center w-2/12 h-fit p-2 gap-2">
          <div className="flex items-center justify-center w-full h-full p-2 gap-2">
            <Link
              href="/home"
              className="flex items-center justify-center w-full h-full p-2 gap-2"
            >
              <Button
                color="warning"
                size="lg"
                className="w-full p-2 gap-2 text-background font-semibold"
              >
                <Home />
                Go Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

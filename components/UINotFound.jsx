"use client";
import React from "react";
import { Home, ArrowLeft, Search } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@heroui/react";

export default function UINotFound() {
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
            className="flex items-center justify-center w-full h-full p-2 gap-2 text-black text-[200px]"
          >
            404
          </motion.div>
        </div>
        <div className="flex items-center justify-center w-full h-fit p-2 gap-2 text-2xl">
          Page Not Found
        </div>
        <div className="flex items-center justify-center w-full h-fit p-2 gap-2">
          Oops! The page you're looking for seems to have wandered off. Let's
          get you back on track.
        </div>
        <div className="flex flex-row items-center justify-center w-6/12 h-fit p-2 gap-2">
          <div className="flex items-center justify-center w-full h-full p-2 gap-2">
            <Link
              href="/home"
              className="flex items-center justify-center w-full h-full p-2 gap-2"
            >
              <Button
                color="default"
                className="w-6/12 p-2 gap-2 font-semibold"
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

"use client";

import dynamic from "next/dynamic";

const CircularProgress = dynamic(
  () => import("@heroui/react").then((mod) => mod.CircularProgress),
  { ssr: false }
);

export default function UILoading() {
  return (
    <div className="flex items-center justify-center w-full h-full p-2 gap-2">
      <CircularProgress aria-label="Loading..." />
    </div>
  );
}

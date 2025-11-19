import { Box } from "lucide-react";
import React from "react";

export default function UIHeader({ header }) {
  return (
    <>
      <div className="flex items-center justify-start w-full h-fit p-2 gap-2 border-b-1">
        <Box /> {header}
      </div>
    </>
  );
}

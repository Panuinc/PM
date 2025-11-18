"use client";
import React from "react";
import UIHeader from "@/components/UIHeader";

export default function UIHome() {
  return (
    <>
      <div className="flex items-center justify-center w-full h-fit p-2 gap-2 border-1 border-dark border-dashed">
        <UIHeader header={headerTopic} />

        <div className="flex flex-col items-center justify-center w-full h-full gap-4">
          <div className="text-2xl font-semibold">
            Welcome, {session?.user?.userFirstName}{" "}
            {session?.user?.userLastName}!
          </div>

          <div className="flex flex-col items-center justify-center w-full max-w-2xl p-4 gap-2 border-1 border-dark">
            <div className="text-lg font-semibold">Your Information</div>
            <div className="w-full p-2">
              <strong>Email:</strong> {session?.user?.email}
            </div>
            <div className="w-full p-2">
              <strong>Status:</strong> {session?.user?.status}
            </div>
          </div>

          <div className="flex flex-col items-center justify-center w-full max-w-2xl p-4 gap-2 border-1 border-dark">
            <div className="text-lg font-semibold">Your Roles</div>
            {session?.user?.roles && session.user.roles.length > 0 ? (
              <div className="w-full p-2 gap-2">
                {session.user.roles.map((role, index) => (
                  <div key={index} className="p-2 border-b-1 border-dark">
                    {role.name}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-default-500">No roles assigned</div>
            )}
          </div>

          <div className="text-default-500">
            Use the menu on the left to navigate to different sections
          </div>
        </div>
      </div>
    </>
  );
}

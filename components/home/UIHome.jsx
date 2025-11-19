"use client";
import React from "react";
import UIHeader from "@/components/UIHeader";

export default function UIHome({ headerTopic, user }) {
  return (
    <>
      <UIHeader header={headerTopic} />

      <div className="flex flex-col items-center justify-start w-full h-fit p-4 gap-6">
        <div className="w-full max-w-3xl p-6 border-1 rounded-sm bg-background shadow-sm">
          <div className="text-3xl font-bold mb-1">
            Welcome, {user?.userFirstName} {user?.userLastName} 🎉
          </div>
          <div className="text-default">
            Great to see you again! Here's your account overview.
          </div>
        </div>

        {/* User Info */}
        <div className="w-full max-w-3xl p-6 border-1 rounded-sm bg-background shadow-sm">
          <div className="text-xl font-semibold mb-4">Your Information</div>

          <div className="flex flex-col gap-3">
            <div>
              <strong>Email:</strong> {user?.email}
            </div>
            <div>
              <strong>Status:</strong> {user?.status}
            </div>
          </div>
        </div>

        <div className="text-default">
          Use the menu on the left to navigate across the system.
        </div>
      </div>
    </>
  );
}

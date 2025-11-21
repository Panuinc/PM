"use client";
import React from "react";
import UIHeader from "@/components/UIHeader";

export default function UIHome({ headerTopic, user }) {
  return (
    <>
      <UIHeader header={headerTopic} />

      <div className="flex flex-col items-center justify-start w-full h-full gap-2 overflow-auto">
        <div className="flex flex-col items-center justify-center w-full h-fit p-2 gap-2 border-b-1 border-foreground">
          <h1 className="flex items-center justify-center w-full h-full p-2 gap-2 text-4xl">
            Welcome, {user?.userFirstName} {user?.userLastName} 🎉
          </h1>
          <p className="flex items-center justify-center w-full h-full p-2 gap-2 text-xl">
            Glad to have you back! Here’s a quick look at your account.
          </p>
        </div>

        <div className="flex flex-col items-center justify-center w-full h-fit p-2 gap-2 border-b-1 border-foreground">
          <h2 className="flex items-center justify-center w-full h-full p-2 gap-2 text-3xl">
            Your Personal Information
          </h2>

          <div className="grid grid-cols-1 xl:grid-cols-2 p-2 w-8/12 h-full gap-2">
            <InfoItem label="User ID" value={user?.userId} />
            <InfoItem
              label="Full Name"
              value={`${user?.userFirstName} ${user?.userLastName}`}
            />

            <InfoItem label="Email" value={user?.userEmail} />
            <InfoItem label="Status" value={user?.userStatus} />
          </div>
        </div>

        <div className="flex flex-col items-center justify-center w-full h-fit p-2 gap-2">
          Use the menu on the left to navigate across the system.
        </div>
      </div>
    </>
  );
}

function InfoItem({ label, value }) {
  return (
    <div className="flex flex-col">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-base font-medium break-all">{value}</span>
    </div>
  );
}

"use client";
import React from "react";
import UIHeader from "@/components/UIHeader";

export default function UIHome({ headerTopic, user }) {
  return (
    <>
      <UIHeader header={headerTopic} />

      <div className="flex flex-col items-center w-full p-6 gap-8">
        <div className="w-full max-w-4xl bg-background border rounded-lg shadow-sm p-8">
          <h1 className="text-4xl font-bold tracking-tight mb-2">
            Welcome, {user?.userFirstName} {user?.userLastName} 🎉
          </h1>
          <p className="text-muted-foreground text-lg">
            Glad to have you back! Here’s a quick look at your account.
          </p>
        </div>

        <div className="w-full max-w-4xl bg-background border rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-semibold mb-6">
            Your Personal Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
            <InfoItem label="User ID" value={user?.userId} />
            <InfoItem
              label="Full Name"
              value={`${user?.userFirstName} ${user?.userLastName}`}
            />

            <InfoItem label="Email" value={user?.userEmail} />
            <InfoItem label="Status" value={user?.userStatus} />

            <InfoItem
              label="Created At"
              value={new Date(user?.userCreatedAt).toLocaleString()}
            />
            <InfoItem
              label="Updated At"
              value={new Date(user?.userUpdatedAt).toLocaleString()}
            />

            <InfoItem label="Created By" value={user?.userCreatedBy ?? "-"} />
            <InfoItem label="Updated By" value={user?.userUpdatedBy ?? "-"} />
          </div>
        </div>

        <div className="w-full max-w-4xl bg-background border rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-semibold mb-6">Your Permissions</h2>

          {user?.userPermissions?.length === 0 && (
            <p className="text-muted-foreground">No permissions assigned.</p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {user?.userPermissions?.map((item) => (
              <div
                key={item.userPermissionId}
                className="border rounded-md p-4 hover:bg-muted transition"
              >
                <div className="font-medium text-lg">
                  {item.permission.permissionName}
                </div>
                <div className="text-sm text-muted-foreground">
                  Status: {item.userPermissionStatus}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-muted-foreground text-center py-4">
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

"use client";
import React from "react";
import UIHeader from "@/components/UIHeader";
import DataTable from "@/components/UITable";
import UILoading from "@/components/UILoading";

const columns = [
  { name: "ID", uid: "visitorIndex", sortable: true },
  { name: "DEPARTMENT NAME", uid: "visitorName", sortable: true },
  { name: "STATUS", uid: "visitorStatus", sortable: true },
  { name: "CREATED BY", uid: "visitorCreatedBy", sortable: true },
  { name: "CREATED AT", uid: "visitorCreatedAt", sortable: true },
  { name: "UPDATED BY", uid: "visitorUpdatedBy", sortable: true },
  { name: "UPDATED AT", uid: "visitorUpdatedAt", sortable: true },
  { name: "ACTIONS", uid: "actions" },
];

const statusOptions = [
  { name: "Enable", uid: "Enable" },
  { name: "Disable", uid: "Disable" },
];

const statusColorMap = {
  Enable: "success",
  Disable: "danger",
};

export default function UIVisitorList({
  headerTopic,
  Visitors = [],
  loading,
  onAddNew,
  onEdit,
}) {
  const total = Visitors.length;
  const enabled = Visitors.filter(
    (visitor) => visitor.visitorStatus === "Enable"
  ).length;
  const disabled = Visitors.filter(
    (visitor) => visitor.visitorStatus === "Disable"
  ).length;

  const normalized = Array.isArray(Visitors)
    ? Visitors.map((visitor, i) => ({
        ...visitor,
        id: visitor.visitorId,
        visitorIndex: i + 1,
        visitorCreatedBy: visitor.createdByUser
          ? `${visitor.createdByUser.userFirstName} ${visitor.createdByUser.userLastName}`
          : visitor.visitorCreatedBy,
        visitorUpdatedBy: visitor.updatedByUser
          ? `${visitor.updatedByUser.userFirstName} ${visitor.updatedByUser.userLastName}`
          : visitor.visitorUpdatedBy || "-",
        visitorCreatedAt: visitor.visitorCreatedAt
          ? new Date(visitor.visitorCreatedAt).toISOString().split("T")[0]
          : "-",
        visitorUpdatedAt: visitor.visitorUpdatedAt
          ? new Date(visitor.visitorUpdatedAt).toISOString().split("T")[0]
          : "-",
      }))
    : [];

  return (
    <>
      <UIHeader header={headerTopic} />

      <div className="flex flex-row items-center justify-center w-full h-fit gap-2">
        <div className="flex flex-col items-center justify-center w-full h-full p-2 gap-2 text-foreground bg-background rounded-xl shadow-md">
          <div className="flex items-center justify-start w-full h-full p-2 gap-2">
            Total Visitors
          </div>
          <div className="flex items-center justify-start w-full h-full p-2 gap-2 text-lg">
            {total}
          </div>
        </div>
        <div className="flex flex-col items-center justify-center w-full h-full p-2 gap-2 text-foreground bg-background rounded-xl shadow-md">
          <div className="flex items-center justify-start w-full h-full p-2 gap-2">
            Enabled Visitors
          </div>
          <div className="flex items-center justify-start w-full h-full p-2 gap-2 text-success text-lg">
            {enabled}
          </div>
        </div>
        <div className="flex flex-col items-center justify-center w-full h-full p-2 gap-2 text-foreground bg-background rounded-xl shadow-md">
          <div className="flex items-center justify-start w-full h-full p-2 gap-2">
            Disabled Visitors
          </div>
          <div className="flex items-center justify-start w-full h-full p-2 gap-2 text-danger text-lg">
            {disabled}
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-start w-full h-fit gap-2 overflow-auto">
        {loading ? (
          <div className="flex items-center justify-center w-full h-full p-2 gap-2">
            <UILoading />
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={normalized}
            statusOptions={statusOptions}
            statusColorMap={statusColorMap}
            searchPlaceholder="Search by visitor name..."
            emptyContent="No visitors found"
            itemName="visitors"
            onAddNew={onAddNew}
            onEdit={onEdit}
          />
        )}
      </div>
    </>
  );
}

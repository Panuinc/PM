"use client";
import React from "react";
import UIHeader from "@/components/UIHeader";
import DataTable from "@/components/UITable";
import UILoading from "@/components/UILoading";

const columns = [
  { name: "ID", uid: "visitorIndex", sortable: true },
  { name: "NAME", uid: "visitorFullName", sortable: true },
  { name: "COMPANY", uid: "visitorCompany", sortable: true },
  { name: "CAR REG.", uid: "visitorCarRegistration", sortable: true },
  { name: "PROVINCE", uid: "visitorProvince", sortable: true },
  { name: "CONTACT PERSON", uid: "visitorContactUserName", sortable: true },
  { name: "REASON", uid: "visitorContactReason", sortable: true },
  { name: "STATUS", uid: "visitorStatus", sortable: true },
  { name: "CHECK-IN TIME", uid: "visitorCreatedAt", sortable: true },
  { name: "ACTIONS", uid: "actions" },
];

const statusOptions = [
  { name: "Check In", uid: "CheckIn" },
  { name: "Confirmed", uid: "Confirmed" },
  { name: "Check Out", uid: "CheckOut" },
];

const statusColorMap = {
  CheckIn: "warning",
  Confirmed: "success",
  CheckOut: "default",
};

const reasonLabelMap = {
  Shipping: "Shipping",
  BillingChequeCollection: "Billing/Cheque",
  JobApplication: "Job Application",
  ProductPresentation: "Product Presentation",
  Meeting: "Meeting",
  Other: "Other",
};

export default function UIVisitorList({
  headerTopic,
  Visitors = [],
  loading,
  onAddNew,
  onEdit,
}) {
  const total = Visitors.length;
  const checkIn = Visitors.filter((v) => v.visitorStatus === "CheckIn").length;
  const confirmed = Visitors.filter(
    (v) => v.visitorStatus === "Confirmed"
  ).length;
  const checkOut = Visitors.filter(
    (v) => v.visitorStatus === "CheckOut"
  ).length;

  const normalized = Array.isArray(Visitors)
    ? Visitors.map((visitor, i) => ({
        ...visitor,
        id: visitor.visitorId,
        visitorIndex: i + 1,
        visitorFullName: `${visitor.visitorFirstName} ${visitor.visitorLastName}`,
        visitorContactUserName: visitor.contactUser
          ? `${visitor.contactUser.userFirstName} ${visitor.contactUser.userLastName}`
          : "-",
        visitorContactReason:
          reasonLabelMap[visitor.visitorContactReason] ||
          visitor.visitorContactReason,
        visitorCreatedByName: visitor.createdByUser
          ? `${visitor.createdByUser.userFirstName} ${visitor.createdByUser.userLastName}`
          : "-",
        visitorUpdatedByName: visitor.updatedByUser
          ? `${visitor.updatedByUser.userFirstName} ${visitor.updatedByUser.userLastName}`
          : "-",
        visitorCreatedAt: visitor.visitorCreatedAt
          ? new Date(visitor.visitorCreatedAt).toLocaleString("th-TH")
          : "-",
        visitorUpdatedAt: visitor.visitorUpdatedAt
          ? new Date(visitor.visitorUpdatedAt).toLocaleString("th-TH")
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
            Check In
          </div>
          <div className="flex items-center justify-start w-full h-full p-2 gap-2 text-warning text-lg">
            {checkIn}
          </div>
        </div>
        <div className="flex flex-col items-center justify-center w-full h-full p-2 gap-2 text-foreground bg-background rounded-xl shadow-md">
          <div className="flex items-center justify-start w-full h-full p-2 gap-2">
            Confirmed
          </div>
          <div className="flex items-center justify-start w-full h-full p-2 gap-2 text-success text-lg">
            {confirmed}
          </div>
        </div>
        <div className="flex flex-col items-center justify-center w-full h-full p-2 gap-2 text-foreground bg-background rounded-xl shadow-md">
          <div className="flex items-center justify-start w-full h-full p-2 gap-2">
            Check Out
          </div>
          <div className="flex items-center justify-start w-full h-full p-2 gap-2 text-default-500 text-lg">
            {checkOut}
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
            searchPlaceholder="Search by name, company, car registration..."
            emptyContent="No Visitors found"
            itemName="Visitors"
            onAddNew={onAddNew}
            onEdit={onEdit}
          />
        )}
      </div>
    </>
  );
}

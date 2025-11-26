"use client";
import React from "react";
import UIHeader from "@/components/UIHeader";
import DataTable from "@/components/UITable";
import UILoading from "@/components/UILoading";

const columns = [
  { name: "ID", uid: "deliveryIndex", sortable: true },
  { name: "DEPARTMENT NAME", uid: "deliveryName", sortable: true },
  { name: "STATUS", uid: "deliveryStatus", sortable: true },
  { name: "CREATED BY", uid: "deliveryCreatedBy", sortable: true },
  { name: "CREATED AT", uid: "deliveryCreatedAt", sortable: true },
  { name: "UPDATED BY", uid: "deliveryUpdatedBy", sortable: true },
  { name: "UPDATED AT", uid: "deliveryUpdatedAt", sortable: true },
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

export default function UIDeliveryList({
  headerTopic,
  Deliverys = [],
  loading,
  onAddNew,
  onEdit,
}) {
  const total = Deliverys.length;
  const enabled = Deliverys.filter(
    (delivery) => delivery.deliveryStatus === "Enable"
  ).length;
  const disabled = Deliverys.filter(
    (delivery) => delivery.deliveryStatus === "Disable"
  ).length;

  const normalized = Array.isArray(Deliverys)
    ? Deliverys.map((delivery, i) => ({
        ...delivery,
        id: delivery.deliveryId,
        deliveryIndex: i + 1,
        deliveryCreatedBy: delivery.createdByUser
          ? `${delivery.createdByUser.userFirstName} ${delivery.createdByUser.userLastName}`
          : delivery.deliveryCreatedBy,
        deliveryUpdatedBy: delivery.updatedByUser
          ? `${delivery.updatedByUser.userFirstName} ${delivery.updatedByUser.userLastName}`
          : delivery.deliveryUpdatedBy || "-",
        deliveryCreatedAt: delivery.deliveryCreatedAt
          ? new Date(delivery.deliveryCreatedAt).toISOString().split("T")[0]
          : "-",
        deliveryUpdatedAt: delivery.deliveryUpdatedAt
          ? new Date(delivery.deliveryUpdatedAt).toISOString().split("T")[0]
          : "-",
      }))
    : [];

  return (
    <>
      <UIHeader header={headerTopic} />

      <div className="flex flex-row items-center justify-center w-full h-fit gap-2">
        <div className="flex flex-col items-center justify-center w-full h-full p-2 gap-2 border-1">
          <div className="flex items-center justify-start w-full h-full p-2 gap-2">
            Total Deliverys
          </div>
          <div className="flex items-center justify-start w-full h-full p-2 gap-2 text-lg">
            {total}
          </div>
        </div>
        <div className="flex flex-col items-center justify-center w-full h-full p-2 gap-2 border-1">
          <div className="flex items-center justify-start w-full h-full p-2 gap-2">
            Enabled Deliverys
          </div>
          <div className="flex items-center justify-start w-full h-full p-2 gap-2 text-success text-lg">
            {enabled}
          </div>
        </div>
        <div className="flex flex-col items-center justify-center w-full h-full p-2 gap-2 border-1">
          <div className="flex items-center justify-start w-full h-full p-2 gap-2">
            Disabled Deliverys
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
            searchPlaceholder="Search by delivery name..."
            emptyContent="No deliverys found"
            itemName="deliverys"
            onAddNew={onAddNew}
            onEdit={onEdit}
          />
        )}
      </div>
    </>
  );
}

"use client";
import React from "react";
import UIHeader from "@/components/UIHeader";
import DataTable from "@/components/UITable";
import UILoading from "@/components/UILoading";

const columns = [
  { name: "ID", uid: "permissionIndex", sortable: true },
  { name: "PERMISSION NAME", uid: "permissionName", sortable: true },
  { name: "STATUS", uid: "permissionStatus", sortable: true },
  { name: "CREATED BY", uid: "permissionCreatedBy", sortable: true },
  { name: "CREATED AT", uid: "permissionCreatedAt", sortable: true },
  { name: "UPDATED BY", uid: "permissionUpdatedBy", sortable: true },
  { name: "UPDATED AT", uid: "permissionUpdatedAt", sortable: true },
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

export default function UIPermissionList({
  headerTopic,
  Permissions = [],
  loading,
  onAddNew,
  onEdit,
}) {
  const total = Permissions.length;
  const enabled = Permissions.filter(
    (permission) => permission.permissionStatus === "Enable"
  ).length;
  const disabled = Permissions.filter(
    (permission) => permission.permissionStatus === "Disable"
  ).length;

  const normalized = Array.isArray(Permissions)
    ? Permissions.map((permission, i) => ({
        ...permission,
        id: permission.permissionId,
        permissionIndex: i + 1,
        permissionCreatedBy: permission.createdByUser
          ? `${permission.createdByUser.userFirstName} ${permission.createdByUser.userLastName}`
          : permission.permissionCreatedBy,
        permissionUpdatedBy: permission.updatedByUser
          ? `${permission.updatedByUser.userFirstName} ${permission.updatedByUser.userLastName}`
          : permission.permissionUpdatedBy || "-",
        permissionCreatedAt: permission.permissionCreatedAt
          ? new Date(permission.permissionCreatedAt).toISOString().split("T")[0]
          : "-",
        permissionUpdatedAt: permission.permissionUpdatedAt
          ? new Date(permission.permissionUpdatedAt).toISOString().split("T")[0]
          : "-",
      }))
    : [];

  return (
    <>
      <UIHeader header={headerTopic} />

      <div className="flex flex-row items-center justify-center w-full h-fit gap-2">
        <div className="flex flex-col items-center justify-center w-full h-full p-2 gap-2 text-foreground bg-background rounded-xl shadow-md">
          <div className="flex items-center justify-start w-full h-full p-2 gap-2">
            Total Permissions
          </div>
          <div className="flex items-center justify-start w-full h-full p-2 gap-2 text-lg">
            {total}
          </div>
        </div>
        <div className="flex flex-col items-center justify-center w-full h-full p-2 gap-2 text-foreground bg-background rounded-xl shadow-md">
          <div className="flex items-center justify-start w-full h-full p-2 gap-2">
            Enabled Permissions
          </div>
          <div className="flex items-center justify-start w-full h-full p-2 gap-2 text-success text-lg">
            {enabled}
          </div>
        </div>
        <div className="flex flex-col items-center justify-center w-full h-full p-2 gap-2 text-foreground bg-background rounded-xl shadow-md">
          <div className="flex items-center justify-start w-full h-full p-2 gap-2">
            Disabled Permissions
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
            searchPlaceholder="Search by permission name..."
            emptyContent="No permissions found"
            itemName="permissions"
            onAddNew={onAddNew}
            onEdit={onEdit}
          />
        )}
      </div>
    </>
  );
}

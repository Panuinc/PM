"use client";
import React from "react";
import UIHeader from "@/components/UIHeader";
import DataTable from "@/components/UITable";
import UILoading from "@/components/UILoading";

const columns = [
  { name: "ID", uid: "roleIndex", sortable: true },
  { name: "DEPARTMENT NAME", uid: "roleName", sortable: true },
  { name: "STATUS", uid: "roleStatus", sortable: true },
  { name: "CREATED BY", uid: "roleCreatedBy", sortable: true },
  { name: "CREATED AT", uid: "roleCreatedAt", sortable: true },
  { name: "UPDATED BY", uid: "roleUpdatedBy", sortable: true },
  { name: "UPDATED AT", uid: "roleUpdatedAt", sortable: true },
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

const INITIAL_VISIBLE_COLUMNS = [
  "roleIndex",
  "roleName",
  "roleStatus",
  "actions",
];

export default function UIRoleList({
  headerTopic,
  Roles = [],
  loading,
  onAddNew,
  onView,
  onEdit,
}) {
  const total = Roles.length;
  const enabled = Roles.filter(
    (d) => d.roleStatus === "Enable"
  ).length;
  const disabled = Roles.filter(
    (d) => d.roleStatus === "Disable"
  ).length;

  const normalized = Array.isArray(Roles)
    ? Roles.map((d, i) => ({
        ...d,
        id: d.roleId,
        roleIndex: i + 1,
        roleCreatedBy: d.createdByUser
          ? `${d.createdByUser.userFirstName} ${d.createdByUser.userLastName}`
          : d.roleCreatedBy || "-",
        roleUpdatedBy: d.updatedByUser
          ? `${d.updatedByUser.userFirstName} ${d.updatedByUser.userLastName}`
          : d.roleUpdatedBy || "-",
        roleCreatedAt: d.roleCreatedAt
          ? new Date(d.roleCreatedAt).toISOString().split("T")[0]
          : "-",
        roleUpdatedAt: d.roleUpdatedAt
          ? new Date(d.roleUpdatedAt).toISOString().split("T")[0]
          : "-",
      }))
    : [];

  return (
    <>
      <UIHeader header={headerTopic} />

      <div className="flex flex-col xl:flex-row items-center justify-center w-full h-fit gap-2">
        <div className="flex flex-col items-center justify-center w-full h-full p-2 gap-2 border-1 border-dark">
          <div className="flex items-center justify-start w-full h-full p-2 gap-2">
            Total Roles
          </div>
          <div className="flex items-center justify-start w-full h-full p-2 gap-2 text-dark text-lg">
            {total}
          </div>
        </div>

        <div className="flex flex-col items-center justify-center w-full h-full p-2 gap-2 border-1 border-dark">
          <div className="flex items-center justify-start w-full h-full p-2 gap-2">
            Enabled Roles
          </div>
          <div className="flex items-center justify-start w-full h-full p-2 gap-2 text-success text-lg">
            {enabled}
          </div>
        </div>

        <div className="flex flex-col items-center justify-center w-full h-full p-2 gap-2 border-1 border-dark">
          <div className="flex items-center justify-start w-full h-full p-2 gap-2">
            Disabled Roles
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
            initialVisibleColumns={INITIAL_VISIBLE_COLUMNS}
            searchPlaceholder="Search by role name..."
            emptyContent="No roles found"
            itemName="roles"
            onAddNew={onAddNew}
            onView={onView}
            onEdit={onEdit}
          />
        )}
      </div>
    </>
  );
}

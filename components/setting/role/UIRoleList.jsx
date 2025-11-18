"use client";
import React from "react";
import UIHeader from "@/components/UIHeader";
import DataTable from "@/components/UITable";
import UILoading from "@/components/UILoading";

const columns = [
  { name: "ID", uid: "roleIndex", sortable: true },
  { name: "ROLE NAME", uid: "roleName", sortable: true },
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
    (role) => role.roleStatus === "Enable"
  ).length;
  const disabled = Roles.filter(
    (role) => role.roleStatus === "Disable"
  ).length;

  const normalized = Array.isArray(Roles)
    ? Roles.map((role, i) => ({
        ...role,
        id: role.roleId,
        roleIndex: i + 1,
        roleCreatedBy: role.createdByUser
          ? `${role.createdByUser.userFirstName} ${role.createdByUser.userLastName}`
          : role.roleCreatedBy || "-",
        roleUpdatedBy: role.updatedByUser
          ? `${role.updatedByUser.userFirstName} ${role.updatedByUser.userLastName}`
          : role.roleUpdatedBy || "-",
        roleCreatedAt: role.roleCreatedAt
          ? new Date(role.roleCreatedAt).toISOString().split("T")[0]
          : "-",
        roleUpdatedAt: role.roleUpdatedAt
          ? new Date(role.roleUpdatedAt).toISOString().split("T")[0]
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

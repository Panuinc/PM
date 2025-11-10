"use client";
import React from "react";
import UIHeader from "@/components/UIHeader";
import DataTable from "@/components/UITable";
import UILoading from "@/components/UILoading";

const columns = [
  { name: "ID", uid: "userRoleIndex", sortable: true },
  {
    name: "ROLE PERMISSION ROLE ID",
    uid: "userRoleRoleId",
    sortable: true,
  },
  {
    name: "ROLE PERMISSION PERMISSION ID",
    uid: "userRolePermissionId",
    sortable: true,
  },
  { name: "STATUS", uid: "userRoleStatus", sortable: true },
  { name: "CREATED BY", uid: "userRoleCreatedBy", sortable: true },
  { name: "CREATED AT", uid: "userRoleCreatedAt", sortable: true },
  { name: "UPDATED BY", uid: "userRoleUpdatedBy", sortable: true },
  { name: "UPDATED AT", uid: "userRoleUpdatedAt", sortable: true },
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
  "userRoleIndex",
  "userRoleRoleId",
  "userRolePermissionId",
  "userRoleStatus",
  "actions",
];

export default function UIUserRoleList({
  headerTopic,
  UserRoles = [],
  loading,
  onAddNew,
  onView,
  onEdit,
}) {
  const total = UserRoles.length;
  const enabled = UserRoles.filter(
    (userRole) => userRole.userRoleStatus === "Enable"
  ).length;
  const disabled = UserRoles.filter(
    (userRole) => userRole.userRoleStatus === "Disable"
  ).length;

  const normalized = Array.isArray(UserRoles)
  ? UserRoles.map((userRole, i) => ({
      ...userRole,
      id: userRole.userRoleId,
      userRoleIndex: i + 1,
      userRoleRoleId:
        userRole.role?.roleName || userRole.userRoleRoleId,
      userRolePermissionId:
        userRole.permission?.permissionName ||
        userRole.userRolePermissionId,
      userRoleCreatedBy: userRole.createdByUser
        ? `${userRole.createdByUser.userFirstName} ${userRole.createdByUser.userLastName}`
        : userRole.userRoleCreatedBy || "-",
      userRoleUpdatedBy: userRole.updatedByUser
        ? `${userRole.updatedByUser.userFirstName} ${userRole.updatedByUser.userLastName}`
        : userRole.userRoleUpdatedBy || "-",
      userRoleCreatedAt: userRole.userRoleCreatedAt
        ? new Date(userRole.userRoleCreatedAt)
            .toISOString()
            .split("T")[0]
        : "-",
      userRoleUpdatedAt: userRole.userRoleUpdatedAt
        ? new Date(userRole.userRoleUpdatedAt)
            .toISOString()
            .split("T")[0]
        : "-",
    }))
  : [];

  return (
    <>
      <UIHeader header={headerTopic} />

      <div className="flex flex-col xl:flex-row items-center justify-center w-full h-fit gap-2">
        <div className="flex flex-col items-center justify-center w-full h-full p-2 gap-2 border-1 border-dark">
          <div className="flex items-center justify-start w-full h-full p-2 gap-2">
            Total UserRoles
          </div>
          <div className="flex items-center justify-start w-full h-full p-2 gap-2 text-dark text-lg">
            {total}
          </div>
        </div>

        <div className="flex flex-col items-center justify-center w-full h-full p-2 gap-2 border-1 border-dark">
          <div className="flex items-center justify-start w-full h-full p-2 gap-2">
            Enabled UserRoles
          </div>
          <div className="flex items-center justify-start w-full h-full p-2 gap-2 text-success text-lg">
            {enabled}
          </div>
        </div>

        <div className="flex flex-col items-center justify-center w-full h-full p-2 gap-2 border-1 border-dark">
          <div className="flex items-center justify-start w-full h-full p-2 gap-2">
            Disabled UserRoles
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
            searchPlaceholder="Search by userRole name..."
            emptyContent="No userRoles found"
            itemName="userRoles"
            onAddNew={onAddNew}
            onView={onView}
            onEdit={onEdit}
          />
        )}
      </div>
    </>
  );
}

"use client";
import React from "react";
import UIHeader from "@/components/UIHeader";
import DataTable from "@/components/UITable";
import UILoading from "@/components/UILoading";

const columns = [
  { name: "ID", uid: "rolePermissionIndex", sortable: true },
  {
    name: "ROLE PERMISSION ROLE ID",
    uid: "rolePermissionRoleId",
    sortable: true,
  },
  {
    name: "ROLE PERMISSION PERMISSION ID",
    uid: "rolePermissionPermissionId",
    sortable: true,
  },
  { name: "STATUS", uid: "rolePermissionStatus", sortable: true },
  { name: "CREATED BY", uid: "rolePermissionCreatedBy", sortable: true },
  { name: "CREATED AT", uid: "rolePermissionCreatedAt", sortable: true },
  { name: "UPDATED BY", uid: "rolePermissionUpdatedBy", sortable: true },
  { name: "UPDATED AT", uid: "rolePermissionUpdatedAt", sortable: true },
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

export default function UIRolePermissionList({
  headerTopic,
  RolePermissions = [],
  loading,
  onAddNew,
  onView,
  onEdit,
}) {
  const total = RolePermissions.length;
  const enabled = RolePermissions.filter(
    (rolePermission) => rolePermission.rolePermissionStatus === "Enable"
  ).length;
  const disabled = RolePermissions.filter(
    (rolePermission) => rolePermission.rolePermissionStatus === "Disable"
  ).length;

  const normalized = Array.isArray(RolePermissions)
  ? RolePermissions.map((rolePermission, i) => ({
      ...rolePermission,
      id: rolePermission.rolePermissionId,
      rolePermissionIndex: i + 1,
      rolePermissionRoleId:
        rolePermission.role?.roleName || rolePermission.rolePermissionRoleId,
      rolePermissionPermissionId:
        rolePermission.permission?.permissionName ||
        rolePermission.rolePermissionPermissionId,
      rolePermissionCreatedBy: rolePermission.createdByUser
        ? `${rolePermission.createdByUser.userFirstName} ${rolePermission.createdByUser.userLastName}`
        : rolePermission.rolePermissionCreatedBy || "-",
      rolePermissionUpdatedBy: rolePermission.updatedByUser
        ? `${rolePermission.updatedByUser.userFirstName} ${rolePermission.updatedByUser.userLastName}`
        : rolePermission.rolePermissionUpdatedBy || "-",
      rolePermissionCreatedAt: rolePermission.rolePermissionCreatedAt
        ? new Date(rolePermission.rolePermissionCreatedAt)
            .toISOString()
            .split("T")[0]
        : "-",
      rolePermissionUpdatedAt: rolePermission.rolePermissionUpdatedAt
        ? new Date(rolePermission.rolePermissionUpdatedAt)
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
            Total RolePermissions
          </div>
          <div className="flex items-center justify-start w-full h-full p-2 gap-2 text-dark text-lg">
            {total}
          </div>
        </div>

        <div className="flex flex-col items-center justify-center w-full h-full p-2 gap-2 border-1 border-dark">
          <div className="flex items-center justify-start w-full h-full p-2 gap-2">
            Enabled RolePermissions
          </div>
          <div className="flex items-center justify-start w-full h-full p-2 gap-2 text-success text-lg">
            {enabled}
          </div>
        </div>

        <div className="flex flex-col items-center justify-center w-full h-full p-2 gap-2 border-1 border-dark">
          <div className="flex items-center justify-start w-full h-full p-2 gap-2">
            Disabled RolePermissions
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
            searchPlaceholder="Search by rolePermission name..."
            emptyContent="No rolePermissions found"
            itemName="rolePermissions"
            onAddNew={onAddNew}
            onView={onView}
            onEdit={onEdit}
          />
        )}
      </div>
    </>
  );
}

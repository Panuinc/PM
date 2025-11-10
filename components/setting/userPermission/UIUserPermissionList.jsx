"use client";
import React from "react";
import UIHeader from "@/components/UIHeader";
import DataTable from "@/components/UITable";
import UILoading from "@/components/UILoading";

const columns = [
  { name: "ID", uid: "userPermissionIndex", sortable: true },
  {
    name: "ROLE PERMISSION ROLE ID",
    uid: "userPermissionPermissionId",
    sortable: true,
  },
  {
    name: "ROLE PERMISSION PERMISSION ID",
    uid: "userPermissionUserId",
    sortable: true,
  },
  { name: "STATUS", uid: "userPermissionStatus", sortable: true },
  { name: "CREATED BY", uid: "userPermissionCreatedBy", sortable: true },
  { name: "CREATED AT", uid: "userPermissionCreatedAt", sortable: true },
  { name: "UPDATED BY", uid: "userPermissionUpdatedBy", sortable: true },
  { name: "UPDATED AT", uid: "userPermissionUpdatedAt", sortable: true },
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
  "userPermissionIndex",
  "userPermissionPermissionId",
  "userPermissionUserId",
  "userPermissionStatus",
  "actions",
];

export default function UIUserPermissionList({
  headerTopic,
  UserPermissions = [],
  loading,
  onAddNew,
  onView,
  onEdit,
}) {
  const total = UserPermissions.length;
  const enabled = UserPermissions.filter(
    (userPermission) => userPermission.userPermissionStatus === "Enable"
  ).length;
  const disabled = UserPermissions.filter(
    (userPermission) => userPermission.userPermissionStatus === "Disable"
  ).length;

  const normalized = Array.isArray(UserPermissions)
    ? UserPermissions.map((userPermission, i) => ({
        ...userPermission,
        id: userPermission.userPermissionId,
        userPermissionIndex: i + 1,
        userPermissionPermissionId: userPermission.permission?.permissionName || userPermission.userPermissionPermissionId,
        userPermissionUserId:
          userPermission.user?.userFirstName && userPermission.user?.userLastName
            ? `${userPermission.user.userFirstName} ${userPermission.user.userLastName}`
            : userPermission.userPermissionUserId,
        userPermissionCreatedBy: userPermission.createdByUser
          ? `${userPermission.createdByUser.userFirstName} ${userPermission.createdByUser.userLastName}`
          : userPermission.userPermissionCreatedBy || "-",
        userPermissionUpdatedBy: userPermission.updatedByUser
          ? `${userPermission.updatedByUser.userFirstName} ${userPermission.updatedByUser.userLastName}`
          : userPermission.userPermissionUpdatedBy || "-",
        userPermissionCreatedAt: userPermission.userPermissionCreatedAt
          ? new Date(userPermission.userPermissionCreatedAt).toISOString().split("T")[0]
          : "-",
        userPermissionUpdatedAt: userPermission.userPermissionUpdatedAt
          ? new Date(userPermission.userPermissionUpdatedAt).toISOString().split("T")[0]
          : "-",
      }))
    : [];

  return (
    <>
      <UIHeader header={headerTopic} />
      <div className="flex flex-col xl:flex-row items-center justify-center w-full h-fit gap-2">
        <div className="flex flex-col items-center justify-center w-full h-full p-2 gap-2 border-1 border-dark">
          <div className="flex items-center justify-start w-full h-full p-2 gap-2">
            Total UserPermissions
          </div>
          <div className="flex items-center justify-start w-full h-full p-2 gap-2 text-dark text-lg">
            {total}
          </div>
        </div>

        <div className="flex flex-col items-center justify-center w-full h-full p-2 gap-2 border-1 border-dark">
          <div className="flex items-center justify-start w-full h-full p-2 gap-2">
            Enabled UserPermissions
          </div>
          <div className="flex items-center justify-start w-full h-full p-2 gap-2 text-success text-lg">
            {enabled}
          </div>
        </div>

        <div className="flex flex-col items-center justify-center w-full h-full p-2 gap-2 border-1 border-dark">
          <div className="flex items-center justify-start w-full h-full p-2 gap-2">
            Disabled UserPermissions
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
            searchPlaceholder="Search by userPermission name..."
            emptyContent="No userPermissions found"
            itemName="userPermissions"
            onAddNew={onAddNew}
            onView={onView}
            onEdit={onEdit}
          />
        )}
      </div>
    </>
  );
}

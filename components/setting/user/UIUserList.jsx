"use client";
import React from "react";
import UIHeader from "@/components/UIHeader";
import DataTable from "@/components/UITable";
import UILoading from "@/components/UILoading";

const columns = [
  { name: "ID", uid: "userIndex", sortable: true },
  { name: "Firstname", uid: "userFirstName", sortable: true },
  { name: "Lastname", uid: "userLastName", sortable: true },
  { name: "Email", uid: "userEmail", sortable: true },
  { name: "STATUS", uid: "userStatus", sortable: true },
  { name: "CREATED BY", uid: "userCreatedBy", sortable: true },
  { name: "CREATED AT", uid: "userCreatedAt", sortable: true },
  { name: "UPDATED BY", uid: "userUpdatedBy", sortable: true },
  { name: "UPDATED AT", uid: "userUpdatedAt", sortable: true },
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

export default function UIUserList({
  headerTopic,
  Users = [],
  loading,
  onAddNew,
  onView,
  onEdit,
}) {
  const total = Users.length;
  const enabled = Users.filter((user) => user.userStatus === "Enable").length;
  const disabled = Users.filter((user) => user.userStatus === "Disable").length;

const normalized = Array.isArray(Users)
  ? Users.map((user, i) => ({
      ...user,
      id: user.userId,
      userIndex: i + 1,
      userCreatedBy: user.createdByUser
        ? `${user.createdByUser.userFirstName} ${user.createdByUser.userLastName}`
        : user.userCreatedBy,
      userUpdatedBy: user.updatedByUser
        ? `${user.updatedByUser.userFirstName} ${user.updatedByUser.userLastName}`
        : user.userUpdatedBy || "-",
      userCreatedAt: user.userCreatedAt
        ? new Date(user.userCreatedAt).toISOString().split("T")[0]
        : "-",
      userUpdatedAt: user.userUpdatedAt
        ? new Date(user.userUpdatedAt).toISOString().split("T")[0]
        : "-",
    }))
  : [];
  
  return (
    <>
      <UIHeader header={headerTopic} />

      <div className="flex flex-row items-center justify-center w-full h-fit gap-2">
        <div className="flex flex-col items-center justify-center w-full h-full p-2 gap-2 border-1">
          <div className="flex items-center justify-start w-full h-full p-2 gap-2">
            Total Users
          </div>
          <div className="flex items-center justify-start w-full h-full p-2 gap-2 text-lg">
            {total}
          </div>
        </div>
        <div className="flex flex-col items-center justify-center w-full h-full p-2 gap-2 border-1">
          <div className="flex items-center justify-start w-full h-full p-2 gap-2">
            Enabled Users
          </div>
          <div className="flex items-center justify-start w-full h-full p-2 gap-2 text-success text-lg">
            {enabled}
          </div>
        </div>
        <div className="flex flex-col items-center justify-center w-full h-full p-2 gap-2 border-1">
          <div className="flex items-center justify-start w-full h-full p-2 gap-2">
            Disabled Users
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
            searchPlaceholder="Search by user name..."
            emptyContent="No users found"
            itemName="users"
            onAddNew={onAddNew}
            onView={onView}
            onEdit={onEdit}
          />
        )}
      </div>
    </>
  );
}

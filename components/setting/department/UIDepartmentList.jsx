"use client";
import React from "react";
import UIHeader from "@/components/UIHeader";
import DataTable from "@/components/UITable";
import UILoading from "@/components/UILoading";

const columns = [
  { name: "ID", uid: "departmentIndex", sortable: true },
  { name: "DEPARTMENT NAME", uid: "departmentName", sortable: true },
  { name: "STATUS", uid: "departmentStatus", sortable: true },
  { name: "CREATED BY", uid: "departmentCreatedBy", sortable: true },
  { name: "CREATED AT", uid: "departmentCreatedAt", sortable: true },
  { name: "UPDATED BY", uid: "departmentUpdatedBy", sortable: true },
  { name: "UPDATED AT", uid: "departmentUpdatedAt", sortable: true },
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
  "departmentIndex",
  "departmentName",
  "departmentStatus",
  "actions",
];

export default function UIDepartmentList({
  headerTopic,
  Departments = [],
  loading,
  onAddNew,
  onView,
  onEdit,
}) {
  const total = Departments.length;
  const enabled = Departments.filter(
    (department) => department.departmentStatus === "Enable"
  ).length;
  const disabled = Departments.filter(
    (department) => department.departmentStatus === "Disable"
  ).length;

  const normalized = Array.isArray(Departments)
    ? Departments.map((department, i) => ({
        ...department,
        id: department.departmentId,
        departmentIndex: i + 1,
        departmentCreatedBy: department.createdByUser
          ? `${department.createdByUser.userFirstName} ${department.createdByUser.userLastName}`
          : department.departmentCreatedBy || "-",
        departmentUpdatedBy: department.updatedByUser
          ? `${department.updatedByUser.userFirstName} ${department.updatedByUser.userLastName}`
          : department.departmentUpdatedBy || "-",
        departmentCreatedAt: department.departmentCreatedAt
          ? new Date(department.departmentCreatedAt).toISOString().split("T")[0]
          : "-",
        departmentUpdatedAt: department.departmentUpdatedAt
          ? new Date(department.departmentUpdatedAt).toISOString().split("T")[0]
          : "-",
      }))
    : [];

  return (
    <>
      <UIHeader header={headerTopic} />

      <div className="flex flex-col xl:flex-row items-center justify-center w-full h-fit gap-2">
        <div className="flex flex-col items-center justify-center w-full h-full p-2 gap-2 border-1 border-dark">
          <div className="flex items-center justify-start w-full h-full p-2 gap-2">
            Total Departments
          </div>
          <div className="flex items-center justify-start w-full h-full p-2 gap-2 text-dark text-lg">
            {total}
          </div>
        </div>

        <div className="flex flex-col items-center justify-center w-full h-full p-2 gap-2 border-1 border-dark">
          <div className="flex items-center justify-start w-full h-full p-2 gap-2">
            Enabled Departments
          </div>
          <div className="flex items-center justify-start w-full h-full p-2 gap-2 text-success text-lg">
            {enabled}
          </div>
        </div>

        <div className="flex flex-col items-center justify-center w-full h-full p-2 gap-2 border-1 border-dark">
          <div className="flex items-center justify-start w-full h-full p-2 gap-2">
            Disabled Departments
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
            searchPlaceholder="Search by department name..."
            emptyContent="No departments found"
            itemName="departments"
            onAddNew={onAddNew}
            onView={onView}
            onEdit={onEdit}
          />
        )}
      </div>
    </>
  );
}

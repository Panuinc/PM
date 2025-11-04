"use client";
import React from "react";
import UIHeader from "../UIHeader";
import DataTable from "../UITable";
import UILoading from "../UILoading";

const columns = [
  { name: "ID", uid: "id", sortable: true },
  { name: "MACHINE CODE", uid: "machineCode", sortable: true },
  { name: "MACHINE NAME", uid: "machineName", sortable: true },
  { name: "LOCATION", uid: "location", sortable: true },
  { name: "TYPE", uid: "type" },
  { name: "STATUS", uid: "status", sortable: true },
  { name: "ACTIONS", uid: "actions" },
];

const statusOptions = [
  { name: "Active", uid: "active" },
  { name: "Maintenance", uid: "maintenance" },
  { name: "Inactive", uid: "inactive" },
];

const statusColorMap = {
  active: "success",
  maintenance: "warning",
  inactive: "danger",
};

const INITIAL_VISIBLE_COLUMNS = [
  "machineCode",
  "machineName",
  "location",
  "status",
  "actions",
];

export default function UIMcMasterList({ headerTopic }) {
  const [machines, setMachines] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    setTimeout(() => {
      setMachines([
        {
          id: 1,
          machineCode: "MC-001",
          machineName: "CNC Machine 1",
          location: "Workshop A",
          type: "CNC",
          status: "active",
        },
        {
          id: 2,
          machineCode: "MC-002",
          machineName: "Lathe Machine",
          location: "Workshop B",
          type: "Lathe",
          status: "inactive",
        },
           {
          id: 3,
          machineCode: "MC-002",
          machineName: "Lathe Machine",
          location: "Workshop B",
          type: "Lathe",
          status: "inactive",
        },
           {
          id: 4,
          machineCode: "MC-002",
          machineName: "Lathe Machine",
          location: "Workshop B",
          type: "Lathe",
          status: "inactive",
        },
           {
          id: 5,
          machineCode: "MC-002",
          machineName: "Lathe Machine",
          location: "Workshop B",
          type: "Lathe",
          status: "inactive",
        },
           {
          id: 6,
          machineCode: "MC-002",
          machineName: "Lathe Machine",
          location: "Workshop B",
          type: "Lathe",
          status: "inactive",
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleAddNew = () => {
    console.log("Add new machine");
  };

  const handleView = (item) => {
    console.log("View:", item);
  };

  const handleEdit = (item) => {
    console.log("Edit:", item);
  };

  return (
    <>
      <UIHeader header={headerTopic} />
      <div className="flex flex-col xl:flex-row items-center justify-center w-full h-fit gap-2">
        <div className="flex items-center justify-center w-full h-24 p-2 gap-2 border-2 border-dark">
          1
        </div>
        <div className="flex items-center justify-center w-full h-24 p-2 gap-2 border-2 border-dark">
          2
        </div>
        <div className="flex items-center justify-center w-full h-24 p-2 gap-2 border-2 border-dark">
          3
        </div>
        <div className="flex items-center justify-center w-full h-24 p-2 gap-2 border-2 border-dark">
          4
        </div>
      </div>
      <div className="flex flex-col items-center justify-start w-full h-fit gap-2">
        {loading ? (
          <div className="flex items-center justify-center w-full h-full p-2 gap-2">
            <UILoading />
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={machines}
            statusOptions={statusOptions}
            statusColorMap={statusColorMap}
            initialVisibleColumns={INITIAL_VISIBLE_COLUMNS}
            searchPlaceholder="Search by machine name..."
            emptyContent="No machines found"
            itemName="machines"
            onAddNew={handleAddNew}
            onView={handleView}
            onEdit={handleEdit}
          />
        )}
      </div>
    </>
  );
}

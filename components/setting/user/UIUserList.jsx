"use client";
import React from "react";
import UIHeader from "@/components/UIHeader";
import DataTable from "@/components/UITable";
import UILoading from "@/components/UILoading";

const columns = [
  { name: "ID", uid: "id", sortable: true },
  { name: "USER CODE", uid: "userCode", sortable: true },
  { name: "FULL NAME", uid: "userName", sortable: true },
  { name: "EMAIL", uid: "email", sortable: true },
  { name: "ROLE", uid: "role" },
  { name: "STATUS", uid: "status", sortable: true },
  { name: "ACTIONS", uid: "actions" },
];

const statusOptions = [
  { name: "Active", uid: "active" },
  { name: "Suspended", uid: "suspended" },
  { name: "Inactive", uid: "inactive" },
];

const statusColorMap = {
  active: "success",
  suspended: "warning",
  inactive: "danger",
};

const INITIAL_VISIBLE_COLUMNS = [
  "userCode",
  "userName",
  "email",
  "role",
  "status",
  "actions",
];

export default function UIUserList({ headerTopic }) {
  const [users, setUsers] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    setTimeout(() => {
      setUsers([
        {
          id: 1,
          userCode: "USR-001",
          userName: "John Doe",
          email: "john.doe@example.com",
          role: "Admin",
          status: "active",
        },
        {
          id: 2,
          userCode: "USR-002",
          userName: "Jane Smith",
          email: "jane.smith@example.com",
          role: "Manager",
          status: "suspended",
        },
        {
          id: 3,
          userCode: "USR-003",
          userName: "Tony Stark",
          email: "tony.stark@avengers.com",
          role: "Engineer",
          status: "active",
        },
        {
          id: 4,
          userCode: "USR-004",
          userName: "Natasha Romanoff",
          email: "natasha.romanoff@avengers.com",
          role: "Security",
          status: "inactive",
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleAddNew = () => {
    console.log("Add new user");
  };

  const handleView = (item) => {
    console.log("View user:", item);
  };

  const handleEdit = (item) => {
    console.log("Edit user:", item);
  };

  return (
    <>
      <UIHeader header={headerTopic} />
      <div className="flex flex-col xl:flex-row items-center justify-center w-full h-fit gap-2">
        <div className="flex flex-col items-center justify-center w-full h-full p-2 gap-2 border-1 border-dark">
          <div className="flex items-center justify-start w-full p-2">
            Total Users
          </div>
          <div className="flex items-center justify-start w-full p-2 text-dark text-lg">
            120
          </div>
        </div>
        <div className="flex flex-col items-center justify-center w-full h-full p-2 gap-2 border-1 border-dark">
          <div className="flex items-center justify-start w-full p-2">
            Active Users
          </div>
          <div className="flex items-center justify-start w-full p-2 text-success text-lg">
            95
          </div>
        </div>
        <div className="flex flex-col items-center justify-center w-full h-full p-2 gap-2 border-1 border-dark">
          <div className="flex items-center justify-start w-full p-2">
            Inactive Users
          </div>
          <div className="flex items-center justify-start w-full p-2 text-danger text-lg">
            20
          </div>
        </div>
        <div className="flex flex-col items-center justify-center w-full h-full p-2 gap-2 border-1 border-dark">
          <div className="flex items-center justify-start w-full p-2">
            Suspended Users
          </div>
          <div className="flex items-center justify-start w-full p-2 text-warning text-lg">
            5
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-start w-full h-fit gap-2 overflow-auto">
        {loading ? (
          <div className="flex items-center justify-center w-full h-full p-2">
            <UILoading />
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={users}
            statusOptions={statusOptions}
            statusColorMap={statusColorMap}
            initialVisibleColumns={INITIAL_VISIBLE_COLUMNS}
            searchPlaceholder="Search by user name or email..."
            emptyContent="No users found"
            itemName="users"
            onAddNew={handleAddNew}
            onView={handleView}
            onEdit={handleEdit}
          />
        )}
      </div>
    </>
  );
}

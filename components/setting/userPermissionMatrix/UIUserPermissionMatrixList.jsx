"use client";
import React, { useState } from "react";
import UIHeader from "@/components/UIHeader";
import UILoading from "@/components/UILoading";
import { Button, Checkbox } from "@heroui/react";
import {
  useUserPermissionMatrix,
  saveUserPermissionMatrix,
} from "@/app/api/setting/userPermissionMatrix/hooks/useUserPermissionMatrix";
import { useSessionUser } from "@/hooks/useSessionUser";
import { showToast } from "@/components/UIToast";

const PermissionMatrixTable = ({
  permissions,
  matrix,
  onToggle,
  onSave,
  saving,
}) => {
  return (
    <div className="flex flex-col items-center justify-start w-full h-fit gap-4">
      <div className="w-full overflow-auto">
        <table className="table-auto border-collapse w-full text-sm">
          <thead>
            <tr>
              <th className="border p-2 text-left sticky left-0 bg-white">
                User
              </th>
              {permissions.map((permission) => (
                <th
                  key={permission.permissionId}
                  className="border p-2 text-center min-w-[120px]"
                >
                  {permission.permissionName}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {matrix.map((user, userIndex) => (
              <tr key={user.userId}>
                <td className="border p-2 sticky left-0 bg-white">
                  {user.userName}
                </td>
                {user.permissions.map((permission, permIndex) => (
                  <td
                    key={permission.permissionId}
                    className="border text-center p-2"
                  >
                    <div className="flex items-center justify-center">
                      <Checkbox
                        isSelected={permission.hasPermission}
                        onValueChange={() => onToggle(userIndex, permIndex)}
                        size="lg"
                        radius="none"
                        color="default"
                      />
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-end w-full h-fit p-2 gap-2">
        <Button
          color="success"
          radius="none"
          className="w-2/12 p-2 gap-2 text-white font-semibold"
          isLoading={saving}
          onPress={onSave}
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default function UIUserPermissionMatrix({ headerTopic }) {
  const { data, setData, loading } = useUserPermissionMatrix();
  const { permissions = [], matrix = [] } = data || {};
  const { userId } = useSessionUser();
  const [saving, setSaving] = useState(false);

  const togglePermission = (userIdx, permIdx) => {
    const clone = structuredClone(matrix);
    clone[userIdx].permissions[permIdx].hasPermission =
      !clone[userIdx].permissions[permIdx].hasPermission;
    setData({ ...data, matrix: clone });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const res = await saveUserPermissionMatrix(matrix, userId);
      if (res.message) {
        showToast("success", "Saved successfully");
      } else {
        showToast("danger", res.error || "Save failed");
      }
    } catch (error) {
      showToast("danger", "An error occurred while saving");
    } finally {
      setSaving(false);
    }
  };

  const totalUsers = matrix.length;
  const totalPermissions = permissions.length;
  const totalAssignments = matrix.reduce(
    (sum, user) => sum + user.permissions.filter((p) => p.hasPermission).length,
    0
  );

  return (
    <>
      <UIHeader header={headerTopic} />

      <div className="flex flex-col xl:flex-row items-center justify-center w-full h-fit gap-2">
        <div className="flex flex-col items-center justify-center w-full h-full p-2 gap-2 border-1 border-dark">
          <div className="flex items-center justify-start w-full h-full p-2 gap-2">
            Total Users
          </div>
          <div className="flex items-center justify-start w-full h-full p-2 gap-2 text-dark text-lg">
            {totalUsers}
          </div>
        </div>

        <div className="flex flex-col items-center justify-center w-full h-full p-2 gap-2 border-1 border-dark">
          <div className="flex items-center justify-start w-full h-full p-2 gap-2">
            Total Permissions
          </div>
          <div className="flex items-center justify-start w-full h-full p-2 gap-2 text-primary text-lg">
            {totalPermissions}
          </div>
        </div>

        <div className="flex flex-col items-center justify-center w-full h-full p-2 gap-2 border-1 border-dark">
          <div className="flex items-center justify-start w-full h-full p-2 gap-2">
            Active Assignments
          </div>
          <div className="flex items-center justify-start w-full h-full p-2 gap-2 text-success text-lg">
            {totalAssignments}
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-start w-full h-fit gap-2 overflow-auto">
        {loading ? (
          <div className="flex items-center justify-center w-full h-full p-2 gap-2">
            <UILoading />
          </div>
        ) : (
          <PermissionMatrixTable
            permissions={permissions}
            matrix={matrix}
            onToggle={togglePermission}
            onSave={handleSave}
            saving={saving}
          />
        )}
      </div>
    </>
  );
}

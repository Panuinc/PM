"use client";
import React, { useState } from "react";
import UILoading from "@/components/UILoading";
import { Button } from "@heroui/react";
import {
  useUserPermissionMatrix,
  saveUserPermissionMatrix,
} from "@/app/api/setting/userPermissionMatrix/hooks/useUserPermissionMatrix";
import { useSessionUser } from "@/hooks/useSessionUser";
import { showToast } from "@/components/UIToast";
import UIHeader from "@/components/UIHeader";

export default function UIUserPermissionMatrix({headerTopic}) {
  const { data, setData, loading } = useUserPermissionMatrix();
  const { permissions, matrix } = data;
  const { userId } = useSessionUser();
  const [saving, setSaving] = useState(false);

  const togglePermission = (userIdx, permIdx) => {
    const clone = structuredClone(matrix);
    clone[userIdx].permissions[permIdx].hasPermission =
      !clone[userIdx].permissions[permIdx].hasPermission;
    setData({ ...data, matrix: clone });
  };

  const handleSave = async () => {
    setSaving(true);
    const res = await saveUserPermissionMatrix(matrix, userId);
    if (res.message) showToast("success", "Saved successfully");
    else showToast("danger", res.error || "Save failed");
    setSaving(false);
  };

  if (loading) return <UILoading />;

  return (
    <div className="p-4 overflow-auto">
      <UIHeader header={headerTopic} />
      <table className="table-auto border-collapse w-full text-sm">
        <thead>
          <tr>
            <th className="border p-2 text-left">User</th>
            {permissions.map((p) => (
              <th key={p.permissionId} className="border p-2">
                {p.permissionName}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {matrix.map((user, uIdx) => (
            <tr key={user.userId}>
              <td className="border p-2">{user.userName}</td>
              {user.permissions.map((permission, pIdx) => (
                <td
                  key={permission.permissionId}
                  className="border text-center cursor-pointer select-none"
                  onClick={() => togglePermission(uIdx, pIdx)}
                >
                  {permission.hasPermission ? "✅" : "☐"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4 flex justify-end">
        <Button
          color="success"
          radius="none"
          isLoading={saving}
          onPress={handleSave}
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
}

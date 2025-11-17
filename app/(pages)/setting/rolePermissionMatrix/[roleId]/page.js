"use client";

import React, { useEffect, useState } from "react";
import UILoading from "@/components/UILoading";
import { Checkbox, Button } from "@heroui/react";
import { showToast } from "@/components/UIToast";
import { useRouter } from "next/navigation";
import { useSessionUser } from "@/hooks/useSessionUser";

export default function RolePermissionMatrixPage(props) {
  const { roleId } = React.use(props.params);
  const router = useRouter();
  const { userId: operatedBy } = useSessionUser();

  const [loading, setLoading] = useState(true);
  const [groups, setGroups] = useState([]);
  const [rolePermissions, setRolePermissions] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(
          `/api/setting/rolePermissionMatrix/${roleId}`,
          {
            headers: {
              "x-api-key": process.env.NEXT_PUBLIC_SECRET_TOKEN,
            },
          }
        );

        const raw = await res.text();
        if (!res.ok) throw new Error(raw);

        const data = JSON.parse(raw);
        setGroups(data.groups);

        const rp = data.role.rolePermissions.map(
          (rp) => rp.permission.permissionId
        );
        setRolePermissions(rp);
      } catch (err) {
        showToast("danger", err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [roleId]);

  if (loading) return <UILoading />;

  const toggle = (pid) => {
    setRolePermissions((prev) =>
      prev.includes(pid)
        ? prev.filter((x) => x !== pid)
        : [...prev, pid]
    );
  };

  const save = async () => {
    try {
      const res = await fetch(
        `/api/setting/rolePermissionMatrix/${roleId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.NEXT_PUBLIC_SECRET_TOKEN,
          },
          body: JSON.stringify({
            permissions: rolePermissions,
            operatedBy,
          }),
        }
      );

      const raw = await res.text();
      if (!res.ok) throw new Error(raw);

      showToast("success", "Saved!");
    } catch (err) {
      showToast("danger", err.message);
    }
  };

  return (
    <div className="p-4 flex flex-col gap-4 w-full">
      <h1 className="text-2xl font-bold">Role Permission Matrix</h1>

      {groups.map((group) => (
        <div
          key={group.permissionGroupId}
          className="border rounded-lg p-4"
        >
          <div className="text-xl font-semibold mb-3">
            {group.permissionGroupName}
          </div>

          {group.permissions.map((perm) => (
            <div
              key={perm.permissionId}
              className="flex justify-between items-center border-b py-2"
            >
              <div>{perm.permissionName}</div>

              <Checkbox
                isSelected={rolePermissions.includes(perm.permissionId)}
                onChange={() => toggle(perm.permissionId)}
              />
            </div>
          ))}
        </div>
      ))}

      <Button
        onPress={save}
        color="success"
        radius="none"
        className="w-fit px-6"
      >
        Save
      </Button>
    </div>
  );
}

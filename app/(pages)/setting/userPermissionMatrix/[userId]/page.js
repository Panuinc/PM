"use client";

import React, { useEffect, useState } from "react";
import UILoading from "@/components/UILoading";
import { Checkbox, Button } from "@heroui/react";
import { showToast } from "@/components/UIToast";
import { useRouter } from "next/navigation";
import { useSessionUser } from "@/hooks/useSessionUser";

export default function UserPermissionMatrixPage(props) {
  const { userId } = React.use(props.params);
  const router = useRouter();
  const { userId: operatedBy } = useSessionUser();

  const [loading, setLoading] = useState(true);
  const [groups, setGroups] = useState([]);
  const [inherited, setInherited] = useState([]);
  const [direct, setDirect] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(
          `/api/setting/userPermissionMatrix/${userId}`,
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
        setInherited(data.inherited);
        setDirect(data.direct);
      } catch (err) {
        showToast("danger", err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [userId]);

  if (loading) return <UILoading />;

  const toggle = (pid) => {
    if (inherited.includes(pid)) return;

    setDirect((prev) =>
      prev.includes(pid)
        ? prev.filter((x) => x !== pid)
        : [...prev, pid]
    );
  };

  const save = async () => {
    try {
      const res = await fetch(
        `/api/setting/userPermissionMatrix/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.NEXT_PUBLIC_SECRET_TOKEN,
          },
          body: JSON.stringify({
            directPermissions: direct,
            operatedBy,
          }),
        }
      );

      const raw = await res.text();
      if (!res.ok) throw new Error(raw);

      showToast("success", "Updated!");
    } catch (err) {
      showToast("danger", err.message);
    }
  };

  return (
    <div className="p-4 flex flex-col gap-4 w-full">
      <h1 className="text-2xl font-bold">User Permission Matrix</h1>

      {groups.map((group) => (
        <div
          key={group.permissionGroupId}
          className="border rounded-lg p-4"
        >
          <div className="text-xl font-semibold mb-3">
            {group.permissionGroupName}
          </div>

          {group.permissions.map((perm) => {
            const isInherited = inherited.includes(perm.permissionId);
            const isDirect = direct.includes(perm.permissionId);

            return (
              <div
                key={perm.permissionId}
                className="flex justify-between items-center border-b py-2"
              >
                <div
                  className={
                    isInherited
                      ? "text-blue-600"
                      : isDirect
                      ? "text-green-600"
                      : ""
                  }
                >
                  {perm.permissionName}
                </div>

                <Checkbox
                  isDisabled={isInherited}
                  isSelected={isInherited || isDirect}
                  onChange={() => toggle(perm.permissionId)}
                >
                  {isInherited && "(Inherited)"}
                </Checkbox>
              </div>
            );
          })}
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

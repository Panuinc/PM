"use client";
import UIHeader from "@/components/UIHeader";
import { Button, Checkbox } from "@heroui/react";

export default function UIAssignPermission({
  headerTopic,
  userName,
  targetUserFullName,
  total,
  selectedCount,
  permissions,
  selectedIds,
  handleToggle,
  handleSubmit,
  handleCancel,
}) {
  return (
    <>
      <UIHeader header={headerTopic} />

      <div className="flex flex-row items-center justify-between w-full h-fit p-2 gap-2">
        <div className="flex flex-col items-start justify-center w-full h-full p-2 gap-1">
          <div className="text-sm">
            Update By : <span className="font-semibold">{userName}</span>
          </div>
          <div className="text-xs text-default-500">
            User : <span className="font-semibold">{targetUserFullName}</span>
          </div>
        </div>

        <div className="flex flex-row items-center justify-end w-full h-full p-2 gap-4">
          <div className="text-sm">
            Total Permissions : <span className="font-semibold">{total}</span>
          </div>
          <div className="text-sm">
            Selected :{" "}
            <span className="font-semibold text-success">{selectedCount}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-start w-full h-full p-2 gap-2 overflow-auto">
        <div className="flex flex-col items-start justify-start w-full max-w-3xl h-fit p-4 gap-2 border-1 rounded-md">

          {permissions.map((p) => (
            <div
              key={p.permissionId}
              className="flex flex-row items-center justify-between w-full py-1"
            >
              <div className="flex-1">
                <Checkbox
                  isSelected={selectedIds.has(p.permissionId)}
                  onValueChange={(checked) => handleToggle(p.permissionId, checked)}
                  radius="none"
                >
                  <span className="font-mono text-sm">{p.permissionName}</span>
                </Checkbox>
              </div>
            </div>
          ))}

          {permissions.length === 0 && (
            <div className="text-sm text-default-500">
              No permissions defined.
            </div>
          )}
        </div>

        <div className="flex flex-row items-center justify-end w-full max-w-3xl h-fit p-2 gap-2">
          <div className="flex items-center justify-center w-full sm:w-2/12 h-full p-1">
            <Button
              type="button"
              color="primary"
              radius="none"
              className="w-full p-2 font-semibold"
              onPress={handleSubmit}
            >
              Save
            </Button>
          </div>

          <div className="flex items-center justify-center w-full sm:w-2/12 h-full p-1">
            <Button
              type="button"
              color="danger"
              radius="none"
              className="w-full p-2 font-semibold"
              onPress={handleCancel}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

"use client";
import UIHeader from "@/components/UIHeader";
import { Button, Checkbox } from "@heroui/react";

export default function UIAssignPermission({
  headerTopic,
  userName,
  total,
  selectedCount,
  permissions,
  selectedIds,
  handleToggle,
  handleSubmit,
  handleCancel,
}) {
  function groupPermissions(list) {
    const groups = {};

    list.forEach((p) => {
      const [category, action] = p.permissionName.split(".");

      const groupName = action ? category : "Other";

      if (!groups[groupName]) groups[groupName] = [];
      groups[groupName].push(p);
    });

    return groups;
  }
  const grouped = groupPermissions(permissions);

  return (
    <>
      <UIHeader header={headerTopic} />

      <div className="flex flex-col items-center justify-start w-full h-full gap-2 overflow-auto">
        <div className="flex flex-row items-center justify-center w-full h-fit p-2 gap-2">
          <div className="flex items-center justify-end w-full h-full p-2 gap-2">
            Update By : {userName}
          </div>
        </div>

        <div className="flex flex-row items-center justify-end w-full h-fit p-2 gap-2">
          <div className="flex items-center justify-center h-full p-2 gap-2">
            Total Permissions : {total}
          </div>
          <div className="flex items-center justify-center h-full p-2 gap-2">
            Selected : {selectedCount}
          </div>
        </div>

        <div className="flex flex-col items-center justify-center w-full h-fit gap-2">
          {Object.entries(grouped).map(([category, items]) => (
            <div key={category} className="w-full border-1 p-2 rounded-md">
              <div className="font-bold text-lg mb-2 capitalize">
                {category}
              </div>

              {items.map((p) => (
                <div
                  key={p.permissionId}
                  className="flex flex-row items-center justify-start w-full p-2 gap-2"
                >
                  <Checkbox
                    isSelected={selectedIds.has(p.permissionId)}
                    onValueChange={(checked) =>
                      handleToggle(p.permissionId, checked)
                    }
                    radius="none"
                  >
                    {p.permissionName}
                  </Checkbox>
                </div>
              ))}
            </div>
          ))}

          {permissions.length === 0 && (
            <div className="flex flex-row items-center justify-start w-full h-full p-2 gap-2">
              No permissions defined.
            </div>
          )}
        </div>

        <div className="flex flex-row items-center justify-end w-full h-fit p-2 gap-2">
          <div className="flex items-center justify-center w-full xl:w-2/12 h-full p-2 gap-2">
            <Button
              type="button"
              color="primary"
              radius="none"
              className="w-full p-2 gap-2 text-background font-semibold"
              onPress={handleSubmit}
            >
              Save
            </Button>
          </div>

          <div className="flex items-center justify-center w-full xl:w-2/12 h-full p-2 gap-2">
            <Button
              type="button"
              color="danger"
              radius="none"
              className="w-full p-2 gap-2 font-semibold"
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

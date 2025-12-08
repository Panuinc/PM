"use client";
import { useState } from "react";
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

  function sortCategories(categories) {
    const priority = ["menu", "admin"];
    return categories.sort((a, b) => {
      const ai = priority.indexOf(a);
      const bi = priority.indexOf(b);
      if (ai !== -1 && bi === -1) return -1;
      if (bi !== -1 && ai === -1) return 1;
      if (ai === -1 && bi === -1) return a.localeCompare(b);
      return ai - bi;
    });
  }

  const grouped = groupPermissions(permissions);
  const categories = sortCategories(Object.keys(grouped));
  const [activeCategory, setActiveCategory] = useState(categories[0] ?? null);

  return (
    <>
      <UIHeader header={headerTopic} />

      <div className="flex flex-col items-center justify-start w-full h-full gap-2 overflow-auto">
        <div className="flex flex-row items-center justify-end w-full h-fit p-2 gap-2">
          <div className="flex items-center justify-center h-full p-2 gap-2 bg-foreground text-background rounded-xl">
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

        <div className="flex flex-col xl:flex-row items-start justify-center w-full h-fit overflow-auto border-1 border-default rounded-xl">
          <div className="flex flex-col items-center justify-center w-full xl:w-3/12 h-fit p-2 gap-2 border-r-1 border-default">
            <div className="flex items-center justify-start w-full h-full p-2 gap-2 text-xl border-b-1 border-default">
              Categories
            </div>

            {categories.map((c) => (
              <div
                key={c}
                onClick={() => setActiveCategory(c)}
                className={`flex items-center justify-start w-full h-fit p-4 gap-2 ${
                  activeCategory === c
                    ? "bg-primary text-white rounded-xl"
                    : "hover:bg-default"
                }`}
              >
                {c}
              </div>
            ))}
          </div>

          <div className="flex flex-col items-center justify-center w-full xl:w-9/12 h-fit p-2 gap-2">
            <div className="flex items-center justify-start w-full h-full p-2 gap-2 text-xl border-b-1 border-default">
              {activeCategory}
            </div>

            {activeCategory &&
              grouped[activeCategory]?.map((p) => (
                <div
                  key={p.permissionId}
                  className="flex flex-row items-center justify-start w-full h-full p-2 gap-2"
                >
                  <Checkbox
                    isSelected={selectedIds.has(p.permissionId)}
                    onValueChange={(checked) =>
                      handleToggle(p.permissionId, checked)
                    }
                    size="lg"
                    className="text-background"
                  >
                    {p.permissionName}
                  </Checkbox>
                </div>
              ))}

            {(!activeCategory || grouped[activeCategory]?.length === 0) && (
              <div>No permissions in this category.</div>
            )}
          </div>
        </div>

        <div className="flex flex-row items-center justify-end w-full h-fit p-2 gap-2">
          <div className="flex items-center justify-center w-full xl:w-2/12 h-full p-2 gap-2">
            <Button
              type="button"
              color="primary"
              size="lg"
              className="w-full p-2 gap-2 text-background font-semibold"
              onPress={handleSubmit}
            >
              Save
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

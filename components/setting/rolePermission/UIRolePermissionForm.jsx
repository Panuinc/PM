"use client";
import UIHeader from "@/components/UIHeader";
import React from "react";
import { Button, Select, SelectItem } from "@heroui/react";

export default function UIRolePermissionForm({
  headerTopic,
  formHandler,
  mode,
  isUpdate,
  operatedBy,
  roles,
  permissions,
}) {
  const { formRef, formData, handleChange, handleSubmit, errors } = formHandler;

  return (
    <>
      <UIHeader header={headerTopic} />
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="flex flex-col items-center justify-start w-full h-full overflow-auto"
      >
        <div className="flex flex-col items-center justify-start w-full h-fit gap-2 overflow-auto">
          <div className="flex flex-row items-center justify-center w-full h-fit p-2 gap-2">
            <div className="flex items-center justify-end w-full h-full p-2 gap-2">
              {mode === "create"
                ? `Create By : ${operatedBy}`
                : `Update By : ${operatedBy}`}
            </div>
          </div>

          <div className="flex flex-col xl:flex-row items-center justify-center w-full h-fit p-2 gap-2">
            <div className="flex items-center justify-center w-full h-full p-2 gap-2">
              <Select
                name="rolePermissionRoleId"
                label="Role"
                labelPlacement="outside"
                placeholder="Select Role"
                color="default"
                variant="faded"
                radius="none"
                isRequired
                selectedKeys={
                  formData.rolePermissionRoleId
                    ? [formData.rolePermissionRoleId]
                    : []
                }
                onSelectionChange={(keys) =>
                  handleChange("rolePermissionRoleId")([...keys][0])
                }
                isInvalid={!!errors.rolePermissionRoleId}
                errorMessage={errors.rolePermissionRoleId}
              >
                {roles?.map((r) => (
                  <SelectItem key={r.roleId}>{r.roleName}</SelectItem>
                ))}
              </Select>
            </div>

            <div className="flex items-center justify-center w-full h-full p-2 gap-2">
              <Select
                name="rolePermissionPermissionId"
                label="Permission"
                labelPlacement="outside"
                placeholder="Select Permission"
                color="default"
                variant="faded"
                radius="none"
                isRequired
                selectedKeys={
                  formData.rolePermissionPermissionId
                    ? [formData.rolePermissionPermissionId]
                    : []
                }
                onSelectionChange={(keys) =>
                  handleChange("rolePermissionPermissionId")([...keys][0])
                }
                isInvalid={!!errors.rolePermissionPermissionId}
                errorMessage={errors.rolePermissionPermissionId}
              >
                {permissions?.map((p) => (
                  <SelectItem key={p.permissionId}>
                    {p.permissionName}
                  </SelectItem>
                ))}
              </Select>
            </div>
          </div>

          {isUpdate && (
            <div className="flex flex-col xl:flex-row items-center justify-end w-full h-fit p-2 gap-2">
              <div className="flex items-center justify-center w-full xl:w-6/12 h-full p-2 gap-2">
                <Select
                  name="rolePermissionStatus"
                  label="Status"
                  labelPlacement="outside"
                  placeholder="Please Select"
                  color="default"
                  variant="faded"
                  radius="none"
                  isRequired
                  selectedKeys={
                    formData.rolePermissionStatus
                      ? [formData.rolePermissionStatus]
                      : []
                  }
                  onSelectionChange={(keys) =>
                    handleChange("rolePermissionStatus")([...keys][0])
                  }
                  isInvalid={!!errors.rolePermissionStatus}
                  errorMessage={errors.rolePermissionStatus}
                >
                  <SelectItem key="Enable">Enable</SelectItem>
                  <SelectItem key="Disable">Disable</SelectItem>
                </Select>
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex flex-row items-center justify-end w-full h-fit p-2 gap-2">
            <div className="flex items-center justify-center w-full xl:w-2/12 h-full p-2 gap-2">
              <Button
                type="submit"
                color="success"
                radius="none"
                className="w-full p-2 gap-2 text-white font-semibold"
              >
                Submit
              </Button>
            </div>
            <div className="flex items-center justify-center w-full xl:w-2/12 h-full p-2 gap-2">
              <Button
                type="button"
                color="default"
                radius="none"
                className="w-full p-2 gap-2 font-semibold"
                onPress={() => history.back()}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}

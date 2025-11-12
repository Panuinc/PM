"use client";
import UIHeader from "@/components/UIHeader";
import React from "react";
import { Button, Select, SelectItem } from "@heroui/react";

export default function UIUserPermissionForm({
  headerTopic,
  formHandler,
  mode,
  isUpdate,
  operatedBy,
  permissions,
  users,
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
                name="userPermissionUserId"
                label="User"
                labelPlacement="outside"
                placeholder="Select User"
                color="default"
                variant="faded"
                radius="none"
                isRequired
                selectedKeys={
                  formData.userPermissionUserId
                    ? new Set([formData.userPermissionUserId])
                    : new Set()
                }
                onSelectionChange={(keys) => {
                  const key = Array.from(keys)[0];
                  handleChange("userPermissionUserId")(key);
                }}
                isInvalid={!!errors.userPermissionUserId}
                errorMessage={errors.userPermissionUserId}
              >
                {users?.map((u) => (
                  <SelectItem
                    key={u.userId}
                    textValue={`${u.userFirstName} ${u.userLastName}`}
                  >
                    {u.userFirstName} {u.userLastName}
                  </SelectItem>
                ))}
              </Select>
            </div>

            <div className="flex items-center justify-center w-full h-full p-2 gap-2">
              <Select
                name="userPermissionPermissionId"
                label="Permission"
                labelPlacement="outside"
                placeholder="Select Permission"
                color="default"
                variant="faded"
                radius="none"
                isRequired
                selectedKeys={
                  formData.userPermissionPermissionId ? [formData.userPermissionPermissionId] : []
                }
                onSelectionChange={(keys) =>
                  handleChange("userPermissionPermissionId")([...keys][0])
                }
                isInvalid={!!errors.userPermissionPermissionId}
                errorMessage={errors.userPermissionPermissionId}
              >
                {permissions?.map((r) => (
                  <SelectItem key={r.permissionId}>{r.permissionName}</SelectItem>
                ))}
              </Select>
            </div>
          </div>

          {isUpdate && (
            <div className="flex flex-col xl:flex-row items-center justify-end w-full h-fit p-2 gap-2">
              <div className="flex items-center justify-center w-full xl:w-6/12 h-full p-2 gap-2">
                <Select
                  name="userPermissionStatus"
                  label="User Permission Status"
                  labelPlacement="outside"
                  placeholder="Please Select"
                  color="default"
                  variant="faded"
                  radius="none"
                  isRequired
                  selectedKeys={
                    formData.userPermissionStatus ? [formData.userPermissionStatus] : []
                  }
                  onSelectionChange={(keys) =>
                    handleChange("userPermissionStatus")([...keys][0])
                  }
                  isInvalid={!!errors.userPermissionStatus}
                  errorMessage={errors.userPermissionStatus}
                >
                  <SelectItem key="Enable">Enable</SelectItem>
                  <SelectItem key="Disable">Disable</SelectItem>
                </Select>
              </div>
            </div>
          )}

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

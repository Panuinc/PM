"use client";
import UIHeader from "@/components/UIHeader";
import React from "react";
import { Button, Select, SelectItem } from "@heroui/react";

export default function UIUserRoleForm({
  headerTopic,
  formHandler,
  mode,
  isUpdate,
  operatedBy,
  roles,
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
                name="userRoleUserId"
                label="User"
                labelPlacement="outside"
                placeholder="Select User"
                color="default"
                variant="faded"
                radius="none"
                isRequired
                selectedKeys={
                  formData.userRoleUserId
                    ? new Set([formData.userRoleUserId])
                    : new Set()
                }
                onSelectionChange={(keys) => {
                  const key = Array.from(keys)[0];
                  handleChange("userRoleUserId")(key);
                }}
                isInvalid={!!errors.userRoleUserId}
                errorMessage={errors.userRoleUserId}
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
                name="userRoleRoleId"
                label="Role"
                labelPlacement="outside"
                placeholder="Select Role"
                color="default"
                variant="faded"
                radius="none"
                isRequired
                selectedKeys={
                  formData.userRoleRoleId ? [formData.userRoleRoleId] : []
                }
                onSelectionChange={(keys) =>
                  handleChange("userRoleRoleId")([...keys][0])
                }
                isInvalid={!!errors.userRoleRoleId}
                errorMessage={errors.userRoleRoleId}
              >
                {roles?.map((r) => (
                  <SelectItem key={r.roleId}>{r.roleName}</SelectItem>
                ))}
              </Select>
            </div>
          </div>

          {isUpdate && (
            <div className="flex flex-col xl:flex-row items-center justify-end w-full h-fit p-2 gap-2">
              <div className="flex items-center justify-center w-full xl:w-6/12 h-full p-2 gap-2">
                <Select
                  name="userRoleStatus"
                  label="User Role Status"
                  labelPlacement="outside"
                  placeholder="Please Select"
                  color="default"
                  variant="faded"
                  radius="none"
                  isRequired
                  selectedKeys={
                    formData.userRoleStatus ? [formData.userRoleStatus] : []
                  }
                  onSelectionChange={(keys) =>
                    handleChange("userRoleStatus")([...keys][0])
                  }
                  isInvalid={!!errors.userRoleStatus}
                  errorMessage={errors.userRoleStatus}
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

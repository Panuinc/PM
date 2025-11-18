"use client";
import UIHeader from "@/components/UIHeader";
import React from "react";
import { Button, Input, Select, SelectItem } from "@heroui/react";

export default function UIUserForm({
  headerTopic,
  formHandler,
  mode,
  isUpdate,
  operatedBy,
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
              <Input
                name="userFirstName"
                type="text"
                label="User Firstname"
                color="default"
                variant="faded"
                radius="none"
                labelPlacement="outside"
                placeholder="Enter User Firstname"
                isRequired
                value={formData.userFirstName}
                onChange={handleChange("userFirstName")}
                isInvalid={!!errors.userFirstName}
                errorMessage={errors.userFirstName}
              />
            </div>
            <div className="flex items-center justify-center w-full h-full p-2 gap-2">
              <Input
                name="userLastName"
                type="text"
                label="User Lastname"
                color="default"
                variant="faded"
                radius="none"
                labelPlacement="outside"
                placeholder="Enter User Lastname"
                isRequired
                value={formData.userLastName}
                onChange={handleChange("userLastName")}
                isInvalid={!!errors.userLastName}
                errorMessage={errors.userLastName}
              />
            </div>
          </div>

          <div className="flex flex-col xl:flex-row items-center justify-center w-full h-fit p-2 gap-2">
            <div className="flex items-center justify-center w-full h-full p-2 gap-2">
              <Input
                name="userEmail"
                type="email"
                label="User Email"
                color="default"
                variant="faded"
                radius="none"
                labelPlacement="outside"
                placeholder="Enter User Email"
                isRequired
                value={formData.userEmail}
                onChange={handleChange("userEmail")}
                isInvalid={!!errors.userEmail}
                errorMessage={errors.userEmail}
              />
            </div>
            {!isUpdate && (
              <div className="flex items-center justify-center w-full h-full p-2 gap-2">
                <Input
                  name="userPassword"
                  type="password"
                  label="User Password"
                  color="default"
                  variant="faded"
                  radius="none"
                  labelPlacement="outside"
                  placeholder="Enter Password"
                  isRequired
                  value={formData.userPassword}
                  onChange={handleChange("userPassword")}
                  isInvalid={!!errors.userPassword}
                  errorMessage={errors.userPassword}
                />
              </div>
            )}
          </div>

          {isUpdate && (
            <div className="flex flex-col xl:flex-row items-center justify-end w-full h-fit p-2 gap-2">
              <div className="flex items-center justify-center w-full xl:w-6/12 h-full p-2 gap-2">
                <Select
                  name="userStatus"
                  label="User Status"
                  labelPlacement="outside"
                  placeholder="Please Select"
                  color="default"
                  variant="faded"
                  radius="none"
                  isRequired
                  selectedKeys={
                    formData.userStatus ? [formData.userStatus] : []
                  }
                  onSelectionChange={(keys) =>
                    handleChange("userStatus")([...keys][0])
                  }
                  isInvalid={!!errors.userStatus}
                  errorMessage={errors.userStatus}
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

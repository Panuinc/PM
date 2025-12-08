"use client";
import UIHeader from "@/components/UIHeader";
import React from "react";
import { Button, Input, Select, SelectItem } from "@heroui/react";

export default function UIDepartmentForm({
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
          <div className="flex flex-row items-center justify-end w-full h-fit p-2 gap-2">
            <div className="flex items-center justify-center h-full p-2 gap-2 bg-foreground text-background rounded-xl">
              {mode === "create"
                ? `Create By : ${operatedBy}`
                : `Update By : ${operatedBy}`}
            </div>
          </div>

          <div className="flex flex-col xl:flex-row items-center justify-center w-full h-fit p-2 gap-2">
            <div className="flex items-center justify-center w-full h-full p-2 gap-2">
              <Input
                name="departmentName"
                type="text"
                label="Department Name"
                color="default"
                variant="faded"
                size="lg"
                labelPlacement="outside"
                placeholder="Enter Department Name"
                isRequired
                value={formData.departmentName}
                onChange={handleChange("departmentName")}
                isInvalid={!!errors.departmentName}
                errorMessage={errors.departmentName}
              />
            </div>
          </div>

          {isUpdate && (
            <div className="flex flex-col xl:flex-row items-center justify-end w-full h-fit p-2 gap-2">
              <div className="flex items-center justify-center w-full xl:w-6/12 h-full p-2 gap-2">
                <Select
                  name="departmentStatus"
                  label="Department Status"
                  labelPlacement="outside"
                  placeholder="Please Select"
                  color="default"
                  variant="faded"
                  size="lg"
                  isRequired
                  selectedKeys={
                    formData.departmentStatus ? [formData.departmentStatus] : []
                  }
                  onSelectionChange={(keys) =>
                    handleChange("departmentStatus")([...keys][0])
                  }
                  isInvalid={!!errors.departmentStatus}
                  errorMessage={errors.departmentStatus}
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
                color="primary"
                size="lg"
                className="w-full p-2 gap-2 text-background font-semibold"
              >
                Submit
              </Button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}

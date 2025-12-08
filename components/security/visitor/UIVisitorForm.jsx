"use client";
import UIHeader from "@/components/UIHeader";
import React from "react";
import { Button, Input, Select, SelectItem } from "@heroui/react";

export default function UIVisitorForm({
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
            <div className="flex items-center justify-center h-full p-2 gap-2 bg-foreground text-background rounded-xl border-1 border-foreground">
              {mode === "create"
                ? `Create By : ${operatedBy}`
                : `Update By : ${operatedBy}`}
            </div>
          </div>

          <div className="flex flex-col xl:flex-row items-center justify-center w-full h-fit p-2 gap-2">
            <div className="flex items-center justify-center w-full h-full p-2 gap-2">
              <Input
                name="visitorName"
                type="text"
                label="Visitor Name"
                color="default"
                variant="faded"
                size="lg"
                labelPlacement="outside"
                placeholder="Enter Visitor Name"
                isRequired
                value={formData.visitorName}
                onChange={handleChange("visitorName")}
                isInvalid={!!errors.visitorName}
                errorMessage={errors.visitorName}
              />
            </div>
          </div>

          {isUpdate && (
            <div className="flex flex-col xl:flex-row items-center justify-end w-full h-fit p-2 gap-2">
              <div className="flex items-center justify-center w-full xl:w-6/12 h-full p-2 gap-2">
                <Select
                  name="visitorStatus"
                  label="Visitor Status"
                  labelPlacement="outside"
                  placeholder="Please Select"
                  color="default"
                  variant="faded"
                  size="lg"
                  isRequired
                  selectedKeys={
                    formData.visitorStatus ? [formData.visitorStatus] : []
                  }
                  onSelectionChange={(keys) =>
                    handleChange("visitorStatus")([...keys][0])
                  }
                  isInvalid={!!errors.visitorStatus}
                  errorMessage={errors.visitorStatus}
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

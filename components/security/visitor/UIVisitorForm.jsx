"use client";
import UIHeader from "@/components/UIHeader";
import React from "react";
import { Button, Input, Select, SelectItem, Textarea } from "@heroui/react";

const contactReasonOptions = [
  { key: "Shipping", label: "Shipping" },
  { key: "BillingChequeCollection", label: "Billing / Cheque Collection" },
  { key: "JobApplication", label: "Job Application" },
  { key: "ProductPresentation", label: "Product Presentation" },
  { key: "Meeting", label: "Meeting" },
  { key: "Other", label: "Other" },
];

const visitorStatusOptions = [
  { key: "CheckIn", label: "Check In" },
  { key: "Confirmed", label: "Confirmed" },
  { key: "CheckOut", label: "Check Out" },
];

export default function UIVisitorForm({
  headerTopic,
  formHandler,
  mode,
  isUpdate,
  operatedBy,
  contactUsers = [],
}) {
  const { formRef, formData, handleChange, handleSubmit, errors } = formHandler;

  const availableContactUsers = contactUsers.filter(
    (user) => user.userStatus === "Enable"
  );

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

          {/* Visitor Name */}
          <div className="flex flex-col xl:flex-row items-center justify-center w-full h-fit p-2 gap-2">
            <div className="flex items-center justify-center w-full h-full p-2 gap-2">
              <Input
                name="visitorFirstName"
                type="text"
                label="First Name"
                color="default"
                variant="faded"
                size="lg"
                labelPlacement="outside"
                placeholder="Enter First Name"
                isRequired
                value={formData.visitorFirstName}
                onChange={handleChange("visitorFirstName")}
                isInvalid={!!errors.visitorFirstName}
                errorMessage={errors.visitorFirstName}
              />
            </div>
            <div className="flex items-center justify-center w-full h-full p-2 gap-2">
              <Input
                name="visitorLastName"
                type="text"
                label="Last Name"
                color="default"
                variant="faded"
                size="lg"
                labelPlacement="outside"
                placeholder="Enter Last Name"
                isRequired
                value={formData.visitorLastName}
                onChange={handleChange("visitorLastName")}
                isInvalid={!!errors.visitorLastName}
                errorMessage={errors.visitorLastName}
              />
            </div>
          </div>

          {/* Company */}
          <div className="flex flex-col xl:flex-row items-center justify-center w-full h-fit p-2 gap-2">
            <div className="flex items-center justify-center w-full h-full p-2 gap-2">
              <Input
                name="visitorCompany"
                type="text"
                label="Company"
                color="default"
                variant="faded"
                size="lg"
                labelPlacement="outside"
                placeholder="Enter Company Name"
                isRequired
                value={formData.visitorCompany}
                onChange={handleChange("visitorCompany")}
                isInvalid={!!errors.visitorCompany}
                errorMessage={errors.visitorCompany}
              />
            </div>
          </div>

          {/* Car Registration & Province */}
          <div className="flex flex-col xl:flex-row items-center justify-center w-full h-fit p-2 gap-2">
            <div className="flex items-center justify-center w-full h-full p-2 gap-2">
              <Input
                name="visitorCarRegistration"
                type="text"
                label="Car Registration"
                color="default"
                variant="faded"
                size="lg"
                labelPlacement="outside"
                placeholder="Enter Car Registration (e.g., กข 1234)"
                isRequired
                value={formData.visitorCarRegistration}
                onChange={handleChange("visitorCarRegistration")}
                isInvalid={!!errors.visitorCarRegistration}
                errorMessage={errors.visitorCarRegistration}
              />
            </div>
            <div className="flex items-center justify-center w-full h-full p-2 gap-2">
              <Input
                name="visitorProvince"
                type="text"
                label="Province"
                color="default"
                variant="faded"
                size="lg"
                labelPlacement="outside"
                placeholder="Enter Province"
                isRequired
                value={formData.visitorProvince}
                onChange={handleChange("visitorProvince")}
                isInvalid={!!errors.visitorProvince}
                errorMessage={errors.visitorProvince}
              />
            </div>
          </div>

          {/* Contact Person & Reason */}
          <div className="flex flex-col xl:flex-row items-center justify-center w-full h-fit p-2 gap-2">
            <div className="flex items-center justify-center w-full h-full p-2 gap-2">
              <Select
                name="visitorContactUserId"
                label="Contact Person"
                labelPlacement="outside"
                placeholder="Select Contact Person"
                color="default"
                variant="faded"
                size="lg"
                isRequired
                selectedKeys={
                  formData.visitorContactUserId
                    ? [formData.visitorContactUserId]
                    : []
                }
                onSelectionChange={(keys) =>
                  handleChange("visitorContactUserId")([...keys][0] || "")
                }
                isInvalid={!!errors.visitorContactUserId}
                errorMessage={errors.visitorContactUserId}
              >
                {availableContactUsers.map((user) => (
                  <SelectItem key={user.userId}>
                    {`${user.userFirstName} ${user.userLastName}`}
                  </SelectItem>
                ))}
              </Select>
            </div>
            <div className="flex items-center justify-center w-full h-full p-2 gap-2">
              <Select
                name="visitorContactReason"
                label="Contact Reason"
                labelPlacement="outside"
                placeholder="Select Reason"
                color="default"
                variant="faded"
                size="lg"
                isRequired
                selectedKeys={
                  formData.visitorContactReason
                    ? [formData.visitorContactReason]
                    : []
                }
                onSelectionChange={(keys) =>
                  handleChange("visitorContactReason")([...keys][0] || "")
                }
                isInvalid={!!errors.visitorContactReason}
                errorMessage={errors.visitorContactReason}
              >
                {contactReasonOptions.map((option) => (
                  <SelectItem key={option.key}>{option.label}</SelectItem>
                ))}
              </Select>
            </div>
          </div>

          {/* Photo URLs */}
          <div className="flex flex-col xl:flex-row items-center justify-center w-full h-fit p-2 gap-2">
            <div className="flex items-center justify-center w-full h-full p-2 gap-2">
              <Input
                name="visitorPhoto"
                type="text"
                label="Visitor Photo URL"
                color="default"
                variant="faded"
                size="lg"
                labelPlacement="outside"
                placeholder="Enter Photo URL or upload path"
                isRequired
                value={formData.visitorPhoto}
                onChange={handleChange("visitorPhoto")}
                isInvalid={!!errors.visitorPhoto}
                errorMessage={errors.visitorPhoto}
              />
            </div>
          </div>

          <div className="flex flex-col xl:flex-row items-center justify-center w-full h-fit p-2 gap-2">
            <div className="flex items-center justify-center w-full h-full p-2 gap-2">
              <Textarea
                name="visitorDocumentPhotos"
                label="Document Photos"
                color="default"
                variant="faded"
                size="lg"
                labelPlacement="outside"
                placeholder="Enter Document Photo URLs (comma separated)"
                isRequired
                value={formData.visitorDocumentPhotos}
                onChange={handleChange("visitorDocumentPhotos")}
                isInvalid={!!errors.visitorDocumentPhotos}
                errorMessage={errors.visitorDocumentPhotos}
              />
            </div>
          </div>

          {/* Status (Update only) */}
          {isUpdate && (
            <div className="flex flex-col xl:flex-row items-center justify-end w-full h-fit p-2 gap-2">
              <div className="flex items-center justify-center w-full xl:w-6/12 h-full p-2 gap-2">
                <Select
                  name="visitorStatus"
                  label="Visitor Status"
                  labelPlacement="outside"
                  placeholder="Select Status"
                  color="default"
                  variant="faded"
                  size="lg"
                  isRequired
                  selectedKeys={
                    formData.visitorStatus ? [formData.visitorStatus] : []
                  }
                  onSelectionChange={(keys) =>
                    handleChange("visitorStatus")([...keys][0] || "")
                  }
                  isInvalid={!!errors.visitorStatus}
                  errorMessage={errors.visitorStatus}
                >
                  {visitorStatusOptions.map((option) => (
                    <SelectItem key={option.key}>{option.label}</SelectItem>
                  ))}
                </Select>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex flex-row items-center justify-end w-full h-fit p-2 gap-2">
            <div className="flex items-center justify-center w-full xl:w-2/12 h-full p-2 gap-2">
              <Button
                type="submit"
                color="primary"
                size="lg"
                className="w-full p-2 gap-2 text-background font-semibold"
              >
                {mode === "create" ? "Check In" : "Update"}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}

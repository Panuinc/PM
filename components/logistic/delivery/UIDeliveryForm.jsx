"use client";
import UIHeader from "@/components/UIHeader";
import React from "react";
import { Button, Input, Select, SelectItem, Textarea } from "@heroui/react";
import { Plus, Trash2 } from "lucide-react";

export default function UIDeliveryForm({
  headerTopic,
  formHandler,
  mode,
  isUpdate,
  operatedBy,
}) {
  const { formRef, formData, handleChange, handleSubmit, errors } = formHandler;

  const deliveryReturns = formData.deliveryReturns || [];

  const handleAddReturn = () => {
    const newReturn = {
      deliveryReturnCode: "",
      deliveryReturnQuantity: "",
      deliveryReturnRemark: "",
    };
    handleChange("deliveryReturns")([...deliveryReturns, newReturn]);
  };

  const handleRemoveReturn = (index) => {
    const updated = deliveryReturns.filter((_, i) => i !== index);
    handleChange("deliveryReturns")(updated);
  };

  const handleReturnChange = (index, field, value) => {
    const updated = deliveryReturns.map((item, i) => {
      if (i === index) {
        return { ...item, [field]: value };
      }
      return item;
    });
    handleChange("deliveryReturns")(updated);
  };

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
                name="deliveryInvoiceNumber"
                type="text"
                label="Invoice Number"
                color="default"
                variant="faded"
                radius="none"
                labelPlacement="outside"
                placeholder="Enter Invoice Number"
                isRequired
                value={formData.deliveryInvoiceNumber || ""}
                onChange={handleChange("deliveryInvoiceNumber")}
                isInvalid={!!errors.deliveryInvoiceNumber}
                errorMessage={errors.deliveryInvoiceNumber}
              />
            </div>
            <div className="flex items-center justify-center w-full h-full p-2 gap-2">
              <Input
                name="deliveryLocation"
                type="text"
                label="Location"
                color="default"
                variant="faded"
                radius="none"
                labelPlacement="outside"
                placeholder="Enter Location"
                isRequired
                value={formData.deliveryLocation || ""}
                onChange={handleChange("deliveryLocation")}
                isInvalid={!!errors.deliveryLocation}
                errorMessage={errors.deliveryLocation}
              />
            </div>
          </div>

          <div className="flex flex-col xl:flex-row items-center justify-center w-full h-fit p-2 gap-2">
            <div className="flex items-center justify-center w-full h-full p-2 gap-2">
              <Input
                name="deliveryPicture"
                type="text"
                label="Picture URL"
                color="default"
                variant="faded"
                radius="none"
                labelPlacement="outside"
                placeholder="Enter Picture URL"
                isRequired
                value={formData.deliveryPicture || ""}
                onChange={handleChange("deliveryPicture")}
                isInvalid={!!errors.deliveryPicture}
                errorMessage={errors.deliveryPicture}
              />
            </div>
          </div>

          {isUpdate && (
            <div className="flex flex-col xl:flex-row items-center justify-end w-full h-fit p-2 gap-2">
              <div className="flex items-center justify-center w-full xl:w-6/12 h-full p-2 gap-2">
                <Select
                  name="deliveryStatus"
                  label="Delivery Status"
                  labelPlacement="outside"
                  placeholder="Please Select"
                  color="default"
                  variant="faded"
                  radius="none"
                  isRequired
                  selectedKeys={
                    formData.deliveryStatus ? [formData.deliveryStatus] : []
                  }
                  onSelectionChange={(keys) =>
                    handleChange("deliveryStatus")([...keys][0])
                  }
                  isInvalid={!!errors.deliveryStatus}
                  errorMessage={errors.deliveryStatus}
                >
                  <SelectItem key="PendingApprove">Pending Approve</SelectItem>
                  <SelectItem key="Approved">Approved</SelectItem>
                </Select>
              </div>
            </div>
          )}

          <div className="flex flex-col items-center justify-start w-full h-fit p-2 gap-2">
            <div className="flex flex-col items-end justify-center w-full h-fit p-2 gap-2">
              <div className="flex items-center justify-start w-full h-full p-2 gap-2">
                Delivery Returns
              </div>
              <div className="flex items-center justify-center w-full xl:w-2/12 h-full p-2 gap-2">
                <Button
                  type="submit"
                  color="primary"
                  radius="none"
                  className="w-full p-2 gap-2 text-background font-semibold"
                  onPress={handleAddReturn}
                  startContent={<Plus size={16} />}
                >
                  Add Return
                </Button>
              </div>
            </div>

            {deliveryReturns.length > 0 && (
              <div className="flex flex-col items-center justify-start w-full h-fit gap-4">
                {deliveryReturns.map((returnItem, index) => (
                  <div
                    key={returnItem.deliveryReturnId || index}
                    className="flex flex-col items-center justify-start w-full h-fit p-4 gap-2 border-1 rounded"
                  >
                    <div className="flex flex-row items-center justify-between w-full h-fit">
                      <div className="text-sm font-medium">
                        Items Return {index + 1}
                      </div>
                      <Button
                        type="button"
                        color="none"
                        radius="none"
                        isIconOnly
                        className="text-danger"
                        onPress={() => handleRemoveReturn(index)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>

                    <div className="flex flex-col xl:flex-row items-center justify-center w-full h-fit gap-2">
                      <div className="flex items-center justify-center w-full h-full gap-2">
                        <Input
                          name={`deliveryReturnCode_${index}`}
                          type="text"
                          label="Return Code"
                          color="default"
                          variant="faded"
                          radius="none"
                          labelPlacement="outside"
                          placeholder="Enter Return Code"
                          isRequired
                          value={returnItem.deliveryReturnCode || ""}
                          onChange={(e) =>
                            handleReturnChange(
                              index,
                              "deliveryReturnCode",
                              e.target.value
                            )
                          }
                        />
                      </div>
                      <div className="flex items-center justify-center w-full h-full gap-2">
                        <Input
                          name={`deliveryReturnQuantity_${index}`}
                          type="number"
                          label="Quantity"
                          color="default"
                          variant="faded"
                          radius="none"
                          labelPlacement="outside"
                          placeholder="Enter Quantity"
                          isRequired
                          value={returnItem.deliveryReturnQuantity || ""}
                          onChange={(e) =>
                            handleReturnChange(
                              index,
                              "deliveryReturnQuantity",
                              parseInt(e.target.value) || ""
                            )
                          }
                        />
                      </div>
                    </div>

                    <div className="flex flex-col xl:flex-row items-center justify-center w-full h-fit gap-2">
                      <div className="flex items-center justify-center w-full h-full gap-2">
                        <Textarea
                          name={`deliveryReturnRemark_${index}`}
                          label="Remark"
                          color="default"
                          variant="faded"
                          radius="none"
                          labelPlacement="outside"
                          placeholder="Enter Remark (Optional)"
                          value={returnItem.deliveryReturnRemark || ""}
                          onChange={(e) =>
                            handleReturnChange(
                              index,
                              "deliveryReturnRemark",
                              e.target.value
                            )
                          }
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {deliveryReturns.length === 0 && (
              <div className="flex items-center justify-center w-full h-20 p-2 gap-2 border-1 border-dashed text-gray-400">
                No delivery returns added
              </div>
            )}
          </div>

          <div className="flex flex-row items-center justify-end w-full h-fit p-2 gap-2">
            <div className="flex items-center justify-center w-full xl:w-2/12 h-full p-2 gap-2">
              <Button
                type="submit"
                color="primary"
                radius="none"
                className="w-full p-2 gap-2 text-background font-semibold"
              >
                Submit
              </Button>
            </div>
            <div className="flex items-center justify-center w-full xl:w-2/12 h-full p-2 gap-2">
              <Button
                type="button"
                color="danger"
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

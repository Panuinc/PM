"use client";
import UIHeader from "@/components/UIHeader";
import React, { useState, useRef, useEffect } from "react";
import {
  Button,
  Input,
  Select,
  SelectItem,
  Textarea,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Image,
} from "@heroui/react";
import { Plus, Trash2, MapPin, Camera, X, RotateCcw } from "lucide-react";

export default function UIDeliveryForm({
  headerTopic,
  formHandler,
  mode,
  isUpdate,
  operatedBy,
}) {
  const { formRef, formData, handleChange, handleSubmit, errors } = formHandler;

  const deliveryReturns = formData.deliveryReturns || [];

  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [locationError, setLocationError] = useState("");

  const { isOpen, onOpen, onClose } = useDisclosure();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [cameraError, setCameraError] = useState("");
  const [facingMode, setFacingMode] = useState("environment");
  const [localPreviewUrl, setLocalPreviewUrl] = useState("");

  useEffect(() => {
    return () => {
      if (localPreviewUrl) URL.revokeObjectURL(localPreviewUrl);
    };
  }, [localPreviewUrl]);

  useEffect(() => {
    if (!isOpen && stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  }, [isOpen, stream]);

  const getCurrentLocation = () => {
    setIsLoadingLocation(true);
    setLocationError("");

    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      setIsLoadingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
            {
              headers: {
                "Accept-Language": "th,en",
              },
            }
          );
          const data = await response.json();

          if (data.display_name) {
            handleChange("deliveryLocation")(data.display_name);
          } else {
            handleChange("deliveryLocation")(`${latitude}, ${longitude}`);
          }
        } catch {
          handleChange("deliveryLocation")(`${latitude}, ${longitude}`);
        }

        setIsLoadingLocation(false);
      },
      (error) => {
        let errorMessage = "Unable to retrieve your location";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage =
              "Location permission denied. Please enable location access.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable.";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out.";
            break;
        }
        setLocationError(errorMessage);
        setIsLoadingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const startCamera = async () => {
    setCameraError("");
    setCapturedImage(null);

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      setStream(mediaStream);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      let errorMessage = "Unable to access camera";
      if (error.name === "NotAllowedError") {
        errorMessage = "Camera permission denied. Please enable camera access.";
      } else if (error.name === "NotFoundError") {
        errorMessage = "No camera found on this device.";
      } else if (error.name === "NotReadableError") {
        errorMessage = "Camera is already in use by another application.";
      }
      setCameraError(errorMessage);
    }
  };

  const switchCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    setFacingMode((prev) => (prev === "environment" ? "user" : "environment"));
  };

  useEffect(() => {
    if (isOpen && !capturedImage) {
      startCamera();
    }
  }, [facingMode, isOpen]);

  const openCamera = () => {
    onOpen();
    setTimeout(() => {
      startCamera();
    }, 100);
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageDataUrl = canvas.toDataURL("image/jpeg", 0.8);
    setCapturedImage(imageDataUrl);

    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    setCameraError("");
    startCamera();
  };

  const confirmPhoto = async () => {
    if (!capturedImage) return;

    const invoiceNumber = formData.deliveryInvoiceNumber?.trim();
    if (!invoiceNumber) {
      setCameraError("Please enter Invoice Number before taking a photo.");
      return;
    }

    try {
      const response = await fetch(capturedImage);
      const blob = await response.blob();

      const safeInvoiceNumber = invoiceNumber.replace(/[^a-zA-Z0-9-_]/g, "_");
      const fileName = `${safeInvoiceNumber}.jpg`;

      const file = new File([blob], fileName, { type: "image/jpeg" });

      if (localPreviewUrl) URL.revokeObjectURL(localPreviewUrl);

      const previewUrl = URL.createObjectURL(file);
      setLocalPreviewUrl(previewUrl);

      handleChange("deliveryFile")(file);
      handleChange("deliveryPicture")(previewUrl);

      onClose();
    } catch {
      setCameraError("Failed to prepare photo. Please try again.");
    }
  };

  const handleCloseModal = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setCapturedImage(null);
    setCameraError("");
    onClose();
  };

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
          </div>

          <div className="flex flex-col xl:flex-row items-end justify-center w-full h-fit p-2 gap-2">
            <div className="flex items-center justify-center w-full h-full p-2 gap-2">
              <Input
                name="deliveryLocation"
                type="text"
                label="Location"
                color="default"
                variant="faded"
                radius="none"
                labelPlacement="outside"
                placeholder="Enter Location or Get Current Location"
                isRequired
                value={formData.deliveryLocation || ""}
                onChange={handleChange("deliveryLocation")}
                isInvalid={!!errors.deliveryLocation || !!locationError}
                errorMessage={errors.deliveryLocation || locationError}
              />
            </div>
            <div className="flex items-end justify-center w-full xl:w-2/12 h-full p-2 gap-2">
              <Button
                type="button"
                color="secondary"
                radius="none"
                className="w-full p-2 gap-2 font-semibold"
                onPress={getCurrentLocation}
                isLoading={isLoadingLocation}
                startContent={!isLoadingLocation && <MapPin size={16} />}
              >
                {isLoadingLocation ? "Getting..." : "Get Location"}
              </Button>
            </div>
          </div>

          <div className="flex flex-col xl:flex-row items-end justify-center w-full h-fit p-2 gap-2">
            <div className="flex items-end justify-center w-full xl:w-2/12 h-full p-2 gap-2">
              <Button
                type="button"
                color="secondary"
                radius="none"
                className="w-full p-2 gap-2 font-semibold"
                onPress={openCamera}
                startContent={<Camera size={16} />}
              >
                Take Photo
              </Button>
            </div>
          </div>

          {formData.deliveryPicture && (
            <div className="flex flex-col items-center justify-center w-full h-fit p-2 gap-2">
              <div className="flex items-center justify-start w-full h-full p-2 gap-2 text-sm text-gray-500">
                Current Picture Preview:
              </div>
              <div className="flex items-center justify-center w-full xl:w-6/12 h-fit p-2 gap-2">
                <Image
                  src={formData.deliveryPicture}
                  alt="Delivery Picture"
                  className="max-h-64 object-contain rounded"
                  fallbackSrc="https://via.placeholder.com/300x200?text=Image+Not+Found"
                />
              </div>
            </div>
          )}

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
                  type="button"
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
                              parseInt(e.target.value, 10) || ""
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

      <Modal
        isOpen={isOpen}
        onClose={handleCloseModal}
        size="2xl"
        scrollBehavior="inside"
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">Take Photo</ModalHeader>
          <ModalBody>
            <div className="flex flex-col items-center justify-center w-full gap-4">
              {cameraError && (
                <div className="w-full p-4 bg-danger-100 text-danger rounded">
                  {cameraError}
                </div>
              )}

              {!capturedImage ? (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full max-h-96 bg-black rounded"
                  />
                  <canvas ref={canvasRef} className="hidden" />
                </>
              ) : (
                <img
                  src={capturedImage}
                  alt="Captured"
                  className="w-full max-h-96 object-contain rounded"
                />
              )}
            </div>
          </ModalBody>
          <ModalFooter>
            {!capturedImage ? (
              <>
                <Button
                  color="default"
                  variant="light"
                  onPress={switchCamera}
                  startContent={<RotateCcw size={16} />}
                >
                  Switch Camera
                </Button>
                <Button
                  color="primary"
                  onPress={capturePhoto}
                  startContent={<Camera size={16} />}
                  isDisabled={!stream}
                >
                  Capture
                </Button>
                <Button
                  color="danger"
                  variant="light"
                  onPress={handleCloseModal}
                  startContent={<X size={16} />}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Button
                  color="default"
                  variant="light"
                  onPress={retakePhoto}
                  startContent={<RotateCcw size={16} />}
                >
                  Retake
                </Button>
                <Button color="primary" onPress={confirmPhoto}>
                  Confirm (Use on Submit)
                </Button>
                <Button
                  color="danger"
                  variant="light"
                  onPress={handleCloseModal}
                  startContent={<X size={16} />}
                >
                  Cancel
                </Button>
              </>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

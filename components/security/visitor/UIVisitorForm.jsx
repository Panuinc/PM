"use client";
import UIHeader from "@/components/UIHeader";
import React, { useState, useRef, useEffect } from "react";
import {
  Button,
  Input,
  Select,
  SelectItem,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Image,
  Chip,
} from "@heroui/react";
import {
  Camera,
  X,
  RotateCcw,
  Trash2,
  SwitchCamera,
  CheckCircle2,
  Plus,
} from "lucide-react";

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

  // Camera modal state
  const { isOpen, onOpen, onClose } = useDisclosure();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [cameraError, setCameraError] = useState("");
  const [facingMode, setFacingMode] = useState("environment");
  const [captureTarget, setCaptureTarget] = useState("visitor");

  // Local preview URLs
  const [localVisitorPhotoUrl, setLocalVisitorPhotoUrl] = useState("");
  const [localDocumentUrls, setLocalDocumentUrls] = useState([]);

  // Cleanup object URLs
  useEffect(() => {
    return () => {
      if (localVisitorPhotoUrl) URL.revokeObjectURL(localVisitorPhotoUrl);
      localDocumentUrls.forEach((u) => u && URL.revokeObjectURL(u));
    };
  }, [localVisitorPhotoUrl, localDocumentUrls]);

  // Stop camera when modal closes
  useEffect(() => {
    if (!isOpen && stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  }, [isOpen, stream]);

  const startCamera = async () => {
    setCameraError("");
    setCapturedImage(null);

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });

      setStream(mediaStream);
      if (videoRef.current) videoRef.current.srcObject = mediaStream;
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

  useEffect(() => {
    if (isOpen && !capturedImage) startCamera();
  }, [facingMode, isOpen]);

  const openCamera = (target) => {
    setCaptureTarget(target);
    setFacingMode(target === "visitor" ? "user" : "environment");
    onOpen();
    setTimeout(() => startCamera(), 100);
  };

  const switchCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setFacingMode((prev) => (prev === "environment" ? "user" : "environment"));
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

    try {
      const response = await fetch(capturedImage);
      const blob = await response.blob();

      const timestamp = Date.now();
      const fileName = `${captureTarget}_${timestamp}.jpg`;
      const file = new File([blob], fileName, { type: "image/jpeg" });

      if (captureTarget === "visitor") {
        if (localVisitorPhotoUrl) URL.revokeObjectURL(localVisitorPhotoUrl);
        const previewUrl = URL.createObjectURL(file);
        setLocalVisitorPhotoUrl(previewUrl);

        handleChange("visitorPhotoFile")(file);
        handleChange("visitorPhoto")(previewUrl);
      } else {
        const previewUrl = URL.createObjectURL(file);
        setLocalDocumentUrls((prev) => [...prev, previewUrl]);

        const nextFiles = Array.isArray(formData.visitorDocumentFiles)
          ? [...formData.visitorDocumentFiles, file]
          : [file];
        handleChange("visitorDocumentFiles")(nextFiles);
      }

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

  const removeVisitorPhoto = () => {
    if (localVisitorPhotoUrl) URL.revokeObjectURL(localVisitorPhotoUrl);
    setLocalVisitorPhotoUrl("");
    handleChange("visitorPhotoFile")(null);
    handleChange("visitorPhoto")("");
  };

  const removeLocalDocumentFile = (index) => {
    const files = Array.isArray(formData.visitorDocumentFiles)
      ? [...formData.visitorDocumentFiles]
      : [];
    if (index < 0 || index >= files.length) return;

    files.splice(index, 1);
    handleChange("visitorDocumentFiles")(files);

    setLocalDocumentUrls((prev) => {
      const next = [...prev];
      const removedUrl = next[index];
      if (removedUrl) URL.revokeObjectURL(removedUrl);
      next.splice(index, 1);
      return next;
    });
  };

  const removeExistingDocumentPhoto = (index) => {
    const existing = Array.isArray(formData.visitorDocumentPhotosArray)
      ? [...formData.visitorDocumentPhotosArray]
      : [];
    if (index < 0 || index >= existing.length) return;

    existing.splice(index, 1);
    handleChange("visitorDocumentPhotosArray")(existing);
    handleChange("visitorDocumentPhotos")(JSON.stringify(existing));
  };

  const existingDocCount = formData.visitorDocumentPhotosArray?.length || 0;
  const newDocCount = localDocumentUrls?.length || 0;
  const totalDocPhotos = existingDocCount + newDocCount;

  return (
    <>
      <UIHeader header={headerTopic} />

      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="flex flex-col items-center justify-start w-full h-full overflow-auto"
      >
        <div className="flex flex-col items-center justify-start w-full h-fit gap-2 overflow-auto">
          {/* Header */}
          <div className="flex flex-row items-center justify-end w-full h-fit p-2 gap-2">
            <div className="flex items-center justify-center h-full p-2 gap-2 bg-foreground text-background rounded-xl border-1 border-foreground">
              {mode === "create"
                ? `Create By : ${operatedBy}`
                : `Update By : ${operatedBy}`}
            </div>
          </div>

          {/* Visitor Photo */}
          <div className="flex flex-col xl:flex-row items-center justify-center w-full h-fit p-2 gap-2">
            <div className="flex flex-col items-center justify-center w-full h-full p-2 gap-2">
              <label className="text-sm font-medium">
                Visitor Photo <span className="text-danger">*</span>
              </label>

              {!formData.visitorPhoto ? (
                <div
                  onClick={() => openCamera("visitor")}
                  className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-default-300 rounded-xl cursor-pointer hover:border-primary hover:bg-primary/5 transition-all"
                >
                  <Camera size={32} className="text-default-400 mb-2" />
                  <span className="text-default-500 text-sm">
                    คลิกเพื่อถ่ายรูปผู้มาติดต่อ
                  </span>
                </div>
              ) : (
                <div className="relative w-full max-w-sm">
                  <Image
                    src={formData.visitorPhoto}
                    alt="Visitor Photo"
                    className="w-full h-48 object-cover rounded-xl border-2 border-default-200"
                  />
                  <div className="absolute top-2 right-2 flex gap-1">
                    <Button
                      isIconOnly
                      color="primary"
                      variant="solid"
                      size="sm"
                      radius="full"
                      onPress={() => openCamera("visitor")}
                    >
                      <RotateCcw size={14} />
                    </Button>
                    {localVisitorPhotoUrl && (
                      <Button
                        isIconOnly
                        color="danger"
                        variant="solid"
                        size="sm"
                        radius="full"
                        onPress={removeVisitorPhoto}
                      >
                        <Trash2 size={14} />
                      </Button>
                    )}
                  </div>
                </div>
              )}

              {errors.visitorPhoto && (
                <span className="text-danger text-xs">
                  {errors.visitorPhoto}
                </span>
              )}
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

          {/* Document Photos */}
          <div className="flex flex-col xl:flex-row items-center justify-center w-full h-fit p-2 gap-2">
            <div className="flex flex-col items-start justify-center w-full h-full p-2 gap-2">
              <div className="flex items-center justify-between w-full">
                <label className="text-sm font-medium">
                  Document Photos{" "}
                  {totalDocPhotos > 0 && (
                    <span className="text-default-500">({totalDocPhotos})</span>
                  )}{" "}
                  <span className="text-danger">*</span>
                </label>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full">
                {/* Existing Photos */}
                {formData.visitorDocumentPhotosArray?.map((src, idx) => (
                  <div
                    key={`existing-${idx}`}
                    className="relative group aspect-square"
                  >
                    <img
                      src={src}
                      alt={`Document ${idx + 1}`}
                      className="w-full h-full object-cover rounded-xl border-2 border-default-200"
                    />
                    {isUpdate && (
                      <Button
                        isIconOnly
                        color="danger"
                        variant="solid"
                        size="sm"
                        radius="full"
                        className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        onPress={() => removeExistingDocumentPhoto(idx)}
                      >
                        <Trash2 size={12} />
                      </Button>
                    )}
                  </div>
                ))}

                {/* New Photos */}
                {localDocumentUrls.map((src, idx) => (
                  <div
                    key={`new-${idx}`}
                    className="relative group aspect-square"
                  >
                    <img
                      src={src}
                      alt={`New Document ${idx + 1}`}
                      className="w-full h-full object-cover rounded-xl border-2 border-success"
                    />
                    <Chip
                      size="sm"
                      color="success"
                      variant="solid"
                      className="absolute top-1 left-1 text-xs"
                    >
                      New
                    </Chip>
                    <Button
                      isIconOnly
                      color="danger"
                      variant="solid"
                      size="sm"
                      radius="full"
                      className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      onPress={() => removeLocalDocumentFile(idx)}
                    >
                      <Trash2 size={12} />
                    </Button>
                  </div>
                ))}

                {/* Add Photo Button */}
                <div
                  onClick={() => openCamera("document")}
                  className="flex flex-col items-center justify-center aspect-square border-2 border-dashed border-default-300 rounded-xl cursor-pointer hover:border-primary hover:bg-primary/5 transition-all"
                >
                  <Plus size={24} className="text-default-400 mb-1" />
                  <span className="text-default-500 text-xs text-center px-2">
                    เพิ่มรูปเอกสาร
                  </span>
                </div>
              </div>

              {errors.visitorDocumentPhotos && (
                <span className="text-danger text-xs">
                  {errors.visitorDocumentPhotos}
                </span>
              )}
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

      {/* Camera Modal */}
      <Modal
        isOpen={isOpen}
        onClose={handleCloseModal}
        size="4xl"
        scrollBehavior="inside"
        classNames={{
          base: "bg-content1",
          header: "border-b border-default-200",
          footer: "border-t border-default-200",
        }}
      >
        <ModalContent>
          <ModalHeader className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Camera size={20} className="text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">
                {captureTarget === "visitor"
                  ? "ถ่ายรูปผู้มาติดต่อ"
                  : "ถ่ายรูปเอกสาร"}
              </h3>
              <p className="text-sm text-default-500">
                {captureTarget === "visitor"
                  ? "ถ่ายรูปหน้าผู้มาติดต่อให้ชัดเจน"
                  : "ถ่ายรูปเอกสาร เช่น บัตรประชาชน, ใบขับขี่"}
              </p>
            </div>
          </ModalHeader>

          <ModalBody className="p-4">
            {cameraError && (
              <div className="flex items-center gap-3 p-4 rounded-xl bg-danger-50 text-danger-700 border border-danger-200 mb-4">
                <X size={20} />
                <span>{cameraError}</span>
              </div>
            )}

            <div className="relative overflow-hidden rounded-xl bg-black aspect-video">
              {!capturedImage ? (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute inset-8 border-2 border-white/30 rounded-xl" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 border-2 border-white/50 rounded-full" />
                  </div>
                </>
              ) : (
                <img
                  src={capturedImage}
                  alt="Captured"
                  className="w-full h-full object-contain"
                />
              )}
              <canvas ref={canvasRef} className="hidden" />
            </div>
          </ModalBody>

          <ModalFooter className="flex justify-center gap-3 p-4">
            {!capturedImage ? (
              <>
                <Button
                  variant="flat"
                  size="lg"
                  radius="lg"
                  onPress={switchCamera}
                  startContent={<SwitchCamera size={18} />}
                >
                  สลับกล้อง
                </Button>
                <Button
                  color="primary"
                  size="lg"
                  radius="lg"
                  onPress={capturePhoto}
                  startContent={<Camera size={18} />}
                  isDisabled={!stream}
                  className="font-semibold"
                >
                  ถ่ายรูป
                </Button>
                <Button
                  color="danger"
                  variant="flat"
                  size="lg"
                  radius="lg"
                  onPress={handleCloseModal}
                  startContent={<X size={18} />}
                >
                  ยกเลิก
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="bordered"
                  size="lg"
                  radius="lg"
                  onPress={retakePhoto}
                  startContent={<RotateCcw size={18} />}
                >
                  ถ่ายใหม่
                </Button>
                <Button
                  color="primary"
                  size="lg"
                  radius="lg"
                  onPress={confirmPhoto}
                  startContent={<CheckCircle2 size={18} />}
                  className="font-semibold"
                >
                  ยืนยัน
                </Button>
                <Button
                  color="danger"
                  variant="flat"
                  size="lg"
                  radius="lg"
                  onPress={handleCloseModal}
                  startContent={<X size={18} />}
                >
                  ยกเลิก
                </Button>
              </>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

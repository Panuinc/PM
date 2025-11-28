"use client";
import UIHeader from "@/components/UIHeader";
import UIInvoiceValidationResult from "@/components/logistic/delivery/UIInvoiceValidationResult";
import { useInvoiceValidation } from "@/hooks/useInvoiceValidation";
import { DELIVERY_COMPANY_OPTIONS } from "@/app/api/logistic/delivery/core/delivery.schema";
import React, { useState, useRef, useEffect, useCallback } from "react";
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
} from "@heroui/react";
import { Camera, X, RotateCcw, Trash2 } from "lucide-react";

export default function UIDeliveryForm({
  headerTopic,
  formHandler,
  mode,
  isUpdate,
  operatedBy,
}) {
  const { formRef, formData, handleChange, handleSubmit, errors } = formHandler;

  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [locationError, setLocationError] = useState("");

  const { isOpen, onOpen, onClose } = useDisclosure();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [cameraError, setCameraError] = useState("");

  const [facingMode, setFacingMode] = useState("environment");

  const [captureTarget, setCaptureTarget] = useState("invoice");

  const [localInvoicePreviewUrl, setLocalInvoicePreviewUrl] = useState("");
  const [localProductPreviewUrls, setLocalProductPreviewUrls] = useState([]);

  const pendingResubmitRef = useRef(false);

  const {
    isValidating,
    validationResult,
    validateInvoice,
    clearValidation,
    hasWarnings,
  } = useInvoiceValidation();

  useEffect(() => {
    return () => {
      if (localInvoicePreviewUrl) URL.revokeObjectURL(localInvoicePreviewUrl);
      if (Array.isArray(localProductPreviewUrls)) {
        localProductPreviewUrls.forEach((u) => u && URL.revokeObjectURL(u));
      }
    };
  }, [localInvoicePreviewUrl, localProductPreviewUrls]);

  useEffect(() => {
    if (!isOpen && stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  }, [isOpen, stream]);

  const getCurrentLocationAsync = useCallback(() => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by your browser"));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
              { headers: { "Accept-Language": "th,en" } }
            );
            const data = await response.json();

            const locationText = data?.display_name
              ? data.display_name
              : `${latitude}, ${longitude}`;

            resolve(locationText);
          } catch {
            resolve(`${latitude}, ${longitude}`);
          }
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
          reject(new Error(errorMessage));
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    });
  }, []);

  useEffect(() => {
    const loc = String(formData?.deliveryLocation || "").trim();
    if (!pendingResubmitRef.current) return;
    if (!loc) return;

    pendingResubmitRef.current = false;

    const formEl = formRef?.current;
    if (!formEl) return;

    if (typeof formEl.requestSubmit === "function") {
      formEl.requestSubmit();
      return;
    }

    const evt = new Event("submit", { bubbles: true, cancelable: true });
    formEl.dispatchEvent(evt);
  }, [formData?.deliveryLocation, formRef]);

  const handleSubmitWithAutoLocation = async (e) => {
    e?.preventDefault?.();
    setLocationError("");

    if (isLoadingLocation) return;

    const currentLocation = String(formData?.deliveryLocation || "").trim();

    if (!currentLocation) {
      setIsLoadingLocation(true);
      try {
        const loc = await getCurrentLocationAsync();
        pendingResubmitRef.current = true;
        handleChange("deliveryLocation")(loc);
      } catch (err) {
        pendingResubmitRef.current = false;
        setLocationError(err?.message || "Unable to retrieve your location");
      } finally {
        setIsLoadingLocation(false);
      }
      return;
    }

    return handleSubmit(e);
  };

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

  const switchCamera = () => {
    if (stream) stream.getTracks().forEach((track) => track.stop());
    setFacingMode((prev) => (prev === "environment" ? "user" : "environment"));
  };

  useEffect(() => {
    if (isOpen && !capturedImage) startCamera();
  }, [facingMode, isOpen]);

  const openCamera = (target) => {
    setCaptureTarget(target);
    onOpen();
    setTimeout(() => startCamera(), 100);
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

    const invoiceNumber = String(formData.deliveryInvoiceNumber || "").trim();
    if (!invoiceNumber) {
      setCameraError("Please enter Invoice Number before taking a photo.");
      return;
    }

    try {
      const response = await fetch(capturedImage);
      const blob = await response.blob();

      const safeInvoiceNumber = invoiceNumber.replace(/[^a-zA-Z0-9-_]/g, "_");
      const fileName = `${safeInvoiceNumber}_${captureTarget}_${Date.now()}.jpg`;
      const file = new File([blob], fileName, { type: "image/jpeg" });

      if (captureTarget === "invoice") {
        if (localInvoicePreviewUrl) URL.revokeObjectURL(localInvoicePreviewUrl);
        const previewUrl = URL.createObjectURL(file);
        setLocalInvoicePreviewUrl(previewUrl);

        handleChange("deliveryFile")(file);
        handleChange("deliveryPicture")(previewUrl);

        onClose();

        await validateInvoice(file);
      } else {
        const previewUrl = URL.createObjectURL(file);
        setLocalProductPreviewUrls((prev) => [...prev, previewUrl]);

        const nextFiles = Array.isArray(formData.deliveryProductFiles)
          ? [...formData.deliveryProductFiles, file]
          : [file];
        handleChange("deliveryProductFiles")(nextFiles);

        onClose();
      }
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

  const removeLocalProductFile = (index) => {
    const files = Array.isArray(formData.deliveryProductFiles)
      ? [...formData.deliveryProductFiles]
      : [];
    if (index < 0 || index >= files.length) return;

    files.splice(index, 1);
    handleChange("deliveryProductFiles")(files);

    setLocalProductPreviewUrls((prev) => {
      const next = [...prev];
      const removedUrl = next[index];
      if (removedUrl) URL.revokeObjectURL(removedUrl);
      next.splice(index, 1);
      return next;
    });
  };

  const removeInvoicePhoto = () => {
    if (localInvoicePreviewUrl) URL.revokeObjectURL(localInvoicePreviewUrl);
    setLocalInvoicePreviewUrl("");
    handleChange("deliveryFile")(null);
    handleChange("deliveryPicture")("");
    clearValidation();
  };

  const handleRetryValidation = async () => {
    const file = formData.deliveryFile;
    if (file) {
      await validateInvoice(file);
    }
  };

  const deleteExistingProductPhoto = (photoId) => {
    if (!photoId) return;

    const existing = Array.isArray(formData.deliveryPhotos)
      ? formData.deliveryPhotos
      : [];

    const nextExisting = existing.filter((p) => p?.deliveryPhotoId !== photoId);
    handleChange("deliveryPhotos")(nextExisting);

    const currentDelete = Array.isArray(formData.deliveryDeletePhotoIds)
      ? formData.deliveryDeletePhotoIds
      : [];
    if (!currentDelete.includes(photoId)) {
      handleChange("deliveryDeletePhotoIds")([...currentDelete, photoId]);
    }
  };

  return (
    <>
      <UIHeader header={headerTopic} />

      <form
        ref={formRef}
        onSubmit={handleSubmitWithAutoLocation}
        className="flex flex-col items-center justify-start w-full h-full overflow-auto"
      >
        <input
          type="hidden"
          name="deliveryLocation"
          value={formData.deliveryLocation || ""}
          readOnly
        />

        <div className="flex flex-col items-center justify-start w-full h-fit gap-2 overflow-auto">
          <div className="flex flex-row items-center justify-center w-full h-fit p-2 gap-2">
            <div className="flex items-center justify-end w-full h-full p-2 gap-2">
              {mode === "create"
                ? `Create By : ${operatedBy}`
                : `Update By : ${operatedBy}`}
            </div>
          </div>

          {/* Company Name Select */}
          <div className="flex flex-col xl:flex-row items-center justify-center w-full h-fit p-2 gap-2">
            <div className="flex items-center justify-center w-full h-full p-2 gap-2">
              <Select
                name="deliveryCompanyName"
                label="Company Name"
                labelPlacement="outside"
                placeholder="Please Select Company"
                color="default"
                variant="faded"
                radius="none"
                isRequired
                selectedKeys={
                  formData.deliveryCompanyName
                    ? [formData.deliveryCompanyName]
                    : []
                }
                onSelectionChange={(keys) =>
                  handleChange("deliveryCompanyName")([...keys][0])
                }
                isInvalid={!!errors.deliveryCompanyName}
                errorMessage={errors.deliveryCompanyName}
              >
                {DELIVERY_COMPANY_OPTIONS.map((company) => (
                  <SelectItem key={company.key}>{company.label}</SelectItem>
                ))}
              </Select>
            </div>
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

          <div className="hidden flex-col xl:flex-row items-center justify-center w-full h-fit p-2 gap-2">
            <div className="flex items-center justify-center w-full h-full p-2 gap-2">
              <Input
                name="deliveryLocation_visible"
                type="text"
                label="Location (auto on submit)"
                color="default"
                variant="faded"
                radius="none"
                labelPlacement="outside"
                placeholder="Will be fetched when you press Submit"
                value={formData.deliveryLocation || ""}
                onChange={handleChange("deliveryLocation")}
                isInvalid={!!errors.deliveryLocation || !!locationError}
                errorMessage={errors.deliveryLocation || locationError}
              />
            </div>
          </div>

          <div className="flex flex-col xl:flex-row items-end justify-center w-full h-fit p-2 gap-2">
            <div className="flex items-end justify-center w-full xl:w-2/12 h-full p-2 gap-2">
              <Button
                type="button"
                color="secondary"
                radius="none"
                className="w-full p-2 gap-2 font-semibold"
                onPress={() => openCamera("invoice")}
                startContent={<Camera size={16} />}
                isDisabled={isLoadingLocation || isValidating}
              >
                Take Invoice Photo
              </Button>
            </div>

            <div className="flex items-end justify-center w-full xl:w-2/12 h-full p-2 gap-2">
              <Button
                type="button"
                color="secondary"
                radius="none"
                className="w-full p-2 gap-2 font-semibold"
                onPress={() => openCamera("product")}
                startContent={<Camera size={16} />}
                isDisabled={isLoadingLocation || isValidating}
              >
                Take Product Photo
              </Button>
            </div>
          </div>

          {/* Invoice Picture Preview */}
          {formData.deliveryPicture && (
            <div className="flex flex-col items-center justify-center w-full h-fit p-2 gap-2">
              <div className="flex items-center justify-between w-full xl:w-6/12 h-full p-2 gap-2">
                <span className="text-sm text-gray-500">
                  Invoice Picture Preview:
                </span>
                {localInvoicePreviewUrl && (
                  <Button
                    type="button"
                    color="danger"
                    variant="light"
                    size="sm"
                    startContent={<Trash2 size={14} />}
                    onPress={removeInvoicePhoto}
                  >
                    ลบรูป
                  </Button>
                )}
              </div>
              <div className="flex items-center justify-center w-full xl:w-6/12 h-fit p-2 gap-2">
                <Image
                  src={formData.deliveryPicture}
                  alt="Delivery Invoice Picture"
                  className="max-h-64 object-contain rounded"
                  fallbackSrc="https://via.placeholder.com/300x200?text=Image+Not+Found"
                />
              </div>
            </div>
          )}

          {/* Invoice Validation Result */}
          {(isValidating || validationResult) && (
            <div className="flex flex-col items-center justify-center w-full h-fit p-2 gap-2">
              <div className="w-full xl:w-8/12">
                <UIInvoiceValidationResult
                  isValidating={isValidating}
                  validationResult={validationResult}
                  onRetry={handleRetryValidation}
                />
              </div>
            </div>
          )}

          {Array.isArray(formData.deliveryPhotos) &&
            formData.deliveryPhotos.length > 0 && (
              <div className="flex flex-col items-center justify-center w-full h-fit p-2 gap-2">
                <div className="flex items-center justify-start w-full h-full p-2 gap-2 text-sm text-gray-500">
                  Product Photos (Saved):
                </div>

                <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 w-full xl:w-10/12 p-2">
                  {formData.deliveryPhotos.map((p) => (
                    <div
                      key={p.deliveryPhotoId}
                      className="flex flex-col gap-2 p-2 rounded border border-default-200"
                    >
                      <img
                        src={p.deliveryPhotoPath}
                        alt="Product"
                        className="w-full h-40 object-cover rounded"
                      />
                      {isUpdate && (
                        <Button
                          type="button"
                          color="danger"
                          radius="none"
                          variant="flat"
                          className="w-full font-semibold"
                          startContent={<Trash2 size={16} />}
                          onPress={() =>
                            deleteExistingProductPhoto(p.deliveryPhotoId)
                          }
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

          {Array.isArray(localProductPreviewUrls) &&
            localProductPreviewUrls.length > 0 && (
              <div className="flex flex-col items-center justify-center w-full h-fit p-2 gap-2">
                <div className="flex items-center justify-start w-full h-full p-2 gap-2 text-sm text-gray-500">
                  Product Photos (To Upload):
                </div>

                <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 w-full xl:w-10/12 p-2">
                  {localProductPreviewUrls.map((src, idx) => (
                    <div
                      key={`${src}_${idx}`}
                      className="flex flex-col gap-2 p-2 rounded border border-default-200"
                    >
                      <img
                        src={src}
                        alt="Product pending"
                        className="w-full h-40 object-cover rounded"
                      />
                      <Button
                        type="button"
                        color="danger"
                        radius="none"
                        variant="flat"
                        className="w-full font-semibold"
                        startContent={<Trash2 size={16} />}
                        onPress={() => removeLocalProductFile(idx)}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
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

          <div className="flex flex-row items-center justify-end w-full h-fit p-2 gap-2">
            <div className="flex items-center justify-center w-full xl:w-2/12 h-full p-2 gap-2">
              <Button
                type="submit"
                color="primary"
                radius="none"
                className="w-full p-2 gap-2 text-background font-semibold"
                isLoading={isLoadingLocation}
                isDisabled={isValidating}
              >
                {isLoadingLocation ? "Getting location..." : "Submit"}
              </Button>
            </div>

            <div className="flex items-center justify-center w-full xl:w-2/12 h-full p-2 gap-2">
              <Button
                type="button"
                color="danger"
                radius="none"
                className="w-full p-2 gap-2 font-semibold"
                onPress={() => history.back()}
                isDisabled={isLoadingLocation || isValidating}
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
        size="5xl"
        scrollBehavior="inside"
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            {captureTarget === "invoice"
              ? "Take Invoice Photo"
              : "Take Product Photo"}
          </ModalHeader>

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
                  {captureTarget === "invoice"
                    ? "Confirm & Validate"
                    : "Confirm"}
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

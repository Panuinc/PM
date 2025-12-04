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
  Chip,
} from "@heroui/react";
import {
  Camera,
  X,
  RotateCcw,
  Trash2,
  Sparkles,
  AlertCircle,
} from "lucide-react";

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

  const [autoFilledFields, setAutoFilledFields] = useState({
    companyName: false,
    invoiceNumber: false,
  });

  const {
    isValidating,
    validationResult,
    validateInvoice,
    clearValidation,
    hasWarnings,
  } = useInvoiceValidation();

  useEffect(() => {
    if (validationResult?.extractedData) {
      const { companyName, invoiceNumber } = validationResult.extractedData;

      const newAutoFilled = { companyName: false, invoiceNumber: false };

      if (
        companyName &&
        (!formData.deliveryCompanyName || autoFilledFields.companyName)
      ) {
        const normalize = (str) => {
          return str
            .toLowerCase()
            .replace(
              /บริษัท|จำกัด|มหาชน|\(มหาชน\)|co\.,?\s*ltd\.?|company|limited|inc\.?|corp\.?|industry/gi,
              ""
            )
            .replace(/\s+/g, "")
            .trim();
        };

        const normalizedExtracted = normalize(companyName);

        const companyKeywords = {
          CHH: [
            "ซื้อฮะฮวด",
            "ชื้อฮะฮวด",
            "ฮะฮวด",
            "chh",
            "c.h.h",
            "อุตสาหกรรม",
          ],
          DXC: ["ดีไซน์", "เอ็กซ์เช้นจ์", "design", "exchange", "dxc"],
          WWS: ["เวสท์วินด์", "westwind", "เซอร์วิสเซส", "services", "wws"],
        };

        let matchedKey = null;

        for (const [key, keywords] of Object.entries(companyKeywords)) {
          const hasMatch = keywords.some(
            (keyword) =>
              normalizedExtracted.includes(normalize(keyword)) ||
              normalize(keyword).includes(normalizedExtracted) ||
              companyName.toLowerCase().includes(keyword.toLowerCase())
          );
          if (hasMatch) {
            matchedKey = key;
            break;
          }
        }

        if (!matchedKey) {
          const matchedCompany = DELIVERY_COMPANY_OPTIONS.find((opt) => {
            const normalizedLabel = normalize(opt.label);
            const normalizedKey = normalize(opt.key);

            return (
              normalizedLabel.includes(normalizedExtracted) ||
              normalizedExtracted.includes(normalizedLabel) ||
              normalizedKey.includes(normalizedExtracted) ||
              normalizedExtracted.includes(normalizedKey)
            );
          });

          if (matchedCompany) {
            matchedKey = matchedCompany.key;
          }
        }

        if (matchedKey) {
          handleChange("deliveryCompanyName")(matchedKey);
          newAutoFilled.companyName = true;
        } else {
          console.log("No match found for company:", companyName);
          console.log("Available options:", DELIVERY_COMPANY_OPTIONS);
        }
      }

      if (
        invoiceNumber &&
        (!formData.deliveryInvoiceNumber || autoFilledFields.invoiceNumber)
      ) {
        handleChange("deliveryInvoiceNumber")(invoiceNumber);
        newAutoFilled.invoiceNumber = true;
      }

      setAutoFilledFields(newAutoFilled);
    }
  }, [validationResult]);

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

    try {
      const response = await fetch(capturedImage);
      const blob = await response.blob();

      const timestamp = Date.now();
      const fileName = `invoice_${timestamp}.jpg`;
      const file = new File([blob], fileName, { type: "image/jpeg" });

      if (captureTarget === "invoice") {
        if (localInvoicePreviewUrl) URL.revokeObjectURL(localInvoicePreviewUrl);
        const previewUrl = URL.createObjectURL(file);
        setLocalInvoicePreviewUrl(previewUrl);

        handleChange("deliveryFile")(file);
        handleChange("deliveryPicture")(previewUrl);

        setAutoFilledFields({ companyName: false, invoiceNumber: false });

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
    setAutoFilledFields({ companyName: false, invoiceNumber: false });
  };

  const handleRetryValidation = async () => {
    const file = formData.deliveryFile;
    if (file) {
      setAutoFilledFields({ companyName: false, invoiceNumber: false });
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

  const handleCompanyChange = (value) => {
    setAutoFilledFields((prev) => ({ ...prev, companyName: false }));
    handleChange("deliveryCompanyName")(value);
  };

  const handleInvoiceNumberChange = (e) => {
    setAutoFilledFields((prev) => ({ ...prev, invoiceNumber: false }));
    handleChange("deliveryInvoiceNumber")(e);
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

          <div className="flex flex-col items-center justify-center w-full h-fit p-2 gap-2">
            <div className="flex items-center justify-center w-full h-full p-2 gap-2">
              <Sparkles />
              <div>
                ถ่ายรูป Invoice เพื่อเริ่มต้น ระบบจะอ่านข้อมูล
                <strong>ชื่อบริษัท</strong> และ <strong>เลขที่เอกสาร</strong>
                จากรูปภาพโดยอัตโนมัติ
              </div>
            </div>
          </div>

          <div className="flex flex-col xl:flex-row items-center justify-center w-full h-fit p-2 gap-2">
            <div className="flex items-center justify-center w-full xl:w-6/12 h-full p-2 gap-2">
              <Button
                type="button"
                color="primary"
                radius="none"
                className="w-full p-2 gap-2 text-background font-semibold"
                onPress={() => openCamera("invoice")}
                startContent={<Camera />}
                isDisabled={isLoadingLocation || isValidating}
              >
                {formData.deliveryPicture
                  ? "ถ่ายรูป Invoice ใหม่"
                  : "📸 ถ่ายรูป Invoice"}
              </Button>
            </div>
          </div>

          {formData.deliveryPicture && (
            <div className="flex flex-col items-center justify-center w-full h-fit p-2 gap-2">
              <div className="flex items-center justify-between w-full h-full p-2 gap-2">
                <span className="text-sm text-gray-500">
                  Invoice Picture Preview:
                </span>
                {localInvoicePreviewUrl && (
                  <Button
                    type="button"
                    color="danger"
                    variant="light"
                    startContent={<Trash2 />}
                    onPress={removeInvoicePhoto}
                  >
                    ลบรูป
                  </Button>
                )}
              </div>
              <div className="flex items-center justify-center w-full h-fit p-2 gap-2">
                <Image
                  src={formData.deliveryPicture}
                  alt="Delivery Invoice Picture"
                  radius="none"
                  className="max-h-64 object-contain"
                  fallbackSrc="https://via.placeholder.com/300x200?text=Image+Not+Found"
                />
              </div>
            </div>
          )}

          {(isValidating || validationResult) && (
            <div className="flex flex-col items-center justify-center w-full h-fit p-2 gap-2">
              <div className="flex items-center justify-center w-full h-full p-2 gap-2">
                <UIInvoiceValidationResult
                  isValidating={isValidating}
                  validationResult={validationResult}
                  onRetry={handleRetryValidation}
                />
              </div>
            </div>
          )}

          {validationResult?.extractedData && (
            <div className="flex flex-col items-center justify-center w-full h-fit p-2 gap-2">
              <div className="flex items-center justify-center w-full h-full p-2 gap-2">
                <div className="flex flex-col items-center justify-center w-full h-full p-2 gap-2">
                  <div className="flex items-center justify-center w-full h-full p-2 gap-2">
                    <Sparkles /> ข้อมูลที่อ่านได้จากเอกสาร
                  </div>
                  <div className="flex flex-wrap items-center justify-center w-full h-full p-2 gap-2">
                    {validationResult.extractedData.companyName && (
                      <Chip
                        color="success"
                        variant="flat"
                        startContent={<span>🏢</span>}
                      >
                        บริษัท: {validationResult.extractedData.companyName}
                      </Chip>
                    )}
                    {validationResult.extractedData.invoiceNumber && (
                      <Chip
                        color="success"
                        variant="flat"
                        startContent={<span>📄</span>}
                      >
                        เลขที่: {validationResult.extractedData.invoiceNumber}
                      </Chip>
                    )}
                    {validationResult.extractedData.invoiceDate && (
                      <Chip
                        color="default"
                        variant="flat"
                        startContent={<span>📅</span>}
                      >
                        วันที่: {validationResult.extractedData.invoiceDate}
                      </Chip>
                    )}
                    {validationResult.extractedData.totalAmount && (
                      <Chip
                        color="default"
                        variant="flat"
                        startContent={<span>💰</span>}
                      >
                        ยอดรวม: {validationResult.extractedData.totalAmount}
                      </Chip>
                    )}
                  </div>
                  {(!validationResult.extractedData.companyName ||
                    !validationResult.extractedData.invoiceNumber) && (
                    <div className="flex items-center justify-center w-full h-full p-2 gap-2">
                      <AlertCircle />
                      บางข้อมูลไม่สามารถอ่านได้ กรุณากรอกเพิ่มเติมด้านล่าง
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col xl:flex-row items-center justify-center w-full h-fit p-2 gap-2">
            <div className="flex items-center justify-center w-full h-full p-2 gap-2">
              <Select
                name="deliveryCompanyName"
                labelPlacement="outside"
                placeholder="Please Select Company"
                color="default"
                variant="faded"
                radius="none"
                isDisabled
                selectedKeys={
                  formData.deliveryCompanyName
                    ? [formData.deliveryCompanyName]
                    : []
                }
                onSelectionChange={(keys) => handleCompanyChange([...keys][0])}
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
                color="default"
                variant="faded"
                radius="none"
                labelPlacement="outside"
                placeholder="Enter Invoice Number"
                isDisabled
                value={formData.deliveryInvoiceNumber || ""}
                onChange={handleInvoiceNumberChange}
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
            <div className="flex items-end justify-center w-full xl:w-6/12 h-full p-2 gap-2">
              <Button
                type="button"
                color="primary"
                radius="none"
                className="w-full p-2 gap-2 font-semibold"
                onPress={() => openCamera("product")}
                startContent={<Camera />}
                isDisabled={isLoadingLocation || isValidating}
              >
                Take Product Photo
              </Button>
            </div>
          </div>

          {Array.isArray(formData.deliveryPhotos) &&
            formData.deliveryPhotos.length > 0 && (
              <div className="flex flex-col items-center justify-center w-full h-fit p-2 gap-2">
                <div className="flex items-center justify-start w-full h-full p-2 gap-2">
                  Product Photos (Saved):
                </div>

                <div className="grid grid-cols-2 xl:grid-cols-4 w-full h-full p-2 gap-2">
                  {formData.deliveryPhotos.map((p) => (
                    <div
                      key={p.deliveryPhotoId}
                      className="flex flex-col items-center justify-center w-full h-full p-2 gap-2"
                    >
                      <img
                        src={p.deliveryPhotoPath}
                        alt="Product"
                        className="flex items-center justify-center w-full h-40 p-2 gap-2 object-cover"
                      />
                      {isUpdate && (
                        <Button
                          type="button"
                          color="danger"
                          radius="none"
                          className="w-full p-2 gap-2 text-background font-semibold"
                          startContent={<Trash2 />}
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
                <div className="flex items-center justify-start w-full h-full p-2 gap-2">
                  Product Photos (To Upload):
                </div>

                <div className="grid grid-cols-2 xl:grid-cols-4 w-full h-full p-2 gap-2">
                  {localProductPreviewUrls.map((src, idx) => (
                    <div
                      key={`${src}_${idx}`}
                      className="flex flex-col items-center justify-center w-full h-full p-2 gap-2"
                    >
                      <img
                        src={src}
                        alt="Product pending"
                        className="flex items-center justify-center w-full h-40 p-2 gap-2 object-cover"
                      />
                      <Button
                        type="button"
                        color="danger"
                        radius="none"
                        className="w-full p-2 gap-2 text-background font-semibold"
                        startContent={<Trash2 />}
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
        radius="none"
        scrollBehavior="inside"
        className="flex items-center justify-center w-full h-fit p-2 gap-2"
      >
        <ModalContent>
          <ModalHeader className="flex flex-col items-start justify-center w-full h-full p-2 gap-2">
            {captureTarget === "invoice"
              ? "Take Invoice Photo"
              : "Take Product Photo"}
          </ModalHeader>

          <ModalBody className="flex flex-col items-center justify-center w-full h-full p-2 gap-2">
            <div className="flex flex-col items-center justify-start w-full h-full p-2 gap-2 overflow-auto">
              {captureTarget === "invoice" && !capturedImage && (
                <div className="flex items-center justify-center w-full h-full p-2 gap-2">
                  <div className="flex items-center justify-center w-full h-full p-2 gap-2">
                    <Sparkles />
                    ถ่ายรูปให้ชัด
                    ระบบจะอ่านชื่อบริษัทและเลขที่เอกสารให้อัตโนมัติ
                  </div>
                </div>
              )}

              {cameraError && (
                <div className="flex items-center justify-center w-full h-full p-2 gap-2">
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
                    className="flex items-center justify-center w-full h-full p-2 gap-2 overflow-auto"
                  />
                  <canvas ref={canvasRef} className="hidden" />
                </>
              ) : (
                <img
                  src={capturedImage}
                  alt="Captured"
                  className="flex items-center justify-center w-full h-full p-2 gap-2 overflow-auto"
                />
              )}
            </div>
          </ModalBody>

          <ModalFooter className="flex flex-row items-center justify-center w-full h-full p-2 gap-2">
            {!capturedImage ? (
              <div className="flex flex-row items-center justify-center w-full h-full p-2 gap-2">
                <Button
                  color="primary"
                  radius="none"
                  className="w-full p-2 gap-2 text-background font-semibold"
                  onPress={capturePhoto}
                  startContent={<Camera />}
                  isDisabled={!stream}
                >
                  Capture
                </Button>

                <Button
                  color="danger"
                  radius="none"
                  className="w-full p-2 gap-2 text-background font-semibold"
                  onPress={handleCloseModal}
                  startContent={<X />}
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <div className="flex flex-row items-center justify-center w-full h-full p-2 gap-2">
                <Button
                  color="default"
                  radius="none"
                  className="w-full p-2 gap-2 text-background font-semibold"
                  onPress={retakePhoto}
                  startContent={<RotateCcw />}
                >
                  Retake
                </Button>

                <Button
                  color="primary"
                  radius="none"
                  className="w-full p-2 gap-2 text-background font-semibold"
                  onPress={confirmPhoto}
                >
                  {captureTarget === "invoice"
                    ? "Confirm & Extract Data"
                    : "Confirm"}
                </Button>

                <Button
                  color="danger"
                  radius="none"
                  className="w-full p-2 gap-2 text-background font-semibold"
                  onPress={handleCloseModal}
                  startContent={<X />}
                >
                  Cancel
                </Button>
              </div>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

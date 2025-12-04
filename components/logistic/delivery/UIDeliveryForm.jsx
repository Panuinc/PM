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
  Card,
  CardBody,
  CardHeader,
  Divider,
} from "@heroui/react";
import {
  Camera,
  X,
  RotateCcw,
  Trash2,
  Sparkles,
  AlertCircle,
  FileText,
  Package,
  CheckCircle2,
  Upload,
  MapPin,
  Building2,
  Hash,
  Calendar,
  Banknote,
  SwitchCamera,
} from "lucide-react";

// Reusable Section Card Component
const SectionCard = ({ children, className = "", animate = true }) => (
  <Card
    className={`
      w-full border border-default-200 bg-content1/80 backdrop-blur-sm
      shadow-sm hover:shadow-md transition-all duration-300
      ${animate ? "animate-fadeIn" : ""}
      ${className}
    `}
    radius="lg"
  >
    {children}
  </Card>
);

// Section Header Component
const SectionHeader = ({ icon: Icon, title, subtitle, action }) => (
  <CardHeader className="flex flex-row items-center justify-between px-6 py-4 bg-gradient-to-r from-default-50 to-transparent">
    <div className="flex items-center gap-3">
      <div className="p-2 rounded-xl bg-primary/10 text-primary">
        <Icon size={20} />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        {subtitle && <p className="text-sm text-default-500">{subtitle}</p>}
      </div>
    </div>
    {action}
  </CardHeader>
);

// Empty State Component
const EmptyState = ({ icon: Icon, title, description, action }) => (
  <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
    <div className="p-4 rounded-full bg-default-100 mb-4">
      <Icon size={32} className="text-default-400" />
    </div>
    <h4 className="text-lg font-medium text-default-700 mb-1">{title}</h4>
    <p className="text-sm text-default-500 mb-4 max-w-sm">{description}</p>
    {action}
  </div>
);

// Photo Thumbnail Component
const PhotoThumbnail = ({ src, onRemove, label, isNew = false }) => (
  <div className="group relative overflow-hidden rounded-xl border-2 border-default-200 hover:border-primary transition-all duration-300">
    <img
      src={src}
      alt={label}
      className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    {isNew && (
      <div className="absolute top-2 left-2">
        <Chip size="sm" color="success" variant="solid" className="text-xs">
          New
        </Chip>
      </div>
    )}
    {onRemove && (
      <Button
        isIconOnly
        color="danger"
        variant="solid"
        size="sm"
        className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg"
        onPress={onRemove}
      >
        <Trash2 size={16} />
      </Button>
    )}
  </div>
);

// Extracted Data Chip Component
const DataChip = ({ icon, label, value, color = "success" }) => (
  <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-default-100 border border-default-200">
    <span className="text-lg">{icon}</span>
    <div className="flex flex-col">
      <span className="text-xs text-default-500">{label}</span>
      <span className="text-sm font-medium text-foreground">{value}</span>
    </div>
  </div>
);

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

  // Effect: Auto-fill form fields from validation result
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

  // Cleanup object URLs
  useEffect(() => {
    return () => {
      if (localInvoicePreviewUrl) URL.revokeObjectURL(localInvoicePreviewUrl);
      if (Array.isArray(localProductPreviewUrls)) {
        localProductPreviewUrls.forEach((u) => u && URL.revokeObjectURL(u));
      }
    };
  }, [localInvoicePreviewUrl, localProductPreviewUrls]);

  // Stop camera stream when modal closes
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

  // Auto-resubmit after location is fetched
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

  const existingPhotosCount = formData.deliveryPhotos?.length || 0;
  const newPhotosCount = localProductPreviewUrls?.length || 0;
  const totalProductPhotos = existingPhotosCount + newPhotosCount;

  return (
    <>
      {/* Custom Styles */}
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out forwards;
        }
        .animation-delay-100 {
          animation-delay: 0.1s;
        }
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        .animation-delay-300 {
          animation-delay: 0.3s;
        }
      `}</style>

      <div className="min-h-screen bg-gradient-to-br from-default-50 via-background to-primary-50/30">
        <UIHeader header={headerTopic} />

        <form
          ref={formRef}
          onSubmit={handleSubmitWithAutoLocation}
          className="max-w-4xl mx-auto px-4 py-6 space-y-6"
        >
          <input
            type="hidden"
            name="deliveryLocation"
            value={formData.deliveryLocation || ""}
            readOnly
          />

          {/* Header Info Bar */}
          <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-default-100/50 border border-default-200">
            <div className="flex items-center gap-2 text-sm text-default-600">
              <MapPin size={16} />
              <span>Location will be auto-detected on submit</span>
            </div>
            <Chip
              color={mode === "create" ? "primary" : "warning"}
              variant="flat"
              size="sm"
            >
              {mode === "create"
                ? `Create By: ${operatedBy}`
                : `Update By: ${operatedBy}`}
            </Chip>
          </div>

          {/* Invoice Section */}
          <SectionCard className="animation-delay-100">
            <SectionHeader
              icon={FileText}
              title="Invoice Document"
              subtitle="ถ่ายรูป Invoice เพื่อดึงข้อมูลอัตโนมัติ"
            />
            <Divider />
            <CardBody className="p-6">
              {!formData.deliveryPicture ? (
                <EmptyState
                  icon={Camera}
                  title="No Invoice Photo"
                  description="ถ่ายรูป Invoice ให้ชัด ระบบจะอ่านชื่อบริษัทและเลขที่เอกสารให้อัตโนมัติ"
                  action={
                    <Button
                      color="primary"
                      size="lg"
                      radius="full"
                      className="font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300"
                      onPress={() => openCamera("invoice")}
                      startContent={<Camera size={20} />}
                      isDisabled={isLoadingLocation || isValidating}
                    >
                      <Sparkles size={16} className="mr-1" />
                      ถ่ายรูป Invoice
                    </Button>
                  }
                />
              ) : (
                <div className="space-y-6">
                  {/* Invoice Preview */}
                  <div className="relative group">
                    <div className="overflow-hidden rounded-2xl border-2 border-default-200 shadow-lg">
                      <Image
                        src={formData.deliveryPicture}
                        alt="Delivery Invoice"
                        size="lg"
                        className="w-full max-h-80 object-contain bg-default-100"
                        fallbackSrc="https://via.placeholder.com/400x300?text=Image+Not+Found"
                      />
                    </div>
                    <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Button
                        color="primary"
                        variant="solid"
                        size="sm"
                        radius="full"
                        className="shadow-lg"
                        onPress={() => openCamera("invoice")}
                        startContent={<RotateCcw size={14} />}
                        isDisabled={isLoadingLocation || isValidating}
                      >
                        ถ่ายใหม่
                      </Button>
                      {localInvoicePreviewUrl && (
                        <Button
                          color="danger"
                          variant="solid"
                          size="sm"
                          radius="full"
                          className="shadow-lg"
                          onPress={removeInvoicePhoto}
                          startContent={<Trash2 size={14} />}
                        >
                          ลบ
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Validation Status */}
                  {(isValidating || validationResult) && (
                    <UIInvoiceValidationResult
                      isValidating={isValidating}
                      validationResult={validationResult}
                      onRetry={handleRetryValidation}
                    />
                  )}

                  {/* Extracted Data Display */}
                  {validationResult?.extractedData && (
                    <div className="p-5 rounded-2xl bg-gradient-to-r from-success-50 to-primary-50 border border-success-200">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="p-1.5 rounded-lg bg-success-500 text-white">
                          <CheckCircle2 size={16} />
                        </div>
                        <span className="font-semibold text-success-700">
                          ข้อมูลที่อ่านได้จากเอกสาร
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        {validationResult.extractedData.companyName && (
                          <DataChip
                            icon="🏢"
                            label="บริษัท"
                            value={validationResult.extractedData.companyName}
                          />
                        )}
                        {validationResult.extractedData.invoiceNumber && (
                          <DataChip
                            icon="📄"
                            label="เลขที่เอกสาร"
                            value={validationResult.extractedData.invoiceNumber}
                          />
                        )}
                        {validationResult.extractedData.invoiceDate && (
                          <DataChip
                            icon="📅"
                            label="วันที่"
                            value={validationResult.extractedData.invoiceDate}
                          />
                        )}
                        {validationResult.extractedData.totalAmount && (
                          <DataChip
                            icon="💰"
                            label="ยอดรวม"
                            value={validationResult.extractedData.totalAmount}
                          />
                        )}
                      </div>
                      {(!validationResult.extractedData.companyName ||
                        !validationResult.extractedData.invoiceNumber) && (
                        <div className="flex items-center gap-2 mt-4 p-3 rounded-xl bg-warning-100 text-warning-700">
                          <AlertCircle size={18} />
                          <span className="text-sm">
                            บางข้อมูลไม่สามารถอ่านได้ กรุณากรอกเพิ่มเติมด้านล่าง
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </CardBody>
          </SectionCard>

          {/* Form Fields Section */}
          <SectionCard className="animation-delay-200">
            <SectionHeader
              icon={Building2}
              title="Invoice Details"
              subtitle="ข้อมูลบริษัทและเลขที่เอกสาร"
            />
            <Divider />
            <CardBody className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-default-700">
                    <Building2 size={16} />
                    Company Name
                    {autoFilledFields.companyName && (
                      <Chip size="sm" color="success" variant="flat">
                        Auto-filled
                      </Chip>
                    )}
                  </label>
                  <Select
                    name="deliveryCompanyName"
                    placeholder="Select Company"
                    color="default"
                    variant="bordered"
                    radius="lg"
                    size="lg"
                    classNames={{
                      trigger:
                        "h-14 bg-default-50 hover:bg-default-100 transition-colors",
                    }}
                    isDisabled
                    selectedKeys={
                      formData.deliveryCompanyName
                        ? [formData.deliveryCompanyName]
                        : []
                    }
                    onSelectionChange={(keys) =>
                      handleCompanyChange([...keys][0])
                    }
                    isInvalid={!!errors.deliveryCompanyName}
                    errorMessage={errors.deliveryCompanyName}
                  >
                    {DELIVERY_COMPANY_OPTIONS.map((company) => (
                      <SelectItem key={company.key}>{company.label}</SelectItem>
                    ))}
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-default-700">
                    <Hash size={16} />
                    Invoice Number
                    {autoFilledFields.invoiceNumber && (
                      <Chip size="sm" color="success" variant="flat">
                        Auto-filled
                      </Chip>
                    )}
                  </label>
                  <Input
                    name="deliveryInvoiceNumber"
                    type="text"
                    placeholder="Enter Invoice Number"
                    color="default"
                    variant="bordered"
                    radius="lg"
                    size="lg"
                    classNames={{
                      input: "text-base",
                      inputWrapper:
                        "h-14 bg-default-50 hover:bg-default-100 transition-colors",
                    }}
                    isDisabled
                    value={formData.deliveryInvoiceNumber || ""}
                    onChange={handleInvoiceNumberChange}
                    isInvalid={!!errors.deliveryInvoiceNumber}
                    errorMessage={errors.deliveryInvoiceNumber}
                  />
                </div>
              </div>
            </CardBody>
          </SectionCard>

          {/* Product Photos Section */}
          <SectionCard className="animation-delay-300">
            <SectionHeader
              icon={Package}
              title="Product Photos"
              subtitle={`${totalProductPhotos} รูปภาพ`}
              action={
                <Button
                  color="primary"
                  variant="flat"
                  radius="full"
                  onPress={() => openCamera("product")}
                  startContent={<Camera size={18} />}
                  isDisabled={isLoadingLocation || isValidating}
                >
                  Add Photo
                </Button>
              }
            />
            <Divider />
            <CardBody className="p-6">
              {totalProductPhotos === 0 ? (
                <EmptyState
                  icon={Package}
                  title="No Product Photos"
                  description="เพิ่มรูปภาพสินค้าเพื่อบันทึกหลักฐานการส่งมอบ"
                  action={
                    <Button
                      color="primary"
                      variant="flat"
                      radius="full"
                      onPress={() => openCamera("product")}
                      startContent={<Camera size={18} />}
                      isDisabled={isLoadingLocation || isValidating}
                    >
                      Take Product Photo
                    </Button>
                  }
                />
              ) : (
                <div className="space-y-6">
                  {/* Existing Photos */}
                  {existingPhotosCount > 0 && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-default-600">
                        <CheckCircle2 size={16} className="text-success" />
                        <span>Saved Photos ({existingPhotosCount})</span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {formData.deliveryPhotos.map((p) => (
                          <PhotoThumbnail
                            key={p.deliveryPhotoId}
                            src={p.deliveryPhotoPath}
                            label="Product"
                            onRemove={
                              isUpdate
                                ? () =>
                                    deleteExistingProductPhoto(
                                      p.deliveryPhotoId
                                    )
                                : null
                            }
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* New Photos */}
                  {newPhotosCount > 0 && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-default-600">
                        <Upload size={16} className="text-primary" />
                        <span>New Photos ({newPhotosCount})</span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {localProductPreviewUrls.map((src, idx) => (
                          <PhotoThumbnail
                            key={`new-${idx}`}
                            src={src}
                            label="New Product"
                            isNew
                            onRemove={() => removeLocalProductFile(idx)}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardBody>
          </SectionCard>

          {/* Status Section (Update Mode) */}
          {isUpdate && (
            <SectionCard>
              <SectionHeader
                icon={CheckCircle2}
                title="Delivery Status"
                subtitle="อัพเดทสถานะการจัดส่ง"
              />
              <Divider />
              <CardBody className="p-6">
                <Select
                  name="deliveryStatus"
                  label="Status"
                  labelPlacement="outside"
                  placeholder="Select Status"
                  color="default"
                  variant="bordered"
                  radius="lg"
                  size="lg"
                  isRequired
                  classNames={{
                    trigger: "h-14 bg-default-50",
                  }}
                  selectedKeys={
                    formData.deliveryStatus ? [formData.deliveryStatus] : []
                  }
                  onSelectionChange={(keys) =>
                    handleChange("deliveryStatus")([...keys][0])
                  }
                  isInvalid={!!errors.deliveryStatus}
                  errorMessage={errors.deliveryStatus}
                >
                  <SelectItem key="PendingApprove">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-warning" />
                      Pending Approve
                    </div>
                  </SelectItem>
                  <SelectItem key="Approved">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-success" />
                      Approved
                    </div>
                  </SelectItem>
                </Select>
              </CardBody>
            </SectionCard>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4">
            <Button
              type="button"
              color="default"
              variant="bordered"
              radius="full"
              size="lg"
              className="w-full sm:w-auto min-w-32 font-medium"
              onPress={() => history.back()}
              isDisabled={isLoadingLocation || isValidating}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              color="primary"
              radius="full"
              size="lg"
              className="w-full sm:w-auto min-w-40 font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300"
              isLoading={isLoadingLocation}
              isDisabled={isValidating}
            >
              {isLoadingLocation ? (
                <>
                  <MapPin size={18} className="animate-pulse" />
                  Getting Location...
                </>
              ) : (
                <>
                  <CheckCircle2 size={18} />
                  Submit
                </>
              )}
            </Button>
          </div>
        </form>
      </div>

      {/* Camera Modal */}
      <Modal
        isOpen={isOpen}
        onClose={handleCloseModal}
        size="4xl"
        radius="lg"
        scrollBehavior="inside"
        classNames={{
          backdrop: "bg-black/80 backdrop-blur-sm",
          base: "bg-content1 border border-default-200",
          header: "border-b border-default-200",
          footer: "border-t border-default-200",
        }}
      >
        <ModalContent>
          <ModalHeader className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <Camera size={20} />
            </div>
            <div>
              <h3 className="text-lg font-semibold">
                {captureTarget === "invoice"
                  ? "Capture Invoice"
                  : "Capture Product"}
              </h3>
              {captureTarget === "invoice" && !capturedImage && (
                <p className="text-sm text-default-500 flex items-center gap-1">
                  <Sparkles size={14} />
                  ถ่ายรูปให้ชัด ระบบจะอ่านข้อมูลอัตโนมัติ
                </p>
              )}
            </div>
          </ModalHeader>

          <ModalBody className="p-6">
            {cameraError && (
              <div className="flex items-center gap-3 p-4 rounded-xl bg-danger-50 text-danger-700 border border-danger-200">
                <AlertCircle size={20} />
                <span>{cameraError}</span>
              </div>
            )}

            <div className="relative overflow-hidden rounded-2xl bg-black aspect-video">
              {!capturedImage ? (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                  {/* Camera Overlay Guide */}
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute inset-8 border-2 border-white/30 rounded-xl" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 border-2 border-white/50 rounded-full" />
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

          <ModalFooter className="flex flex-wrap justify-center gap-3 p-4">
            {!capturedImage ? (
              <>
                <Button
                  variant="flat"
                  radius="full"
                  size="lg"
                  onPress={switchCamera}
                  startContent={<SwitchCamera size={18} />}
                  className="min-w-32"
                >
                  Switch
                </Button>
                <Button
                  color="primary"
                  radius="full"
                  size="lg"
                  onPress={capturePhoto}
                  startContent={<Camera size={18} />}
                  isDisabled={!stream}
                  className="min-w-40 font-semibold shadow-lg shadow-primary/25"
                >
                  Capture
                </Button>
                <Button
                  color="danger"
                  variant="flat"
                  radius="full"
                  size="lg"
                  onPress={handleCloseModal}
                  startContent={<X size={18} />}
                  className="min-w-32"
                >
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="bordered"
                  radius="full"
                  size="lg"
                  onPress={retakePhoto}
                  startContent={<RotateCcw size={18} />}
                  className="min-w-32"
                >
                  Retake
                </Button>
                <Button
                  color="primary"
                  radius="full"
                  size="lg"
                  onPress={confirmPhoto}
                  className="min-w-48 font-semibold shadow-lg shadow-primary/25"
                >
                  {captureTarget === "invoice" ? (
                    <>
                      <Sparkles size={18} />
                      Confirm & Extract
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={18} />
                      Confirm
                    </>
                  )}
                </Button>
                <Button
                  color="danger"
                  variant="flat"
                  radius="full"
                  size="lg"
                  onPress={handleCloseModal}
                  startContent={<X size={18} />}
                  className="min-w-32"
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

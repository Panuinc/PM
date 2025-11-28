"use client";

import { useState, useCallback } from "react";

/**
 * Hook สำหรับตรวจสอบรูปภาพ Invoice ด้วย AI
 * 
 * @returns {Object} - Object containing validation state and functions
 * @property {boolean} isValidating - สถานะกำลังตรวจสอบ
 * @property {Object|null} validationResult - ผลการตรวจสอบ
 * @property {Function} validateInvoice - ฟังก์ชันสำหรับตรวจสอบ
 * @property {Function} clearValidation - ฟังก์ชันสำหรับล้างผลการตรวจสอบ
 */
export function useInvoiceValidation() {
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState(null);
  const [validationError, setValidationError] = useState(null);

  /**
   * ตรวจสอบรูปภาพ Invoice
   * @param {File} file - ไฟล์รูปภาพที่จะตรวจสอบ
   * @returns {Promise<Object|null>} - ผลการตรวจสอบ
   */
  const validateInvoice = useCallback(async (file) => {
    if (!file) {
      return null;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      const errorResult = {
        valid: false,
        warnings: [{
          type: "fileType",
          severity: "error",
          message: "ประเภทไฟล์ไม่ถูกต้อง รองรับเฉพาะ JPEG, PNG, GIF, WEBP",
        }],
        canProceed: false,
      };
      setValidationResult(errorResult);
      return errorResult;
    }

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      const errorResult = {
        valid: false,
        warnings: [{
          type: "fileSize",
          severity: "error",
          message: "ขนาดไฟล์เกิน 10MB",
        }],
        canProceed: false,
      };
      setValidationResult(errorResult);
      return errorResult;
    }

    setIsValidating(true);
    setValidationResult(null);
    setValidationError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/logistic/delivery/validate-invoice", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      result.validatedAt = new Date().toISOString();
      
      setValidationResult(result);
      return result;
    } catch (error) {
      console.error("Invoice validation error:", error);
      
      const errorResult = {
        valid: true,
        warnings: [],
        message: "ไม่สามารถตรวจสอบรูปภาพได้ กรุณาตรวจสอบด้วยตนเอง",
        canProceed: true,
        error: error.message,
      };
      
      setValidationResult(errorResult);
      setValidationError(error.message);
      return errorResult;
    } finally {
      setIsValidating(false);
    }
  }, []);

  /**
   * ล้างผลการตรวจสอบ
   */
  const clearValidation = useCallback(() => {
    setValidationResult(null);
    setValidationError(null);
  }, []);

  /**
   * ตรวจสอบว่ามี warning หรือไม่
   */
  const hasWarnings = validationResult?.warnings?.length > 0;

  /**
   * ตรวจสอบว่ามี critical issues หรือไม่
   */
  const hasCriticalIssues = validationResult?.warnings?.some(
    (w) => w.severity === "error"
  );

  /**
   * นับจำนวน warnings ตาม severity
   */
  const warningCounts = {
    error: validationResult?.warnings?.filter((w) => w.severity === "error").length || 0,
    warning: validationResult?.warnings?.filter((w) => w.severity === "warning").length || 0,
    info: validationResult?.warnings?.filter((w) => w.severity === "info").length || 0,
  };

  return {
    isValidating,
    validationResult,
    validationError,
    validateInvoice,
    clearValidation,
    hasWarnings,
    hasCriticalIssues,
    warningCounts,
  };
}

export default useInvoiceValidation;
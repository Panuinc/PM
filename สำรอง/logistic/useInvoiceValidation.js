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
        canProceed: false,
        decision: "REJECT",
        score: 0,
        criticalIssues: [
          {
            type: "fileType",
            severity: "critical",
            message: "ประเภทไฟล์ไม่ถูกต้อง รองรับเฉพาะ JPEG, PNG, GIF, WEBP",
          },
        ],
        warnings: [],
        summary: "ไฟล์ไม่ถูกต้อง",
      };
      setValidationResult(errorResult);
      return errorResult;
    }

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      const errorResult = {
        valid: false,
        canProceed: false,
        decision: "REJECT",
        score: 0,
        criticalIssues: [
          {
            type: "fileSize",
            severity: "critical",
            message: "ขนาดไฟล์เกิน 10MB",
          },
        ],
        warnings: [],
        summary: "ไฟล์ใหญ่เกินไป",
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
        canProceed: true,
        decision: "NEED_REVIEW",
        score: null,
        criticalIssues: [],
        warnings: [
          {
            type: "system_error",
            severity: "warning",
            message: "ไม่สามารถตรวจสอบรูปภาพได้ กรุณาตรวจสอบด้วยตนเอง",
          },
        ],
        summary: "ระบบไม่สามารถวิเคราะห์ได้",
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
   * ตรวจสอบว่ามี warning หรือไม่ (รองรับทั้ง structure เก่าและใหม่)
   */
  const hasWarnings =
    (validationResult?.warnings?.length || 0) > 0 ||
    (validationResult?.criticalIssues?.length || 0) > 0;

  /**
   * ตรวจสอบว่ามี critical issues หรือไม่
   */
  const hasCriticalIssues =
    (validationResult?.criticalIssues?.length || 0) > 0 ||
    validationResult?.warnings?.some(
      (w) => w.severity === "error" || w.severity === "critical"
    );

  /**
   * ตรวจสอบว่าถูก reject หรือไม่
   */
  const isRejected = validationResult?.decision === "REJECT";

  /**
   * นับจำนวน warnings ตาม severity
   */
  const warningCounts = {
    critical: validationResult?.criticalIssues?.length || 0,
    error:
      validationResult?.warnings?.filter(
        (w) => w.severity === "error" || w.severity === "critical"
      ).length || 0,
    warning:
      validationResult?.warnings?.filter((w) => w.severity === "warning")
        .length || 0,
    info:
      validationResult?.warnings?.filter((w) => w.severity === "info").length ||
      0,
  };

  return {
    isValidating,
    validationResult,
    validationError,
    validateInvoice,
    clearValidation,
    hasWarnings,
    hasCriticalIssues,
    isRejected,
    warningCounts,
  };
}

export default useInvoiceValidation;

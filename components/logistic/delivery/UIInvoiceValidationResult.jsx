"use client";

import React from "react";
import { Button, Progress, Chip } from "@heroui/react";
import {
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info,
  RefreshCw,
  FileWarning,
  PenTool,
  Eraser,
  Eye,
  FileCheck,
} from "lucide-react";

export default function UIInvoiceValidationResult({
  isValidating,
  validationResult,
  onRetry,
  className = "",
}) {
  if (isValidating) {
    return (
      <div
        className={`w-full p-4 bg-primary-50 border border-primary-200 rounded-lg ${className}`}
      >
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="flex items-center gap-2 text-primary-600">
            <RefreshCw size={20} className="animate-spin" />
            <span className="font-medium">กำลังตรวจสอบรูปภาพ Invoice...</span>
          </div>
          <Progress
            size="sm"
            isIndeterminate
            color="primary"
            className="max-w-md"
          />
          <p className="text-sm text-gray-500">
            AI กำลังวิเคราะห์ลายเซ็น รอยขีดข่วน และความสมบูรณ์ของเอกสาร
          </p>
        </div>
      </div>
    );
  }

  if (!validationResult) {
    return null;
  }

  const {
    valid,
    warnings,
    suggestions,
    summary,
    score,
    details,
    message,
    canProceed,
  } = validationResult;

  if (valid && (!warnings || warnings.length === 0)) {
    return (
      <div
        className={`w-full p-4 bg-success-50 border border-success-200 rounded-lg ${className}`}
      >
        <div className="flex items-center gap-3">
          <CheckCircle size={24} className="text-success-600 flex-shrink-0" />
          <div className="flex-1">
            <p className="font-medium text-success-700">เอกสารผ่านการตรวจสอบ</p>
            {summary && (
              <p className="text-sm text-success-600 mt-1">{summary}</p>
            )}
            {message && (
              <p className="text-sm text-success-600 mt-1">{message}</p>
            )}
          </div>
          {score && (
            <Chip color="success" variant="flat" size="sm">
              คะแนน: {score}/10
            </Chip>
          )}
        </div>
      </div>
    );
  }

  const errorWarnings = warnings?.filter((w) => w.severity === "error") || [];
  const normalWarnings =
    warnings?.filter((w) => w.severity === "warning") || [];
  const infoWarnings = warnings?.filter((w) => w.severity === "info") || [];

  const getWarningIcon = (type) => {
    switch (type) {
      case "signature":
        return <PenTool size={16} />;
      case "scratches":
        return <Eraser size={16} />;
      case "penMarks":
        return <FileWarning size={16} />;
      case "clarity":
        return <Eye size={16} />;
      case "invalid":
        return <XCircle size={16} />;
      default:
        return <Info size={16} />;
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "error":
        return "danger";
      case "warning":
        return "warning";
      case "info":
        return "primary";
      default:
        return "default";
    }
  };

  const getSeverityBg = (severity) => {
    switch (severity) {
      case "error":
        return "bg-danger-50 border-danger-200";
      case "warning":
        return "bg-warning-50 border-warning-200";
      case "info":
        return "bg-primary-50 border-primary-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Header */}
      <div
        className={`p-4 rounded-t-lg border ${
          errorWarnings.length > 0
            ? "bg-danger-50 border-danger-200"
            : "bg-warning-50 border-warning-200"
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {errorWarnings.length > 0 ? (
              <XCircle size={24} className="text-danger-600" />
            ) : (
              <AlertTriangle size={24} className="text-warning-600" />
            )}
            <div>
              <p
                className={`font-semibold ${
                  errorWarnings.length > 0
                    ? "text-danger-700"
                    : "text-warning-700"
                }`}
              >
                พบข้อสังเกตในรูปภาพ Invoice
              </p>
              <p className="text-sm text-gray-600">
                {warnings?.length || 0} รายการที่ควรตรวจสอบ
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {score && (
              <Chip
                color={
                  score >= 7 ? "success" : score >= 4 ? "warning" : "danger"
                }
                variant="flat"
                size="sm"
              >
                คะแนน: {score}/10
              </Chip>
            )}
            {onRetry && (
              <Button
                size="sm"
                variant="light"
                color="default"
                startContent={<RefreshCw size={14} />}
                onPress={onRetry}
              >
                ตรวจสอบใหม่
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Warnings List */}
      <div className="border border-t-0 border-gray-200 rounded-b-lg divide-y divide-gray-100">
        {/* Critical Errors */}
        {errorWarnings.length > 0 && (
          <div className="p-3 bg-danger-50/50">
            <p className="text-xs font-semibold text-danger-600 uppercase mb-2">
              ปัญหาสำคัญ
            </p>
            <div className="space-y-2">
              {errorWarnings.map((warning, idx) => (
                <div
                  key={`error-${idx}`}
                  className="flex items-start gap-2 p-2 bg-white rounded border border-danger-100"
                >
                  <span className="text-danger-500 mt-0.5">
                    {getWarningIcon(warning.type)}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-danger-700">
                      {warning.message}
                    </p>
                    {warning.details && (
                      <p className="text-xs text-danger-600 mt-0.5">
                        {warning.details}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Normal Warnings */}
        {normalWarnings.length > 0 && (
          <div className="p-3 bg-warning-50/50">
            <p className="text-xs font-semibold text-warning-600 uppercase mb-2">
              ข้อควรระวัง
            </p>
            <div className="space-y-2">
              {normalWarnings.map((warning, idx) => (
                <div
                  key={`warning-${idx}`}
                  className="flex items-start gap-2 p-2 bg-white rounded border border-warning-100"
                >
                  <span className="text-warning-500 mt-0.5">
                    {getWarningIcon(warning.type)}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-warning-700">
                      {warning.message}
                    </p>
                    {warning.details && (
                      <p className="text-xs text-warning-600 mt-0.5">
                        {warning.details}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Info */}
        {infoWarnings.length > 0 && (
          <div className="p-3 bg-primary-50/50">
            <p className="text-xs font-semibold text-primary-600 uppercase mb-2">
              ข้อมูลเพิ่มเติม
            </p>
            <div className="space-y-2">
              {infoWarnings.map((warning, idx) => (
                <div
                  key={`info-${idx}`}
                  className="flex items-start gap-2 p-2 bg-white rounded border border-primary-100"
                >
                  <span className="text-primary-500 mt-0.5">
                    {getWarningIcon(warning.type)}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-primary-700">
                      {warning.message}
                    </p>
                    {warning.details && (
                      <p className="text-xs text-primary-600 mt-0.5">
                        {warning.details}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Suggestions */}
        {suggestions && suggestions.length > 0 && (
          <div className="p-3 bg-gray-50">
            <p className="text-xs font-semibold text-gray-600 uppercase mb-2">
              คำแนะนำ
            </p>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
              {suggestions.map((suggestion, idx) => (
                <li key={`suggestion-${idx}`}>{suggestion}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Summary */}
        {summary && (
          <div className="p-3 bg-gray-50">
            <p className="text-sm text-gray-700">
              <span className="font-medium">สรุป: </span>
              {summary}
            </p>
          </div>
        )}

        {/* Details */}
        {details && (
          <div className="p-3 bg-gray-50">
            <p className="text-xs font-semibold text-gray-600 uppercase mb-2">
              รายละเอียดการตรวจสอบ
            </p>
            <div className="flex flex-wrap gap-2">
              <Chip
                size="sm"
                variant="flat"
                color={details.hasSignature ? "success" : "warning"}
                startContent={
                  details.hasSignature ? (
                    <CheckCircle size={12} />
                  ) : (
                    <XCircle size={12} />
                  )
                }
              >
                ลายเซ็น: {details.hasSignature ? "พบ" : "ไม่พบ"}
              </Chip>
              <Chip
                size="sm"
                variant="flat"
                color={!details.hasScratches ? "success" : "warning"}
                startContent={
                  !details.hasScratches ? (
                    <CheckCircle size={12} />
                  ) : (
                    <AlertTriangle size={12} />
                  )
                }
              >
                รอยขีดข่วน: {details.hasScratches ? "พบ" : "ไม่พบ"}
              </Chip>
              <Chip
                size="sm"
                variant="flat"
                color={!details.hasPenMarks ? "success" : "warning"}
                startContent={
                  !details.hasPenMarks ? (
                    <CheckCircle size={12} />
                  ) : (
                    <AlertTriangle size={12} />
                  )
                }
              >
                รอยปากกา: {details.hasPenMarks ? "พบ" : "ไม่พบ"}
              </Chip>
              <Chip
                size="sm"
                variant="flat"
                color={details.isDocumentClear ? "success" : "warning"}
                startContent={
                  details.isDocumentClear ? (
                    <CheckCircle size={12} />
                  ) : (
                    <AlertTriangle size={12} />
                  )
                }
              >
                ความชัดเจน: {details.isDocumentClear ? "ดี" : "ไม่ชัด"}
              </Chip>
            </div>
          </div>
        )}

        {/* Footer - Can Proceed */}
        <div className="p-3 bg-blue-50 border-t border-blue-100">
          <div className="flex items-center gap-2">
            <FileCheck size={16} className="text-blue-600" />
            <p className="text-sm text-blue-700">
              {canProceed
                ? "คุณยังสามารถบันทึกข้อมูลได้ แต่กรุณาตรวจสอบความถูกต้องของเอกสารก่อน"
                : "กรุณาถ่ายรูปใหม่เพื่อให้เอกสารถูกต้องสมบูรณ์"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

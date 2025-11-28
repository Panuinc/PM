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
  FileX,
  ImageOff,
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
            AI กำลังวิเคราะห์ลายเซ็น 4 ช่อง, รอยขีดข่วน และความสมบูรณ์ของเอกสาร
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
    canProceed,
    decision,
    score,
    criticalIssues = [],
    warnings = [],
    allIssues = [],
    requiredActions = [],
    reason,
    summary,
    passedCriteria = [],
    failedCriteria = [],
    details,
    message,
    suggestions = [],
  } = validationResult;

  const isFullyPassed =
    (valid && decision === "ACCEPT" && criticalIssues.length === 0) ||
    (valid && (!warnings || warnings.length === 0) && !decision);

  if (isFullyPassed) {
    return (
      <div
        className={`w-full p-4 bg-success-50 border border-success-200 rounded-lg ${className}`}
      >
        <div className="flex items-center gap-3">
          <CheckCircle size={24} className="text-success-600 flex-shrink-0" />
          <div className="flex-1">
            <p className="font-medium text-success-700">
              ✅ เอกสารผ่านการตรวจสอบทุกเกณฑ์
            </p>
            {summary && (
              <p className="text-sm text-success-600 mt-1">{summary}</p>
            )}
            {message && (
              <p className="text-sm text-success-600 mt-1">{message}</p>
            )}
          </div>
          {score !== undefined && score !== null && (
            <Chip color="success" variant="flat" size="sm">
              คะแนน: {score}/100
            </Chip>
          )}
        </div>

        {/* แสดงรายละเอียดลายเซ็น */}
        {details?.signatures && (
          <div className="mt-3 pt-3 border-t border-success-200">
            <p className="text-xs font-semibold text-success-600 mb-2">
              ลายเซ็นครบ {details.signatures.totalFound}/4 ช่อง
            </p>
            <div className="flex flex-wrap gap-2">
              <SignatureChip
                label="ผู้รับของ"
                data={details.signatures.receivedBy}
              />
              <SignatureChip
                label="ผู้ส่งของ"
                data={details.signatures.deliveredBy}
              />
              <SignatureChip
                label="ผู้ตรวจสอบ"
                data={details.signatures.checkedBy}
              />
              <SignatureChip
                label="ผู้จัดทำ"
                data={details.signatures.issuedBy}
              />
            </div>
          </div>
        )}
      </div>
    );
  }

  const getWarningIcon = (type) => {
    switch (type) {
      case "signature_incomplete":
      case "signature_missing":
      case "signature":
        return <PenTool size={16} />;
      case "scratches":
      case "cross_outs":
        return <Eraser size={16} />;
      case "unauthorized_marks":
      case "number_corrections":
      case "liquid_paper":
      case "penMarks":
        return <FileWarning size={16} />;
      case "invalid_document":
      case "invalid":
        return <FileX size={16} />;
      case "image_quality":
      case "blurry":
      case "incomplete":
      case "clarity":
        return <ImageOff size={16} />;
      case "tears":
      case "stains":
      case "missing_parts":
      case "damage":
        return <FileWarning size={16} />;
      default:
        return <Info size={16} />;
    }
  };

  const getDecisionColor = (dec) => {
    switch (dec) {
      case "ACCEPT":
        return "success";
      case "REJECT":
        return "danger";
      case "NEED_REVIEW":
        return "warning";
      default:
        return "default";
    }
  };

  const getDecisionText = (dec) => {
    switch (dec) {
      case "ACCEPT":
        return "ผ่าน";
      case "REJECT":
        return "ไม่ผ่าน";
      case "NEED_REVIEW":
        return "ต้องตรวจสอบเพิ่ม";
      default:
        return dec || "รอตรวจสอบ";
    }
  };

  const allWarnings = allIssues.length > 0 ? allIssues : warnings;
  const errorWarnings =
    criticalIssues.length > 0
      ? criticalIssues
      : allWarnings.filter(
          (w) => w.severity === "error" || w.severity === "critical"
        );
  const normalWarnings = allWarnings.filter((w) => w.severity === "warning");
  const infoWarnings = allWarnings.filter((w) => w.severity === "info");

  const isRejected = decision === "REJECT" || errorWarnings.length > 0;
  const needsReview = decision === "NEED_REVIEW";

  return (
    <div className={`w-full ${className}`}>
      {/* Header */}
      <div
        className={`p-4 rounded-t-lg border ${
          isRejected
            ? "bg-danger-50 border-danger-200"
            : needsReview
            ? "bg-warning-50 border-warning-200"
            : "bg-warning-50 border-warning-200"
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isRejected ? (
              <XCircle size={24} className="text-danger-600" />
            ) : (
              <AlertTriangle size={24} className="text-warning-600" />
            )}
            <div>
              <p
                className={`font-semibold ${
                  isRejected ? "text-danger-700" : "text-warning-700"
                }`}
              >
                {isRejected
                  ? "❌ เอกสารไม่ผ่านการตรวจสอบ"
                  : "⚠️ พบข้อสังเกตในเอกสาร"}
              </p>
              <p className="text-sm text-gray-600">
                {errorWarnings.length > 0 &&
                  `${errorWarnings.length} ปัญหาร้ายแรง`}
                {errorWarnings.length > 0 && normalWarnings.length > 0 && ", "}
                {normalWarnings.length > 0 &&
                  `${normalWarnings.length} ข้อควรระวัง`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {decision && (
              <Chip color={getDecisionColor(decision)} variant="flat" size="sm">
                {getDecisionText(decision)}
              </Chip>
            )}
            {score !== undefined && score !== null && (
              <Chip
                color={
                  score >= 80 ? "success" : score >= 50 ? "warning" : "danger"
                }
                variant="flat"
                size="sm"
              >
                {score}/100
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
                ตรวจใหม่
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="border border-t-0 border-gray-200 rounded-b-lg divide-y divide-gray-100">
        {/* Critical Issues */}
        {errorWarnings.length > 0 && (
          <div className="p-3 bg-danger-50/50">
            <p className="text-xs font-semibold text-danger-600 uppercase mb-2">
              🚫 ปัญหาร้ายแรง (ต้องแก้ไข)
            </p>
            <div className="space-y-2">
              {errorWarnings.map((issue, idx) => (
                <div
                  key={`critical-${idx}`}
                  className="flex items-start gap-2 p-2 bg-white rounded border border-danger-100"
                >
                  <span className="text-danger-500 mt-0.5">
                    {getWarningIcon(issue.type)}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-danger-700">
                      {issue.message}
                    </p>
                    {issue.details && (
                      <p className="text-xs text-danger-600 mt-0.5">
                        {issue.details}
                      </p>
                    )}
                    {issue.locations && issue.locations.length > 0 && (
                      <p className="text-xs text-danger-500 mt-0.5">
                        ตำแหน่ง: {issue.locations.join(", ")}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Warnings */}
        {normalWarnings.length > 0 && (
          <div className="p-3 bg-warning-50/50">
            <p className="text-xs font-semibold text-warning-600 uppercase mb-2">
              ⚠️ ข้อควรระวัง
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

        {/* Signature Details (New Structure) */}
        {details?.signatures && (
          <div className="p-3 bg-gray-50">
            <p className="text-xs font-semibold text-gray-600 uppercase mb-2">
              📝 สถานะลายเซ็น ({details.signatures.totalFound || 0}/4 ช่อง)
            </p>
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-2">
              <SignatureStatusCard
                label="ผู้รับของ"
                sublabel="Received by"
                data={details.signatures.receivedBy}
              />
              <SignatureStatusCard
                label="ผู้ส่งของ"
                sublabel="Delivered by"
                data={details.signatures.deliveredBy}
              />
              <SignatureStatusCard
                label="ผู้ตรวจสอบ"
                sublabel="Checked by"
                data={details.signatures.checkedBy}
              />
              <SignatureStatusCard
                label="ผู้จัดทำ"
                sublabel="Issued by"
                data={details.signatures.issuedBy}
              />
            </div>
          </div>
        )}

        {/* Document Details (New Structure) */}
        {details &&
          (details.cleanliness ||
            details.condition ||
            details.imageQuality) && (
            <div className="p-3 bg-gray-50">
              <p className="text-xs font-semibold text-gray-600 uppercase mb-2">
                📋 รายละเอียดการตรวจสอบ
              </p>
              <div className="flex flex-wrap gap-2">
                {details.invoiceInfo && (
                  <Chip
                    size="sm"
                    variant="flat"
                    color={
                      details.invoiceInfo.hasCompanyHeader
                        ? "success"
                        : "danger"
                    }
                    startContent={
                      details.invoiceInfo.hasCompanyHeader ? (
                        <CheckCircle size={12} />
                      ) : (
                        <XCircle size={12} />
                      )
                    }
                  >
                    เอกสาร Invoice
                  </Chip>
                )}
                {details.cleanliness && (
                  <Chip
                    size="sm"
                    variant="flat"
                    color={details.cleanliness.isClean ? "success" : "danger"}
                    startContent={
                      details.cleanliness.isClean ? (
                        <CheckCircle size={12} />
                      ) : (
                        <XCircle size={12} />
                      )
                    }
                  >
                    ความสะอาด
                  </Chip>
                )}
                {details.condition && (
                  <Chip
                    size="sm"
                    variant="flat"
                    color={
                      details.condition.isGoodCondition ? "success" : "warning"
                    }
                    startContent={
                      details.condition.isGoodCondition ? (
                        <CheckCircle size={12} />
                      ) : (
                        <AlertTriangle size={12} />
                      )
                    }
                  >
                    สภาพเอกสาร
                  </Chip>
                )}
                {details.imageQuality && (
                  <Chip
                    size="sm"
                    variant="flat"
                    color={
                      details.imageQuality.isAcceptable ? "success" : "warning"
                    }
                    startContent={
                      details.imageQuality.isAcceptable ? (
                        <CheckCircle size={12} />
                      ) : (
                        <AlertTriangle size={12} />
                      )
                    }
                  >
                    คุณภาพรูป
                  </Chip>
                )}
              </div>
            </div>
          )}

        {/* Old Structure Details */}
        {details &&
          !details.signatures &&
          (details.hasSignature !== undefined ||
            details.hasScratches !== undefined) && (
            <div className="p-3 bg-gray-50">
              <p className="text-xs font-semibold text-gray-600 uppercase mb-2">
                รายละเอียดการตรวจสอบ
              </p>
              <div className="flex flex-wrap gap-2">
                {details.hasSignature !== undefined && (
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
                )}
                {details.hasScratches !== undefined && (
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
                )}
                {details.hasPenMarks !== undefined && (
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
                )}
                {details.isDocumentClear !== undefined && (
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
                )}
              </div>
            </div>
          )}

        {/* Failed Criteria */}
        {failedCriteria.length > 0 && (
          <div className="p-3 bg-danger-50/30">
            <p className="text-xs font-semibold text-danger-600 uppercase mb-2">
              เกณฑ์ที่ไม่ผ่าน
            </p>
            <ul className="list-disc list-inside text-sm text-danger-600 space-y-1">
              {failedCriteria.map((criteria, idx) => (
                <li key={`failed-${idx}`}>{criteria}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Required Actions */}
        {requiredActions.length > 0 && (
          <div className="p-3 bg-primary-50">
            <p className="text-xs font-semibold text-primary-600 uppercase mb-2">
              🔧 สิ่งที่ต้องแก้ไข
            </p>
            <ul className="list-decimal list-inside text-sm text-primary-700 space-y-1">
              {requiredActions.map((action, idx) => (
                <li key={`action-${idx}`}>{action}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Suggestions (Old Structure) */}
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

        {/* Reason */}
        {reason && (
          <div className="p-3 bg-gray-50">
            <p className="text-sm text-gray-700">
              <span className="font-medium">เหตุผล: </span>
              {reason}
            </p>
          </div>
        )}

        {/* Footer */}
        <div
          className={`p-3 border-t ${
            canProceed !== false
              ? "bg-blue-50 border-blue-100"
              : "bg-danger-50 border-danger-100"
          }`}
        >
          <div className="flex items-center gap-2">
            {canProceed !== false ? (
              <>
                <FileCheck size={16} className="text-blue-600" />
                <p className="text-sm text-blue-700">
                  คุณยังสามารถบันทึกข้อมูลได้
                  แต่กรุณาตรวจสอบความถูกต้องของเอกสารก่อน
                </p>
              </>
            ) : (
              <>
                <XCircle size={16} className="text-danger-600" />
                <p className="text-sm text-danger-700 font-medium">
                  กรุณาถ่ายรูปใหม่ เอกสารไม่ผ่านเกณฑ์ที่กำหนด
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function SignatureChip({ label, data }) {
  if (!data) return null;

  const isComplete = data.hasSignature && data.hasDate;

  return (
    <Chip
      size="sm"
      variant="flat"
      color={isComplete ? "success" : "warning"}
      startContent={
        isComplete ? <CheckCircle size={12} /> : <AlertTriangle size={12} />
      }
    >
      {label}: {isComplete ? "✓" : "ไม่ครบ"}
    </Chip>
  );
}

function SignatureStatusCard({ label, sublabel, data }) {
  if (!data) {
    return (
      <div className="p-2 bg-gray-100 rounded border border-gray-200">
        <p className="text-xs font-medium text-gray-600">{label}</p>
        <p className="text-xs text-gray-400">{sublabel}</p>
        <p className="text-xs text-gray-500 mt-1">ไม่มีข้อมูล</p>
      </div>
    );
  }

  const hasSignature = data.hasSignature;
  const hasDate = data.hasDate;
  const isComplete = hasSignature && hasDate;

  return (
    <div
      className={`p-2 rounded border ${
        isComplete
          ? "bg-success-50 border-success-200"
          : hasSignature
          ? "bg-warning-50 border-warning-200"
          : "bg-danger-50 border-danger-200"
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p
            className={`text-xs font-medium ${
              isComplete
                ? "text-success-700"
                : hasSignature
                ? "text-warning-700"
                : "text-danger-700"
            }`}
          >
            {label}
          </p>
          <p className="text-xs text-gray-400">{sublabel}</p>
        </div>
        {isComplete ? (
          <CheckCircle size={16} className="text-success-500" />
        ) : hasSignature ? (
          <AlertTriangle size={16} className="text-warning-500" />
        ) : (
          <XCircle size={16} className="text-danger-500" />
        )}
      </div>
      <div className="mt-1 flex gap-2">
        <span
          className={`text-xs ${
            hasSignature ? "text-success-600" : "text-danger-600"
          }`}
        >
          {hasSignature ? "✓ ลายเซ็น" : "✗ ลายเซ็น"}
        </span>
        <span
          className={`text-xs ${
            hasDate ? "text-success-600" : "text-warning-600"
          }`}
        >
          {hasDate ? "✓ วันที่" : "✗ วันที่"}
        </span>
      </div>
    </div>
  );
}

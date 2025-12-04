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
        className={`w-full p-2 bg-primary-50 border border-primary ${className}`}
      >
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="flex items-center gap-2 text-primary">
            <RefreshCw className="animate-spin" />
            <span className="font-medium">กำลังตรวจสอบรูปภาพ Invoice...</span>
          </div>
          <Progress isIndeterminate color="primary" className="max-w-md" />
          <div>
            AI กำลังวิเคราะห์ลายเซ็น 4 ช่อง, รอยขีดข่วน และความสมบูรณ์ของเอกสาร
          </div>
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
        className={`w-full p-2 bg-success-50 border border-success ${className}`}
      >
        <div className="flex items-center gap-2">
          <CheckCircle className="text-success flex-shrink-0" />
          <div className="flex-1">
            <div className="font-medium text-success">
              ✅ เอกสารผ่านการตรวจสอบทุกเกณฑ์
            </div>
            {summary && <div className="text-success mt-2">{summary}</div>}
            {message && <div className="text-success mt-2">{message}</div>}
          </div>
          {score !== undefined && score !== null && (
            <Chip color="success" variant="flat">
              คะแนน: {score}/100
            </Chip>
          )}
        </div>

        {details?.signatures && (
          <div className="mt-2 pt-2 border-t border-success">
            <div className="font-semibold text-success mb-2">
              ลายเซ็นครบ {details.signatures.totalFound}/4 ช่อง
            </div>
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
        return <PenTool />;
      case "scratches":
      case "cross_outs":
        return <Eraser />;
      case "unauthorized_marks":
      case "number_corrections":
      case "liquid_paper":
      case "penMarks":
        return <FileWarning />;
      case "invalid_document":
      case "invalid":
        return <FileX />;
      case "image_quality":
      case "blurry":
      case "incomplete":
      case "clarity":
        return <ImageOff />;
      case "tears":
      case "stains":
      case "missing_parts":
      case "damage":
        return <FileWarning />;
      default:
        return <Info />;
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
      <div
        className={`p-2 border ${
          isRejected
            ? "bg-danger-50 border-danger"
            : needsReview
            ? "bg-warning-50 border-warning"
            : "bg-warning-50 border-warning"
        }`}
      >
        <div className="flex flex-col xl:flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            {isRejected ? (
              <XCircle className="text-danger" />
            ) : (
              <AlertTriangle className="text-warning" />
            )}
            <div>
              <div
                className={`font-semibold ${
                  isRejected ? "text-danger" : "text-warning"
                }`}
              >
                {isRejected
                  ? "❌ เอกสารไม่ผ่านการตรวจสอบ"
                  : "⚠️ พบข้อสังเกตในเอกสาร"}
              </div>
              <div>
                {errorWarnings.length > 0 &&
                  `${errorWarnings.length} ปัญหาร้ายแรง`}
                {errorWarnings.length > 0 && normalWarnings.length > 0 && ", "}
                {normalWarnings.length > 0 &&
                  `${normalWarnings.length} ข้อควรระวัง`}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {decision && (
              <Chip color={getDecisionColor(decision)} variant="flat">
                {getDecisionText(decision)}
              </Chip>
            )}
            {score !== undefined && score !== null && (
              <Chip
                color={
                  score >= 80 ? "success" : score >= 50 ? "warning" : "danger"
                }
                variant="flat"
              >
                {score}/100
              </Chip>
            )}
            {onRetry && (
              <Button
                variant="light"
                color="default"
                startContent={<RefreshCw />}
                onPress={onRetry}
              >
                ตรวจใหม่
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="border border-t-0 border-gray divide-y divide-gray">
        {errorWarnings.length > 0 && (
          <div className="p-2 bg-danger-50">
            <div className="font-semibold text-danger uppercase mb-2">
              🚫 ปัญหาร้ายแรง (ต้องแก้ไข)
            </div>
            <div className="space-y-2">
              {errorWarnings.map((issue, idx) => (
                <div
                  key={`critical-${idx}`}
                  className="flex items-start gap-2 p-2 bg-white border border-danger"
                >
                  <span className="text-danger mt-0.5">
                    {getWarningIcon(issue.type)}
                  </span>
                  <div className="flex-1">
                    <div className="font-medium text-danger">
                      {issue.message}
                    </div>
                    {issue.details && (
                      <div className="text-danger mt-0.5">{issue.details}</div>
                    )}
                    {issue.locations && issue.locations.length > 0 && (
                      <div className="text-danger mt-0.5">
                        ตำแหน่ง: {issue.locations.join(", ")}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {normalWarnings.length > 0 && (
          <div className="p-2 bg-warning-50">
            <div className="font-semibold text-warning uppercase mb-2">
              ⚠️ ข้อควรระวัง
            </div>
            <div className="space-y-2">
              {normalWarnings.map((warning, idx) => (
                <div
                  key={`warning-${idx}`}
                  className="flex items-start gap-2 p-2 bg-white border border-warning"
                >
                  <span className="text-warning mt-0.5">
                    {getWarningIcon(warning.type)}
                  </span>
                  <div className="flex-1">
                    <div className="font-medium text-warning">
                      {warning.message}
                    </div>
                    {warning.details && (
                      <div className="text-warning mt-0.5">
                        {warning.details}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {infoWarnings.length > 0 && (
          <div className="p-2 bg-primary-50">
            <div className="font-semibold text-primary uppercase mb-2">
              ข้อมูลเพิ่มเติม
            </div>
            <div className="space-y-2">
              {infoWarnings.map((warning, idx) => (
                <div
                  key={`info-${idx}`}
                  className="flex items-start gap-2 p-2 bg-white border border-primary"
                >
                  <span className="text-primary mt-0.5">
                    {getWarningIcon(warning.type)}
                  </span>
                  <div className="flex-1">
                    <div className="font-medium text-primary">
                      {warning.message}
                    </div>
                    {warning.details && (
                      <div className="text-primary mt-0.5">
                        {warning.details}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {details?.signatures && (
          <div className="p-2 bg-gray-50">
            <div className="font-semibold  uppercase mb-2">
              📝 สถานะลายเซ็น ({details.signatures.totalFound || 0}/4 ช่อง)
            </div>
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

        {details &&
          (details.cleanliness ||
            details.condition ||
            details.imageQuality) && (
            <div className="p-2 bg-gray-50">
              <div className="font-semibold  uppercase mb-2">
                📋 รายละเอียดการตรวจสอบ
              </div>
              <div className="flex flex-wrap gap-2">
                {details.invoiceInfo && (
                  <Chip
                    variant="flat"
                    color={
                      details.invoiceInfo.hasCompanyHeader
                        ? "success"
                        : "danger"
                    }
                    startContent={
                      details.invoiceInfo.hasCompanyHeader ? (
                        <CheckCircle />
                      ) : (
                        <XCircle />
                      )
                    }
                  >
                    เอกสาร Invoice
                  </Chip>
                )}
                {details.cleanliness && (
                  <Chip
                    variant="flat"
                    color={details.cleanliness.isClean ? "success" : "danger"}
                    startContent={
                      details.cleanliness.isClean ? (
                        <CheckCircle />
                      ) : (
                        <XCircle />
                      )
                    }
                  >
                    ความสะอาด
                  </Chip>
                )}
                {details.condition && (
                  <Chip
                    variant="flat"
                    color={
                      details.condition.isGoodCondition ? "success" : "warning"
                    }
                    startContent={
                      details.condition.isGoodCondition ? (
                        <CheckCircle />
                      ) : (
                        <AlertTriangle />
                      )
                    }
                  >
                    สภาพเอกสาร
                  </Chip>
                )}
                {details.imageQuality && (
                  <Chip
                    variant="flat"
                    color={
                      details.imageQuality.isAcceptable ? "success" : "warning"
                    }
                    startContent={
                      details.imageQuality.isAcceptable ? (
                        <CheckCircle />
                      ) : (
                        <AlertTriangle />
                      )
                    }
                  >
                    คุณภาพรูป
                  </Chip>
                )}
              </div>
            </div>
          )}

        {details &&
          !details.signatures &&
          (details.hasSignature !== undefined ||
            details.hasScratches !== undefined) && (
            <div className="p-2 bg-gray-50">
              <div className="font-semibold  uppercase mb-2">
                รายละเอียดการตรวจสอบ
              </div>
              <div className="flex flex-wrap gap-2">
                {details.hasSignature !== undefined && (
                  <Chip
                    variant="flat"
                    color={details.hasSignature ? "success" : "warning"}
                    startContent={
                      details.hasSignature ? <CheckCircle /> : <XCircle />
                    }
                  >
                    ลายเซ็น: {details.hasSignature ? "พบ" : "ไม่พบ"}
                  </Chip>
                )}
                {details.hasScratches !== undefined && (
                  <Chip
                    variant="flat"
                    color={!details.hasScratches ? "success" : "warning"}
                    startContent={
                      !details.hasScratches ? (
                        <CheckCircle />
                      ) : (
                        <AlertTriangle />
                      )
                    }
                  >
                    รอยขีดข่วน: {details.hasScratches ? "พบ" : "ไม่พบ"}
                  </Chip>
                )}
                {details.hasPenMarks !== undefined && (
                  <Chip
                    variant="flat"
                    color={!details.hasPenMarks ? "success" : "warning"}
                    startContent={
                      !details.hasPenMarks ? <CheckCircle /> : <AlertTriangle />
                    }
                  >
                    รอยปากกา: {details.hasPenMarks ? "พบ" : "ไม่พบ"}
                  </Chip>
                )}
                {details.isDocumentClear !== undefined && (
                  <Chip
                    variant="flat"
                    color={details.isDocumentClear ? "success" : "warning"}
                    startContent={
                      details.isDocumentClear ? (
                        <CheckCircle />
                      ) : (
                        <AlertTriangle />
                      )
                    }
                  >
                    ความชัดเจน: {details.isDocumentClear ? "ดี" : "ไม่ชัด"}
                  </Chip>
                )}
              </div>
            </div>
          )}

        {failedCriteria.length > 0 && (
          <div className="p-2 bg-danger-50/30">
            <div className="font-semibold text-danger uppercase mb-2">
              เกณฑ์ที่ไม่ผ่าน
            </div>
            <ul className="list-disc list-inside text-danger space-y-2">
              {failedCriteria.map((criteria, idx) => (
                <li key={`failed-${idx}`}>{criteria}</li>
              ))}
            </ul>
          </div>
        )}

        {requiredActions.length > 0 && (
          <div className="p-2 bg-primary-50">
            <div className="font-semibold text-primary uppercase mb-2">
              🔧 สิ่งที่ต้องแก้ไข
            </div>
            <ul className="list-decimal list-inside text-primary space-y-2">
              {requiredActions.map((action, idx) => (
                <li key={`action-${idx}`}>{action}</li>
              ))}
            </ul>
          </div>
        )}

        {suggestions && suggestions.length > 0 && (
          <div className="p-2 bg-gray-50">
            <div className="font-semibold  uppercase mb-2">คำแนะนำ</div>
            <ul className="list-disc list-inside  space-y-2">
              {suggestions.map((suggestion, idx) => (
                <li key={`suggestion-${idx}`}>{suggestion}</li>
              ))}
            </ul>
          </div>
        )}

        {summary && (
          <div className="p-2 bg-gray-50">
            <div>
              <span className="font-medium">สรุป: </span>
              {summary}
            </div>
          </div>
        )}

        {reason && (
          <div className="p-2 bg-gray-50">
            <div>
              <span className="font-medium">เหตุผล: </span>
              {reason}
            </div>
          </div>
        )}

        <div
          className={`p-2 border-t ${
            canProceed !== false
              ? "bg-blue-50 border-blue"
              : "bg-danger-50 border-danger"
          }`}
        >
          <div className="flex items-center gap-2">
            {canProceed !== false ? (
              <>
                <FileCheck className="text-blue" />
                <div className="text-blue">
                  คุณยังสามารถบันทึกข้อมูลได้
                  แต่กรุณาตรวจสอบความถูกต้องของเอกสารก่อน
                </div>
              </>
            ) : (
              <>
                <XCircle className="text-danger" />
                <div className="text-danger font-medium">
                  กรุณาถ่ายรูปใหม่ เอกสารไม่ผ่านเกณฑ์ที่กำหนด
                </div>
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
      variant="flat"
      color={isComplete ? "success" : "warning"}
      startContent={isComplete ? <CheckCircle /> : <AlertTriangle />}
    >
      {label}: {isComplete ? "✓" : "ไม่ครบ"}
    </Chip>
  );
}

function SignatureStatusCard({ label, sublabel, data }) {
  if (!data) {
    return (
      <div className="p-2 bg-gray border border-gray">
        <div className="font-medium ">{label}</div>
        <div>{sublabel}</div>
        <div className=" mt-2">ไม่มีข้อมูล</div>
      </div>
    );
  }

  const hasSignature = data.hasSignature;
  const hasDate = data.hasDate;
  const isComplete = hasSignature && hasDate;

  return (
    <div
      className={`p-2 border ${
        isComplete
          ? "bg-success-50 border-success"
          : hasSignature
          ? "bg-warning-50 border-warning"
          : "bg-danger-50 border-danger"
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <div
            className={`font-medium ${
              isComplete
                ? "text-success"
                : hasSignature
                ? "text-warning"
                : "text-danger"
            }`}
          >
            {label}
          </div>
          <div>{sublabel}</div>
        </div>
        {isComplete ? (
          <CheckCircle className="text-success" />
        ) : hasSignature ? (
          <AlertTriangle className="text-warning" />
        ) : (
          <XCircle className="text-danger" />
        )}
      </div>
      <div className="mt-2 flex gap-2">
        <span className={`${hasSignature ? "text-success" : "text-danger"}`}>
          {hasSignature ? "✓ ลายเซ็น" : "✗ ลายเซ็น"}
        </span>
        <span className={`${hasDate ? "text-success" : "text-warning"}`}>
          {hasDate ? "✓ วันที่" : "✗ วันที่"}
        </span>
      </div>
    </div>
  );
}

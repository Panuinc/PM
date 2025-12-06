"use client";

import React from "react";
import { Button, Progress, Chip, Card, CardBody } from "@heroui/react";
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
  Sparkles,
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  Calendar,
  Signature,
  ScanLine,
  FileSearch,
  Lightbulb,
  ArrowRight,
  Clock,
} from "lucide-react";

// Animated Loading Skeleton
const LoadingSkeleton = () => (
  <div className="space-y-3">
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 rounded-xl bg-primary/20 animate-pulse" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-primary/20 rounded-full w-3/4 animate-pulse" />
        <div className="h-3 bg-primary/10 rounded-full w-1/2 animate-pulse" />
      </div>
    </div>
    <div className="grid grid-cols-4 gap-2">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="h-16 rounded-xl bg-primary/10 animate-pulse"
          style={{ animationDelay: `${i * 100}ms` }}
        />
      ))}
    </div>
  </div>
);

// Status Badge Component
const StatusBadge = ({ status, score }) => {
  const configs = {
    ACCEPT: {
      color: "success",
      icon: ShieldCheck,
      text: "ผ่านการตรวจสอบ",
      bg: "bg-success-500",
    },
    REJECT: {
      color: "danger",
      icon: ShieldX,
      text: "ไม่ผ่านการตรวจสอบ",
      bg: "bg-danger-500",
    },
    NEED_REVIEW: {
      color: "warning",
      icon: ShieldAlert,
      text: "ต้องตรวจสอบเพิ่ม",
      bg: "bg-warning-500",
    },
  };

  const config = configs[status] || configs.NEED_REVIEW;
  const Icon = config.icon;

  return (
    <div className="flex items-center gap-4">
      <div className={`p-2 rounded-xl ${config.bg} text-white shadow-md`}>
        <Icon size={20} />
      </div>
      <div>
        <div className="font-semibold text-foreground">{config.text}</div>
        {score !== undefined && score !== null && (
          <div className="text-sm text-default-500">คะแนน: {score}/100</div>
        )}
      </div>
    </div>
  );
};

// Issue Card Component
const IssueCard = ({ issue, severity = "warning" }) => {
  const severityStyles = {
    error: {
      bg: "bg-danger-50",
      border: "border-danger-200",
      iconBg: "bg-danger-100",
      iconColor: "text-danger-600",
      textColor: "text-danger-700",
    },
    critical: {
      bg: "bg-danger-50",
      border: "border-danger-200",
      iconBg: "bg-danger-100",
      iconColor: "text-danger-600",
      textColor: "text-danger-700",
    },
    warning: {
      bg: "bg-warning-50",
      border: "border-warning-200",
      iconBg: "bg-warning-100",
      iconColor: "text-warning-600",
      textColor: "text-warning-700",
    },
    info: {
      bg: "bg-primary-50",
      border: "border-primary-200",
      iconBg: "bg-primary-100",
      iconColor: "text-primary-600",
      textColor: "text-primary-700",
    },
  };

  const style = severityStyles[severity] || severityStyles.warning;

  const getIcon = (type) => {
    const icons = {
      signature_incomplete: PenTool,
      signature_missing: PenTool,
      signature: PenTool,
      scratches: Eraser,
      cross_outs: Eraser,
      unauthorized_marks: FileWarning,
      number_corrections: FileWarning,
      liquid_paper: FileWarning,
      penMarks: FileWarning,
      invalid_document: FileX,
      invalid: FileX,
      image_quality: ImageOff,
      blurry: ImageOff,
      incomplete: ImageOff,
      clarity: ImageOff,
      tears: FileWarning,
      stains: FileWarning,
      missing_parts: FileWarning,
      damage: FileWarning,
    };
    const IconComponent = icons[type] || Info;
    return <IconComponent size={18} />;
  };

  return (
    <div
      className={`
        flex items-start gap-4 p-4 rounded-xl border
        ${style.bg} ${style.border}
        transition-all duration-200 hover:shadow-md
      `}
    >
      <div className={`p-2 rounded-lg ${style.iconBg} ${style.iconColor}`}>
        {getIcon(issue.type)}
      </div>
      <div className="flex-1 min-w-0">
        <div className={`font-medium ${style.textColor}`}>{issue.message}</div>
        {issue.details && (
          <div className={`text-sm mt-1 ${style.textColor} opacity-80`}>
            {issue.details}
          </div>
        )}
        {issue.locations && issue.locations.length > 0 && (
          <div className="flex items-center gap-2 mt-2 text-sm text-default-500">
            <ScanLine size={14} />
            <span>ตำแหน่ง: {issue.locations.join(", ")}</span>
          </div>
        )}
      </div>
    </div>
  );
};

// Signature Status Card Component
const SignatureCard = ({ label, sublabel, data }) => {
  if (!data) {
    return (
      <div className="p-4 rounded-xl bg-default-100 border border-default-200">
        <div className="flex items-center justify-between mb-2">
          <div>
            <div className="font-medium text-default-600">{label}</div>
            <div className="text-xs text-default-400">{sublabel}</div>
          </div>
          <div className="p-2 rounded-lg bg-default-200">
            <Signature size={16} className="text-default-400" />
          </div>
        </div>
        <div className="text-sm text-default-400">ไม่มีข้อมูล</div>
      </div>
    );
  }

  const hasSignature = data.hasSignature;
  const hasDate = data.hasDate;
  const isComplete = hasSignature && hasDate;

  const styles = isComplete
    ? {
        bg: "bg-success-50",
        border: "border-success-200",
        iconBg: "bg-success-500",
        labelColor: "text-success-700",
      }
    : hasSignature
    ? {
        bg: "bg-warning-50",
        border: "border-warning-200",
        iconBg: "bg-warning-500",
        labelColor: "text-warning-700",
      }
    : {
        bg: "bg-danger-50",
        border: "border-danger-200",
        iconBg: "bg-danger-500",
        labelColor: "text-danger-700",
      };

  return (
    <div
      className={`p-4 rounded-xl border ${styles.bg} ${styles.border} transition-all duration-200 hover:shadow-md`}
    >
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className={`font-medium ${styles.labelColor}`}>{label}</div>
          <div className="text-xs text-default-500">{sublabel}</div>
        </div>
        <div className={`p-2 rounded-lg ${styles.iconBg} text-white`}>
          {isComplete ? (
            <CheckCircle size={16} />
          ) : hasSignature ? (
            <AlertTriangle size={16} />
          ) : (
            <XCircle size={16} />
          )}
        </div>
      </div>
      <div className="flex gap-4">
        <div
          className={`flex items-center gap-2 text-sm ${
            hasSignature ? "text-success-600" : "text-danger-600"
          }`}
        >
          {hasSignature ? <CheckCircle size={14} /> : <XCircle size={14} />}
          <span>ลายเซ็น</span>
        </div>
        <div
          className={`flex items-center gap-2 text-sm ${
            hasDate ? "text-success-600" : "text-warning-600"
          }`}
        >
          {hasDate ? <CheckCircle size={14} /> : <Clock size={14} />}
          <span>วันที่</span>
        </div>
      </div>
    </div>
  );
};

// Detail Chip Component
const DetailChip = ({ icon: Icon, label, status, statusText }) => {
  const colors = {
    success: {
      bg: "bg-success-100",
      text: "text-success-700",
      icon: "text-success-600",
    },
    warning: {
      bg: "bg-warning-100",
      text: "text-warning-700",
      icon: "text-warning-600",
    },
    danger: {
      bg: "bg-danger-100",
      text: "text-danger-700",
      icon: "text-danger-600",
    },
  };

  const style = colors[status] || colors.warning;

  return (
    <div
      className={`
        inline-flex items-center gap-2 px-3 py-2 rounded-xl
        ${style.bg} transition-all duration-200 hover:shadow-md
      `}
    >
      <Icon size={16} className={style.icon} />
      <span className={`text-sm font-medium ${style.text}`}>
        {label}: {statusText}
      </span>
    </div>
  );
};

// Section Header Component
const SectionHeader = ({ icon: Icon, title, color = "default" }) => {
  const colors = {
    danger: "text-danger-600 bg-danger-100",
    warning: "text-warning-600 bg-warning-100",
    success: "text-success-600 bg-success-100",
    primary: "text-primary-600 bg-primary-100",
    default: "text-default-600 bg-default-100",
  };

  return (
    <div className="flex items-center gap-2 mb-3">
      <div className={`p-2 rounded-lg ${colors[color]}`}>
        <Icon size={16} />
      </div>
      <span className="font-semibold text-foreground">{title}</span>
    </div>
  );
};

// Main Component
export default function UIInvoiceValidationResult({
  isValidating,
  validationResult,
  onRetry,
  className = "",
}) {
  // Loading State
  if (isValidating) {
    return (
      <Card
        className={`w-full border border-primary-200 bg-gradient-to-br from-primary-50 to-white overflow-hidden ${className}`}
        radius="lg"
      >
        <CardBody className="p-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-2.5 rounded-xl bg-primary-500 text-white animate-pulse">
              <Sparkles size={20} />
            </div>
            <div>
              <div className="font-semibold text-primary-700">
                กำลังตรวจสอบเอกสาร...
              </div>
              <div className="text-sm text-primary-500">
                AI กำลังวิเคราะห์ลายเซ็น รอยขีดข่วน และความสมบูรณ์
              </div>
            </div>
          </div>
          <Progress
            isIndeterminate
            color="primary"
            className="mb-4"
            classNames={{
              track: "bg-primary-100",
              indicator: "bg-gradient-to-r from-primary-400 to-primary-600",
            }}
          />
          <LoadingSkeleton />
        </CardBody>
      </Card>
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

  // Success State
  if (isFullyPassed) {
    return (
      <Card
        className={`w-full border-2 border-success-200 bg-gradient-to-br from-success-50 via-white to-success-50/30 overflow-hidden ${className}`}
        radius="lg"
      >
        <CardBody className="p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="p-4 rounded-2xl bg-success-500 text-white shadow-md shadow-success-500/30">
                  <ShieldCheck size={28} />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-success-400 rounded-full animate-ping" />
              </div>
              <div>
                <div className="text-xl font-bold text-success-700">
                  ผ่านการตรวจสอบทุกเกณฑ์
                </div>
                {(summary || message) && (
                  <div className="text-sm text-success-600 mt-1">
                    {summary || message}
                  </div>
                )}
              </div>
            </div>
            {score !== undefined && score !== null && (
              <div className="text-center">
                <div className="text-3xl font-bold text-success-600">
                  {score}
                </div>
                <div className="text-xs text-success-500">/ 100</div>
              </div>
            )}
          </div>

          {/* Signatures */}
          {details?.signatures && (
            <div className="pt-4 border-t border-success-200">
              <SectionHeader
                icon={Signature}
                title={`ลายเซ็นครบ ${details.signatures.totalFound}/4 ช่อง`}
                color="success"
              />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <SignatureCard
                  label="ผู้รับของ"
                  sublabel="Received by"
                  data={details.signatures.receivedBy}
                />
                <SignatureCard
                  label="ผู้ส่งของ"
                  sublabel="Delivered by"
                  data={details.signatures.deliveredBy}
                />
                <SignatureCard
                  label="ผู้ตรวจสอบ"
                  sublabel="Checked by"
                  data={details.signatures.checkedBy}
                />
                <SignatureCard
                  label="ผู้จัดทำ"
                  sublabel="Issued by"
                  data={details.signatures.issuedBy}
                />
              </div>
            </div>
          )}
        </CardBody>
      </Card>
    );
  }

  // Warning/Error State
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

  const headerStyles = isRejected
    ? {
        gradient: "from-danger-50 via-white to-danger-50/30",
        border: "border-danger-200",
        iconBg: "bg-danger-500",
        titleColor: "text-danger-700",
      }
    : {
        gradient: "from-warning-50 via-white to-warning-50/30",
        border: "border-warning-200",
        iconBg: "bg-warning-500",
        titleColor: "text-warning-700",
      };

  return (
    <Card
      className={`w-full border-2 ${headerStyles.border} bg-gradient-to-br ${headerStyles.gradient} overflow-hidden ${className}`}
      radius="lg"
    >
      <CardBody className="p-0">
        {/* Header Section */}
        <div className="p-4 pb-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div
                className={`p-4 rounded-2xl ${headerStyles.iconBg} text-white shadow-md`}
              >
                {isRejected ? <ShieldX size={28} /> : <ShieldAlert size={28} />}
              </div>
              <div>
                <div className={`text-xl font-bold ${headerStyles.titleColor}`}>
                  {isRejected
                    ? "เอกสารไม่ผ่านการตรวจสอบ"
                    : "พบข้อสังเกตในเอกสาร"}
                </div>
                <div className="text-sm text-default-500 mt-1">
                  {errorWarnings.length > 0 && (
                    <span className="text-danger-600">
                      {errorWarnings.length} ปัญหาร้ายแรง
                    </span>
                  )}
                  {errorWarnings.length > 0 && normalWarnings.length > 0 && (
                    <span> • </span>
                  )}
                  {normalWarnings.length > 0 && (
                    <span className="text-warning-600">
                      {normalWarnings.length} ข้อควรระวัง
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {decision && <StatusBadge status={decision} score={score} />}
              {onRetry && (
                <Button
                  variant="flat"
                  color="primary"
                  radius="full"
                  startContent={<RefreshCw size={16} />}
                  onPress={onRetry}
                  className="font-medium"
                >
                  ตรวจใหม่
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Issues Sections */}
        <div className="space-y-0 divide-y divide-default-200">
          {/* Critical Issues */}
          {errorWarnings.length > 0 && (
            <div className="p-4 bg-danger-50/50">
              <SectionHeader
                icon={XCircle}
                title="ปัญหาร้ายแรง (ต้องแก้ไข)"
                color="danger"
              />
              <div className="space-y-3">
                {errorWarnings.map((issue, idx) => (
                  <IssueCard
                    key={`critical-${idx}`}
                    issue={issue}
                    severity="error"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Warnings */}
          {normalWarnings.length > 0 && (
            <div className="p-4 bg-warning-50/50">
              <SectionHeader
                icon={AlertTriangle}
                title="ข้อควรระวัง"
                color="warning"
              />
              <div className="space-y-3">
                {normalWarnings.map((warning, idx) => (
                  <IssueCard
                    key={`warning-${idx}`}
                    issue={warning}
                    severity="warning"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Info */}
          {infoWarnings.length > 0 && (
            <div className="p-4 bg-primary-50/50">
              <SectionHeader
                icon={Info}
                title="ข้อมูลเพิ่มเติม"
                color="primary"
              />
              <div className="space-y-3">
                {infoWarnings.map((warning, idx) => (
                  <IssueCard
                    key={`info-${idx}`}
                    issue={warning}
                    severity="info"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Signatures */}
          {details?.signatures && (
            <div className="p-4 bg-default-50/50">
              <SectionHeader
                icon={Signature}
                title={`สถานะลายเซ็น (${
                  details.signatures.totalFound || 0
                }/4 ช่อง)`}
              />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <SignatureCard
                  label="ผู้รับของ"
                  sublabel="Received by"
                  data={details.signatures.receivedBy}
                />
                <SignatureCard
                  label="ผู้ส่งของ"
                  sublabel="Delivered by"
                  data={details.signatures.deliveredBy}
                />
                <SignatureCard
                  label="ผู้ตรวจสอบ"
                  sublabel="Checked by"
                  data={details.signatures.checkedBy}
                />
                <SignatureCard
                  label="ผู้จัดทำ"
                  sublabel="Issued by"
                  data={details.signatures.issuedBy}
                />
              </div>
            </div>
          )}

          {/* Document Details */}
          {details &&
            (details.cleanliness ||
              details.condition ||
              details.imageQuality) && (
              <div className="p-4 bg-default-50/50">
                <SectionHeader icon={FileSearch} title="รายละเอียดการตรวจสอบ" />
                <div className="flex flex-wrap gap-2">
                  {details.invoiceInfo && (
                    <DetailChip
                      icon={FileCheck}
                      label="เอกสาร Invoice"
                      status={
                        details.invoiceInfo.hasCompanyHeader
                          ? "success"
                          : "danger"
                      }
                      statusText={
                        details.invoiceInfo.hasCompanyHeader
                          ? "ถูกต้อง"
                          : "ไม่พบ"
                      }
                    />
                  )}
                  {details.cleanliness && (
                    <DetailChip
                      icon={Sparkles}
                      label="ความสะอาด"
                      status={
                        details.cleanliness.isClean ? "success" : "danger"
                      }
                      statusText={
                        details.cleanliness.isClean ? "สะอาด" : "มีรอย"
                      }
                    />
                  )}
                  {details.condition && (
                    <DetailChip
                      icon={FileCheck}
                      label="สภาพเอกสาร"
                      status={
                        details.condition.isGoodCondition
                          ? "success"
                          : "warning"
                      }
                      statusText={
                        details.condition.isGoodCondition
                          ? "ดี"
                          : "มีความเสียหาย"
                      }
                    />
                  )}
                  {details.imageQuality && (
                    <DetailChip
                      icon={ImageOff}
                      label="คุณภาพรูป"
                      status={
                        details.imageQuality.isAcceptable
                          ? "success"
                          : "warning"
                      }
                      statusText={
                        details.imageQuality.isAcceptable ? "ดี" : "ไม่ชัด"
                      }
                    />
                  )}
                </div>
              </div>
            )}

          {/* Legacy Details Format */}
          {details &&
            !details.signatures &&
            (details.hasSignature !== undefined ||
              details.hasScratches !== undefined) && (
              <div className="p-4 bg-default-50/50">
                <SectionHeader icon={FileSearch} title="รายละเอียดการตรวจสอบ" />
                <div className="flex flex-wrap gap-2">
                  {details.hasSignature !== undefined && (
                    <DetailChip
                      icon={PenTool}
                      label="ลายเซ็น"
                      status={details.hasSignature ? "success" : "warning"}
                      statusText={details.hasSignature ? "พบ" : "ไม่พบ"}
                    />
                  )}
                  {details.hasScratches !== undefined && (
                    <DetailChip
                      icon={Eraser}
                      label="รอยขีดข่วน"
                      status={!details.hasScratches ? "success" : "warning"}
                      statusText={details.hasScratches ? "พบ" : "ไม่พบ"}
                    />
                  )}
                  {details.hasPenMarks !== undefined && (
                    <DetailChip
                      icon={PenTool}
                      label="รอยปากกา"
                      status={!details.hasPenMarks ? "success" : "warning"}
                      statusText={details.hasPenMarks ? "พบ" : "ไม่พบ"}
                    />
                  )}
                  {details.isDocumentClear !== undefined && (
                    <DetailChip
                      icon={ScanLine}
                      label="ความชัดเจน"
                      status={details.isDocumentClear ? "success" : "warning"}
                      statusText={details.isDocumentClear ? "ดี" : "ไม่ชัด"}
                    />
                  )}
                </div>
              </div>
            )}

          {/* Failed Criteria */}
          {failedCriteria.length > 0 && (
            <div className="p-4 bg-danger-50/30">
              <SectionHeader
                icon={XCircle}
                title="เกณฑ์ที่ไม่ผ่าน"
                color="danger"
              />
              <ul className="space-y-2">
                {failedCriteria.map((criteria, idx) => (
                  <li
                    key={`failed-${idx}`}
                    className="flex items-start gap-2 text-danger-700"
                  >
                    <ArrowRight size={16} className="mt-0.5 flex-shrink-0" />
                    <span>{criteria}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Required Actions */}
          {requiredActions.length > 0 && (
            <div className="p-4 bg-primary-50/50">
              <SectionHeader
                icon={FileWarning}
                title="สิ่งที่ต้องแก้ไข"
                color="primary"
              />
              <ol className="space-y-2">
                {requiredActions.map((action, idx) => (
                  <li
                    key={`action-${idx}`}
                    className="flex items-start gap-4 text-primary-700"
                  >
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-500 text-white text-sm flex items-center justify-center font-medium">
                      {idx + 1}
                    </span>
                    <span className="pt-0.5">{action}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Suggestions */}
          {suggestions && suggestions.length > 0 && (
            <div className="p-4 bg-default-50/50">
              <SectionHeader icon={Lightbulb} title="คำแนะนำ" />
              <ul className="space-y-2">
                {suggestions.map((suggestion, idx) => (
                  <li
                    key={`suggestion-${idx}`}
                    className="flex items-start gap-2 text-default-600"
                  >
                    <span className="text-warning-500">💡</span>
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Summary & Reason */}
          {(summary || reason) && (
            <div className="p-4 bg-default-50/50">
              {summary && (
                <div className="mb-2">
                  <span className="font-semibold text-foreground">สรุป: </span>
                  <span className="text-default-600">{summary}</span>
                </div>
              )}
              {reason && (
                <div>
                  <span className="font-semibold text-foreground">
                    เหตุผล:{" "}
                  </span>
                  <span className="text-default-600">{reason}</span>
                </div>
              )}
            </div>
          )}

          {/* Footer Action Bar */}
          <div
            className={`p-4 ${
              canProceed !== false
                ? "bg-gradient-to-r from-primary-50 to-primary-100/50"
                : "bg-gradient-to-r from-danger-50 to-danger-100/50"
            }`}
          >
            <div className="flex items-center gap-4">
              {canProceed !== false ? (
                <>
                  <div className="p-2 rounded-xl bg-primary-500 text-white">
                    <FileCheck size={18} />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-primary-700">
                      สามารถดำเนินการต่อได้
                    </div>
                    <div className="text-sm text-primary-600">
                      กรุณาตรวจสอบความถูกต้องของเอกสารก่อนบันทึก
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="p-2 rounded-xl bg-danger-500 text-white">
                    <XCircle size={18} />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-danger-700">
                      กรุณาถ่ายรูปใหม่
                    </div>
                    <div className="text-sm text-danger-600">
                      เอกสารไม่ผ่านเกณฑ์ที่กำหนด
                    </div>
                  </div>
                  {onRetry && (
                    <Button
                      color="danger"
                      variant="flat"
                      radius="full"
                      startContent={<RefreshCw size={16} />}
                      onPress={onRetry}
                    >
                      ถ่ายรูปใหม่
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
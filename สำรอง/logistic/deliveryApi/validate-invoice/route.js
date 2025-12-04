import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

const VISION_MODEL =
  process.env.OPENROUTER_VISION_MODEL || "nvidia/nemotron-nano-12b-v2-vl:free";

function unknownToNull(v) {
  if (v === "unknown") return null;
  if (Array.isArray(v)) return v.map(unknownToNull);
  if (v && typeof v === "object") {
    const out = {};
    for (const k of Object.keys(v)) out[k] = unknownToNull(v[k]);
    return out;
  }
  return v;
}

function computeSignatures(sig = {}) {
  const keys = ["receivedBy", "deliveredBy", "checkedBy", "issuedBy"];

  for (const k of keys) {
    const cur = sig[k] ?? {};
    sig[k] = {
      hasSignature:
        cur.hasSignature === true
          ? true
          : cur.hasSignature === false
          ? false
          : null,
      hasDate:
        cur.hasDate === true ? true : cur.hasDate === false ? false : null,
      details: cur.details ?? cur.evidence ?? "",
    };
  }

  let totalFound = 0;
  for (const k of keys) {
    const complete = sig[k].hasSignature === true && sig[k].hasDate === true;
    if (complete) totalFound++;
  }

  return {
    ...sig,
    totalFound,
    allFourComplete: totalFound === 4,
    summary: sig.summary || "",
  };
}

function mergeAiStringsIntoIssues({
  aiStrings,
  target,
  severity,
  type = "ai_detected",
}) {
  if (!Array.isArray(aiStrings)) return;
  for (const msg of aiStrings) {
    if (typeof msg !== "string" || !msg.trim()) continue;
    if (!target.some((x) => x.message === msg)) {
      target.push({ type, severity, message: msg });
    }
  }
}

const PROMPT = `คุณเป็นผู้เชี่ยวชาญในการตรวจสอบเอกสาร Invoice/ใบส่งสินค้า/ใบกำกับภาษี ของบริษัท C.H.H. INDUSTRY CO., LTD.
งานของคุณคือตรวจจากภาพเท่านั้น ห้ามเดา หากไม่ชัดให้ตอบ "unknown"

## กฎเหล็ก:
- ห้ามคาดเดา: ถ้าไม่ชัด/ไม่มั่นใจ ให้ตอบ "unknown"
- ตอบเป็น JSON เพียว ๆ เท่านั้น (ไม่มี markdown ไม่มีข้อความนอก JSON)
- ห้ามใส่ key อื่นนอก schema
- boolean ต้องเป็น true/false/unknown เท่านั้น
- string ต้องเป็น string/unknown เท่านั้น

## ตอบ JSON ตาม schema นี้เป๊ะ:
{
  "isValidInvoice": true/false/unknown,
  "extractedData": {
    "companyName": "string|unknown",
    "invoiceNumber": "string|unknown",
    "invoiceDate": "string|unknown",
    "totalAmount": "string|unknown",
    "customerName": "string|unknown",
    "confidence": {
      "companyName": 0-100,
      "invoiceNumber": 0-100,
      "invoiceDate": 0-100,
      "totalAmount": 0-100,
      "customerName": 0-100
    }
  },
  "invoiceInfo": {
    "hasCompanyHeader": true/false/unknown,
    "hasDocumentNumber": true/false/unknown,
    "documentNumber": "string|unknown",
    "hasDate": true/false/unknown,
    "documentDate": "string|unknown",
    "hasItemDetails": true/false/unknown,
    "hasTotalAmount": true/false/unknown,
    "totalAmount": "string|unknown",
    "hasVat": true/false/unknown,
    "description": "string"
  },
  "signatures": {
    "totalFound": 0-4,
    "allFourComplete": true/false,
    "receivedBy": { "hasSignature": true/false/unknown, "hasDate": true/false/unknown, "details": "string" },
    "deliveredBy": { "hasSignature": true/false/unknown, "hasDate": true/false/unknown, "details": "string" },
    "checkedBy": { "hasSignature": true/false/unknown, "hasDate": true/false/unknown, "details": "string" },
    "issuedBy": { "hasSignature": true/false/unknown, "hasDate": true/false/unknown, "details": "string" },
    "summary": "string"
  },
  "cleanliness": {
    "isClean": true/false/unknown,
    "hasUnauthorizedMarks": true/false/unknown,
    "hasScratches": true/false/unknown,
    "hasCrossOuts": true/false/unknown,
    "hasNumberCorrections": true/false/unknown,
    "hasLiquidPaper": true/false/unknown,
    "hasHighlights": true/false/unknown,
    "markLocations": ["string"],
    "details": "string"
  },
  "condition": {
    "isGoodCondition": true/false/unknown,
    "hasTears": true/false/unknown,
    "hasStains": true/false/unknown,
    "hasDamagingFolds": true/false/unknown,
    "hasMissingParts": true/false/unknown,
    "details": "string"
  },
  "imageQuality": {
    "isAcceptable": true/false/unknown,
    "isClear": true/false/unknown,
    "isProperlyLit": true/false/unknown,
    "isComplete": true/false/unknown,
    "isNotBlurry": true/false/unknown,
    "details": "string"
  },
  "overallResult": {
    "passed": true/false/unknown,
    "score": 0-100,
    "passedCriteria": ["string"],
    "failedCriteria": ["string"],
    "criticalIssues": ["string"],
    "warnings": ["string"],
    "summary": "string"
  },
  "recommendation": {
    "decision": "ACCEPT|REJECT|NEED_REVIEW",
    "canProceed": true/false/unknown,
    "reason": "string",
    "requiredActions": ["string"]
  }
}

ตอบ JSON เท่านั้น`;

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only images are allowed." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString("base64");
    const mediaType = file.type;

    const response = await client.chat.completions.create({
      model: VISION_MODEL,
      max_tokens: 4096,
      temperature: 0,
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: PROMPT },
            {
              type: "image_url",
              image_url: { url: `data:${mediaType};base64,${base64}` },
            },
          ],
        },
      ],
    });

    const content = response.choices?.[0]?.message?.content || "";
    let result;

    try {
      result = JSON.parse(content);
    } catch {
      const m = content.match(/\{[\s\S]*\}/);
      if (m) result = JSON.parse(m[0]);
    }

    if (!result || typeof result !== "object") {
      return NextResponse.json({
        valid: false,
        canProceed: false,
        decision: "NEED_REVIEW",
        score: 0,
        extractedData: null,
        criticalIssues: [
          {
            type: "system",
            severity: "critical",
            message: "ไม่สามารถอ่านผลลัพธ์ JSON จาก AI ได้",
          },
        ],
        warnings: [],
        allIssues: [],
        requiredActions: [],
        reason: "",
        summary: "ไม่สามารถวิเคราะห์รูปภาพได้ กรุณาตรวจสอบด้วยตนเอง",
        passedCriteria: [],
        failedCriteria: [],
      });
    }

    result = unknownToNull(result);
    if (result.signatures)
      result.signatures = computeSignatures(result.signatures);

    const warnings = [];
    const criticalIssues = [];

    if (result.isValidInvoice === false) {
      criticalIssues.push({
        type: "invalid_document",
        severity: "critical",
        message: "รูปภาพนี้ไม่ใช่เอกสาร Invoice/ใบส่งสินค้า",
        details: result.invoiceInfo?.description || "",
      });
    }

    if (result.signatures) {
      const sig = result.signatures;

      if (sig.allFourComplete !== true) {
        criticalIssues.push({
          type: "signature_incomplete",
          severity: "critical",
          message: `ลายเซ็นไม่ครบ 4 ช่อง (พบ ${sig.totalFound || 0}/4 ช่อง)`,
          details: sig.summary || "",
        });

        const map = [
          ["receivedBy", "ผู้รับของ/Received by"],
          ["deliveredBy", "ผู้ส่งของ/Delivered by"],
          ["checkedBy", "ผู้ตรวจสอบ/Checked by"],
          ["issuedBy", "ผู้จัดทำ/Issued by"],
        ];

        for (const [key, label] of map) {
          if (sig[key]?.hasSignature !== true) {
            warnings.push({
              type: "signature_missing",
              severity: "error",
              message: `ไม่พบลายเซ็นช่อง ${label}`,
              details: sig[key]?.details || "",
            });
          } else if (sig[key]?.hasDate !== true) {
            warnings.push({
              type: "signature_date_missing",
              severity: "error",
              message: `ไม่พบ “วันที่” ช่อง ${label}`,
              details: sig[key]?.details || "",
            });
          }
        }
      }
    }

    if (result.cleanliness) {
      const clean = result.cleanliness;

      if (clean.isClean === false) {
        if (clean.hasScratches === true) {
          criticalIssues.push({
            type: "scratches",
            severity: "critical",
            message: "พบรอยขีดข่วนบนเอกสาร",
            details: clean.details || "",
          });
        }
        if (clean.hasCrossOuts === true) {
          criticalIssues.push({
            type: "cross_outs",
            severity: "critical",
            message: "พบรอยขีดฆ่าบนเอกสาร",
            details: clean.details || "",
          });
        }
        if (clean.hasNumberCorrections === true) {
          criticalIssues.push({
            type: "number_corrections",
            severity: "critical",
            message: "พบการแก้ไขตัวเลขบนเอกสาร",
            details: clean.details || "",
          });
        }
        if (clean.hasLiquidPaper === true) {
          criticalIssues.push({
            type: "liquid_paper",
            severity: "critical",
            message: "พบรอยลิควิด/การลบแก้ไขบนเอกสาร",
            details: clean.details || "",
          });
        }
        if (clean.hasHighlights === true) {
          warnings.push({
            type: "highlights",
            severity: "warning",
            message: "พบรอยเน้น/วงกลมบนเอกสาร",
            details: clean.details || "",
          });
        }
        if (clean.hasUnauthorizedMarks === true) {
          criticalIssues.push({
            type: "unauthorized_marks",
            severity: "critical",
            message: "พบรอยปากกาที่ไม่ได้รับอนุญาตบนเอกสาร",
            details: clean.details || "",
            locations: clean.markLocations || [],
          });
        }
      }
    }

    if (result.condition) {
      const cond = result.condition;

      if (cond.isGoodCondition === false) {
        if (cond.hasTears === true) {
          criticalIssues.push({
            type: "tears",
            severity: "critical",
            message: "เอกสารมีรอยฉีกขาด",
            details: cond.details || "",
          });
        }
        if (cond.hasMissingParts === true) {
          criticalIssues.push({
            type: "missing_parts",
            severity: "critical",
            message: "เอกสารมีส่วนที่หายไป",
            details: cond.details || "",
          });
        }
        if (cond.hasStains === true) {
          warnings.push({
            type: "stains",
            severity: "warning",
            message: "เอกสารมีรอยเปื้อน",
            details: cond.details || "",
          });
        }
        if (cond.hasDamagingFolds === true) {
          warnings.push({
            type: "folds",
            severity: "warning",
            message: "เอกสารมีรอยพับที่กระทบข้อมูล",
            details: cond.details || "",
          });
        }
      }
    }

    if (result.imageQuality) {
      const img = result.imageQuality;

      if (img.isAcceptable === false) {
        warnings.push({
          type: "image_quality",
          severity: "warning",
          message: "คุณภาพรูปภาพไม่ดีพอ",
          details: img.details || "",
        });
      }
      if (img.isNotBlurry === false || img.isClear === false) {
        warnings.push({
          type: "blurry",
          severity: "warning",
          message: "รูปภาพเบลอหรือไม่ชัด",
        });
      }
      if (img.isComplete === false) {
        warnings.push({
          type: "incomplete",
          severity: "warning",
          message: "รูปภาพไม่ครบทั้งเอกสาร",
        });
      }
      if (img.isProperlyLit === false) {
        warnings.push({
          type: "lighting",
          severity: "warning",
          message: "แสงไม่เหมาะสม (มืด/สว่างเกินไป)",
        });
      }
    }

    mergeAiStringsIntoIssues({
      aiStrings: result.overallResult?.criticalIssues,
      target: criticalIssues,
      severity: "critical",
    });
    mergeAiStringsIntoIssues({
      aiStrings: result.overallResult?.warnings,
      target: warnings,
      severity: "warning",
    });

    const allIssues = [...criticalIssues, ...warnings];
    const hasCriticalIssues = criticalIssues.length > 0;

    let decision = result.recommendation?.decision || "NEED_REVIEW";
    if (hasCriticalIssues) decision = "REJECT";

    let canProceed = result.recommendation?.canProceed;
    if (canProceed == null) canProceed = !hasCriticalIssues;
    if (hasCriticalIssues) canProceed = false;

    const passed = decision === "ACCEPT" && !hasCriticalIssues;

    return NextResponse.json({
      valid: passed,
      canProceed,
      decision,
      score: result.overallResult?.score || 0,

      extractedData: result.extractedData || null,

      criticalIssues,
      warnings,
      allIssues,

      requiredActions: result.recommendation?.requiredActions || [],
      reason: result.recommendation?.reason || "",

      summary: result.overallResult?.summary || "",
      passedCriteria: result.overallResult?.passedCriteria || [],
      failedCriteria: result.overallResult?.failedCriteria || [],

      details: {
        invoiceInfo: result.invoiceInfo || null,
        signatures: result.signatures || null,
        cleanliness: result.cleanliness || null,
        condition: result.condition || null,
        imageQuality: result.imageQuality || null,
      },

      rawResult: process.env.NODE_ENV === "development" ? result : undefined,
    });
  } catch (error) {
    console.error("Invoice validation error:", error);

    return NextResponse.json({
      valid: false,
      canProceed: false,
      decision: "NEED_REVIEW",
      score: 0,
      extractedData: null,
      criticalIssues: [
        {
          type: "system_error",
          severity: "critical",
          message: "เกิดข้อผิดพลาดในระบบ กรุณาลองใหม่อีกครั้ง",
        },
      ],
      warnings: [],
      allIssues: [],
      requiredActions: [],
      reason: "",
      summary: "เกิดข้อผิดพลาดในการตรวจสอบ กรุณาตรวจสอบด้วยตนเองหรือลองใหม่",
      passedCriteria: [],
      failedCriteria: [],
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
}

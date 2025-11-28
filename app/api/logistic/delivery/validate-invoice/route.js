import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic();

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

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: mediaType,
                data: base64,
              },
            },
            {
              type: "text",
              text: `คุณเป็นผู้เชี่ยวชาญในการตรวจสอบเอกสาร Invoice/ใบส่งสินค้า/ใบกำกับภาษี ของบริษัท C.H.H. INDUSTRY CO., LTD.

## เกณฑ์การตรวจสอบที่ต้องผ่านทั้งหมด:

### 1. ความถูกต้องของเอกสาร (Document Validity)
- ต้องเป็นเอกสาร Invoice/ใบส่งสินค้า/ใบกำกับภาษีจริง
- ต้องมีหัวเอกสารระบุชื่อบริษัท ที่อยู่ เลขประจำตัวผู้เสียภาษี
- ต้องมีเลขที่เอกสาร วันที่ออกเอกสาร
- ต้องมีรายละเอียดสินค้า/บริการ จำนวน ราคา
- ต้องมียอดรวม และภาษีมูลค่าเพิ่ม (ถ้ามี)

### 2. ลายเซ็นครบถ้วน 4 ช่อง (Signature Completeness) - สำคัญมาก
เอกสารต้องมีลายเซ็นครบทั้ง 4 ช่อง (อยู่ด้านล่างของเอกสาร):
- ช่อง "ผู้รับของ/Received by" - ต้องมีลายเซ็นและวันที่
- ช่อง "ผู้ส่งของ/Delivered by" - ต้องมีลายเซ็นและวันที่
- ช่อง "ผู้ตรวจสอบ/Checked by" - ต้องมีลายเซ็นและวันที่
- ช่อง "ผู้จัดทำ/Issued by" - ต้องมีลายเซ็นและวันที่

**หมายเหตุ**: ลายเซ็นในแต่ละช่องอาจเป็นลายเซ็นจริงหรือตัวอักษรเขียนด้วยมือก็ได้ ขอให้มีการเซ็นกำกับ

### 3. ความสะอาดของเอกสาร (Document Cleanliness) - สำคัญมาก
- ห้ามมีรอยขีดข่วน รอยขีดฆ่า หรือรอยปากกาใดๆ นอกเหนือจากช่องลายเซ็น 4 ช่อง
- ห้ามมีรอยวงกลม รอยเน้น หรือรอยเขียนทับข้อความในส่วนรายละเอียดสินค้าหรือยอดเงิน
- ห้ามมีการแก้ไขตัวเลขหรือข้อความด้วยปากกา
- ห้ามมีรอยลิควิด (Liquid Paper/White Out) หรือการแก้ไขใดๆ
- รอยปากกาในช่องลายเซ็น 4 ช่องถือว่าปกติ ไม่นับเป็นปัญหา

### 4. สภาพเอกสาร (Document Condition)
- ห้ามชำรุด ฉีกขาด หรือมีรอยพับที่ทำให้อ่านข้อมูลสำคัญไม่ได้
- ห้ามมีรอยเปื้อน รอยน้ำ หรือรอยสกปรกที่บดบังข้อมูล
- ห้ามมีส่วนใดของเอกสารหายไปหรือถูกตัดออก
- รอยพับเล็กน้อยที่ไม่กระทบข้อมูลถือว่ายอมรับได้

### 5. คุณภาพรูปภาพ (Image Quality)
- รูปภาพต้องชัดเจน อ่านข้อความได้ทุกส่วน
- แสงสว่างเพียงพอ ไม่มืดหรือสว่างเกินไป
- ไม่เบลอ ครบทุกส่วนของเอกสาร
- ถ่ายครบทั้งเอกสาร ไม่ตัดส่วนใดออก

## ตอบเป็น JSON format เท่านั้น:
{
  "isValidInvoice": true/false,
  "extractedData": {
    "companyName": "ชื่อบริษัทที่ออกเอกสาร (ผู้ขาย) จากหัวเอกสารด้านบนซ้าย เช่น 'บริษัท ซื้อฮะฮวด อุตสาหกรรม จำกัด' หรือ null ถ้าไม่พบ",
    "invoiceNumber": "เลขที่เอกสารจากส่วน 'เลขที่/No.' เช่น IV2509-159 หรือ null ถ้าไม่พบ",
    "invoiceDate": "วันที่เอกสาร หรือ null",
    "totalAmount": "ยอดรวมสุทธิ หรือ null",
    "customerName": "ชื่อลูกค้า/ผู้รับสินค้า จากส่วน 'นามลูกค้า/Name' หรือ null ถ้าไม่พบ",
    "confidence": {
      "companyName": 0-100,
      "invoiceNumber": 0-100
    }
  },
  "invoiceInfo": {
    "hasCompanyHeader": true/false,
    "hasDocumentNumber": true/false,
    "documentNumber": "เลขที่เอกสาร หรือ null",
    "hasDate": true/false,
    "documentDate": "วันที่เอกสาร หรือ null",
    "hasItemDetails": true/false,
    "hasTotalAmount": true/false,
    "totalAmount": "ยอดรวม หรือ null",
    "description": "รายละเอียดความถูกต้องของเอกสาร"
  },
  "signatures": {
    "totalFound": 0-4,
    "allFourComplete": true/false,
    "receivedBy": {
      "hasSignature": true/false,
      "hasDate": true/false,
      "details": "รายละเอียด"
    },
    "deliveredBy": {
      "hasSignature": true/false,
      "hasDate": true/false,
      "details": "รายละเอียด"
    },
    "checkedBy": {
      "hasSignature": true/false,
      "hasDate": true/false,
      "details": "รายละเอียด"
    },
    "issuedBy": {
      "hasSignature": true/false,
      "hasDate": true/false,
      "details": "รายละเอียด"
    },
    "summary": "สรุปสถานะลายเซ็นทั้ง 4 ช่อง"
  },
  "cleanliness": {
    "isClean": true/false,
    "hasUnauthorizedMarks": true/false,
    "hasScratches": true/false,
    "hasCrossOuts": true/false,
    "hasNumberCorrections": true/false,
    "hasLiquidPaper": true/false,
    "hasHighlights": true/false,
    "markLocations": ["ตำแหน่งที่พบรอยปากกา (ถ้ามี)"],
    "details": "รายละเอียดรอยปากกาหรือการแก้ไขที่พบ"
  },
  "condition": {
    "isGoodCondition": true/false,
    "hasTears": true/false,
    "hasStains": true/false,
    "hasDamagingFolds": true/false,
    "hasMissingParts": true/false,
    "details": "รายละเอียดสภาพเอกสาร"
  },
  "imageQuality": {
    "isAcceptable": true/false,
    "isClear": true/false,
    "isProperlyLit": true/false,
    "isComplete": true/false,
    "isNotBlurry": true/false,
    "details": "รายละเอียดคุณภาพรูปภาพ"
  },
  "overallResult": {
    "passed": true/false,
    "score": 0-100,
    "passedCriteria": ["รายการเกณฑ์ที่ผ่าน"],
    "failedCriteria": ["รายการเกณฑ์ที่ไม่ผ่าน"],
    "criticalIssues": ["ปัญหาร้ายแรงที่ทำให้ไม่ผ่าน"],
    "warnings": ["คำเตือนที่ควรทราบแต่ไม่ถึงขั้นไม่ผ่าน"],
    "summary": "สรุปผลการตรวจสอบโดยรวม"
  },
  "recommendation": {
    "decision": "ACCEPT/REJECT/NEED_REVIEW",
    "canProceed": true/false,
    "reason": "เหตุผลประกอบการตัดสินใจ",
    "requiredActions": ["สิ่งที่ต้องแก้ไขก่อนส่งใหม่ (ถ้ามี)"]
  }
}

## กฎการตัดสินใจ:
- **ACCEPT (ผ่าน)**: ครบทุกเกณฑ์ - ลายเซ็นครบ 4 ช่อง, ไม่มีรอยขีดข่วน/แก้ไข, เอกสารสมบูรณ์
- **REJECT (ไม่ผ่าน)**: 
  - ลายเซ็นไม่ครบ 4 ช่อง
  - มีรอยขีดข่วน/ขีดฆ่า/แก้ไขนอกช่องลายเซ็น
  - เอกสารชำรุดจนอ่านข้อมูลสำคัญไม่ได้
  - ไม่ใช่เอกสาร Invoice/ใบส่งสินค้า
- **NEED_REVIEW (ต้องตรวจสอบเพิ่ม)**: รูปไม่ชัด หรือไม่แน่ใจในบางจุด

## กฎการให้คะแนน (100 คะแนนเต็ม):
- เอกสารถูกต้องครบถ้วน: 20 คะแนน
- ลายเซ็นครบ 4 ช่อง: 40 คะแนน (10 คะแนนต่อช่อง)
- ไม่มีรอยขีดข่วน/แก้ไข: 20 คะแนน
- สภาพเอกสารดี: 10 คะแนน
- คุณภาพรูปดี: 10 คะแนน

**ผ่าน = 100 คะแนนเท่านั้น (ต้องครบทุกเกณฑ์)**

## การ Extract ข้อมูลสำคัญ:
- **companyName**: ชื่อบริษัทที่ออกเอกสาร (ผู้ขาย/ผู้ส่งสินค้า)
  - อยู่ที่หัวเอกสารด้านบนซ้าย มักมีโลโก้บริษัทอยู่ด้วย
  - ตัวอย่าง: "บริษัท ซื้อฮะฮวด อุตสาหกรรม จำกัด", "C.H.H. INDUSTRY CO., LTD."
  - ให้ใช้ชื่อภาษาไทย ถ้ามีทั้งไทยและอังกฤษ
- **invoiceNumber**: ดูที่ส่วน "เลขที่/No." ซึ่งอยู่ด้านขวาบนของเอกสาร
  - รูปแบบมักเป็น "IV2509-159", "INV-XXXX-XXX" หรือตัวเลขผสมตัวอักษร
  - อยู่ในกรอบข้อมูลด้านขวา ใกล้กับวันที่เอกสาร

## สำคัญมาก:
- ตอบเป็น JSON เท่านั้น ไม่ต้องมี markdown code block หรือข้อความอื่นใด
- ลายเซ็นต้องครบทั้ง 4 ช่อง ถ้าขาดแม้แต่ช่องเดียว = ไม่ผ่าน
- รอยปากกาใดๆ นอกช่องลายเซ็น = ไม่ผ่าน
- ตรวจสอบอย่างละเอียดและเข้มงวด
- พยายาม extract ชื่อบริษัทลูกค้าและเลขที่เอกสารให้ได้มากที่สุด`,
            },
          ],
        },
      ],
    });

    const content = response.content[0].text;

    let result;
    try {
      result = JSON.parse(content);
    } catch {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          result = JSON.parse(jsonMatch[0]);
        } catch {
          return NextResponse.json({
            valid: false,
            canProceed: false,
            decision: "NEED_REVIEW",
            message: "ไม่สามารถวิเคราะห์รูปภาพได้ กรุณาตรวจสอบด้วยตนเอง",
            extractedData: null,
            criticalIssues: [
              {
                type: "system",
                severity: "critical",
                message: "ระบบไม่สามารถวิเคราะห์รูปภาพได้",
              },
            ],
            warnings: [],
          });
        }
      } else {
        return NextResponse.json({
          valid: false,
          canProceed: false,
          decision: "NEED_REVIEW",
          message: "ไม่สามารถวิเคราะห์รูปภาพได้ กรุณาตรวจสอบด้วยตนเอง",
          extractedData: null,
          criticalIssues: [
            {
              type: "system",
              severity: "critical",
              message: "ระบบไม่สามารถวิเคราะห์รูปภาพได้",
            },
          ],
          warnings: [],
        });
      }
    }

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

      if (sig.allFourComplete === false) {
        criticalIssues.push({
          type: "signature_incomplete",
          severity: "critical",
          message: `ลายเซ็นไม่ครบ 4 ช่อง (พบ ${sig.totalFound || 0}/4 ช่อง)`,
          details: sig.summary || "",
        });

        if (!sig.receivedBy?.hasSignature) {
          warnings.push({
            type: "signature_missing",
            severity: "error",
            message: "ไม่พบลายเซ็นช่อง ผู้รับของ/Received by",
            details: sig.receivedBy?.details || "",
          });
        }
        if (!sig.deliveredBy?.hasSignature) {
          warnings.push({
            type: "signature_missing",
            severity: "error",
            message: "ไม่พบลายเซ็นช่อง ผู้ส่งของ/Delivered by",
            details: sig.deliveredBy?.details || "",
          });
        }
        if (!sig.checkedBy?.hasSignature) {
          warnings.push({
            type: "signature_missing",
            severity: "error",
            message: "ไม่พบลายเซ็นช่อง ผู้ตรวจสอบ/Checked by",
            details: sig.checkedBy?.details || "",
          });
        }
        if (!sig.issuedBy?.hasSignature) {
          warnings.push({
            type: "signature_missing",
            severity: "error",
            message: "ไม่พบลายเซ็นช่อง ผู้จัดทำ/Issued by",
            details: sig.issuedBy?.details || "",
          });
        }
      }
    }

    if (result.cleanliness) {
      const clean = result.cleanliness;

      if (clean.isClean === false) {
        if (clean.hasScratches) {
          criticalIssues.push({
            type: "scratches",
            severity: "critical",
            message: "พบรอยขีดข่วนบนเอกสาร",
            details: clean.details || "",
          });
        }
        if (clean.hasCrossOuts) {
          criticalIssues.push({
            type: "cross_outs",
            severity: "critical",
            message: "พบรอยขีดฆ่าบนเอกสาร",
            details: clean.details || "",
          });
        }
        if (clean.hasNumberCorrections) {
          criticalIssues.push({
            type: "number_corrections",
            severity: "critical",
            message: "พบการแก้ไขตัวเลขบนเอกสาร",
            details: clean.details || "",
          });
        }
        if (clean.hasLiquidPaper) {
          criticalIssues.push({
            type: "liquid_paper",
            severity: "critical",
            message: "พบรอยลิควิด/การลบแก้ไขบนเอกสาร",
            details: clean.details || "",
          });
        }
        if (clean.hasHighlights) {
          warnings.push({
            type: "highlights",
            severity: "warning",
            message: "พบรอยเน้น/วงกลมบนเอกสาร",
            details: clean.details || "",
          });
        }
        if (clean.hasUnauthorizedMarks) {
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
        if (cond.hasTears) {
          criticalIssues.push({
            type: "tears",
            severity: "critical",
            message: "เอกสารมีรอยฉีกขาด",
            details: cond.details || "",
          });
        }
        if (cond.hasStains) {
          warnings.push({
            type: "stains",
            severity: "warning",
            message: "เอกสารมีรอยเปื้อน",
            details: cond.details || "",
          });
        }
        if (cond.hasDamagingFolds) {
          warnings.push({
            type: "folds",
            severity: "warning",
            message: "เอกสารมีรอยพับที่กระทบข้อมูล",
            details: cond.details || "",
          });
        }
        if (cond.hasMissingParts) {
          criticalIssues.push({
            type: "missing_parts",
            severity: "critical",
            message: "เอกสารมีส่วนที่หายไป",
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

        if (!img.isClear || img.isNotBlurry === false) {
          warnings.push({
            type: "blurry",
            severity: "warning",
            message: "รูปภาพเบลอหรือไม่ชัด",
          });
        }
        if (!img.isComplete) {
          warnings.push({
            type: "incomplete",
            severity: "warning",
            message: "รูปภาพไม่ครบทั้งเอกสาร",
          });
        }
      }
    }

    if (
      result.overallResult?.criticalIssues &&
      Array.isArray(result.overallResult.criticalIssues)
    ) {
      result.overallResult.criticalIssues.forEach((issue) => {
        if (!criticalIssues.some((c) => c.message === issue)) {
          criticalIssues.push({
            type: "ai_detected",
            severity: "critical",
            message: issue,
          });
        }
      });
    }

    if (
      result.overallResult?.warnings &&
      Array.isArray(result.overallResult.warnings)
    ) {
      result.overallResult.warnings.forEach((warning) => {
        if (!warnings.some((w) => w.message === warning)) {
          warnings.push({
            type: "ai_detected",
            severity: "warning",
            message: warning,
          });
        }
      });
    }

    const allIssues = [...criticalIssues, ...warnings];
    const hasCriticalIssues = criticalIssues.length > 0;
    const decision = result.recommendation?.decision || "NEED_REVIEW";
    const passed = result.overallResult?.passed === true && !hasCriticalIssues;

    return NextResponse.json({
      valid: passed,
      canProceed: result.recommendation?.canProceed ?? !hasCriticalIssues,
      decision: decision,
      score: result.overallResult?.score || 0,

      // NEW: Extracted data for auto-fill
      extractedData: result.extractedData || null,

      criticalIssues: criticalIssues,
      warnings: warnings,
      allIssues: allIssues,

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
      summary: "เกิดข้อผิดพลาดในการตรวจสอบ กรุณาตรวจสอบด้วยตนเองหรือลองใหม่",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
}

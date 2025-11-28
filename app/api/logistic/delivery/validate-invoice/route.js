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
      max_tokens: 1024,
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
              text: `คุณเป็นผู้เชี่ยวชาญในการตรวจสอบเอกสาร Invoice/ใบส่งของ/ใบเสร็จ

กรุณาตรวจสอบรูปภาพเอกสารนี้และตอบเป็น JSON format เท่านั้น ดังนี้:
{
  "hasSignature": true/false,
  "signatureDetails": "รายละเอียดลายเซ็นที่พบ เช่น พบลายเซ็นผู้ส่ง/ผู้รับ หรือไม่พบ",
  "hasScratches": true/false,
  "scratchDetails": "รายละเอียดรอยขีดข่วนที่พบ",
  "hasPenMarks": true/false,
  "penMarkDetails": "รายละเอียดรอยปากกาที่ไม่ใช่ลายเซ็น",
  "hasDamage": true/false,
  "damageDetails": "รายละเอียดความเสียหายอื่นๆ เช่น รอยเปื้อน รอยฉีกขาด",
  "isDocumentClear": true/false,
  "clarityDetails": "รายละเอียดความชัดเจนของเอกสาร",
  "isValidInvoice": true/false,
  "invoiceDetails": "รายละเอียดว่าเป็นเอกสาร Invoice/ใบส่งของจริงหรือไม่",
  "issues": ["รายการปัญหาที่พบทั้งหมด"],
  "suggestions": ["คำแนะนำในการแก้ไข"],
  "overallScore": 1-10,
  "summary": "สรุปผลการตรวจสอบโดยรวม"
}

สิ่งที่ต้องตรวจสอบ:
1. ลายเซ็น - ตรวจสอบว่ามีลายเซ็นครบหรือไม่ (ลายเซ็นผู้ส่ง, ผู้รับ, ผู้อนุมัติ ถ้ามี)
2. รอยขีดข่วน - มีรอยขีดข่วนจากปากกาหรือวัตถุมีคมหรือไม่
3. รอยปากกา - มีรอยปากกาที่ไม่ใช่ลายเซ็นหรือข้อความที่ควรมี (เช่น รอยขีดฆ่า รอยวงกลม รอยเขียนทับ)
4. ความเสียหาย - มีรอยเปื้อน รอยพับ รอยฉีกขาด หรือความเสียหายอื่นๆหรือไม่
5. ความชัดเจน - รูปภาพชัดเจน อ่านได้ ไม่เบลอ แสงพอเหมาะหรือไม่
6. ความถูกต้อง - เป็นเอกสาร Invoice/ใบส่งของจริงหรือไม่

ตอบเป็น JSON เท่านั้น ไม่ต้องมีข้อความอื่นใดนอกจาก JSON`,
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
            valid: true,
            warnings: [],
            message: "ไม่สามารถวิเคราะห์รูปภาพได้ กรุณาตรวจสอบด้วยตนเอง",
            canProceed: true,
          });
        }
      } else {
        return NextResponse.json({
          valid: true,
          warnings: [],
          message: "ไม่สามารถวิเคราะห์รูปภาพได้ กรุณาตรวจสอบด้วยตนเอง",
          canProceed: true,
        });
      }
    }

    const warnings = [];
    const criticalIssues = [];

    if (result.hasSignature === false) {
      warnings.push({
        type: "signature",
        severity: "warning",
        message: "ไม่พบลายเซ็นในเอกสาร",
        details: result.signatureDetails || "",
      });
    }

    if (result.hasScratches === true) {
      warnings.push({
        type: "scratches",
        severity: "warning",
        message: "พบรอยขีดข่วนบนเอกสาร",
        details: result.scratchDetails || "",
      });
    }

    if (result.hasPenMarks === true) {
      warnings.push({
        type: "penMarks",
        severity: "warning",
        message: "พบรอยปากกาที่ไม่ใช่ลายเซ็น",
        details: result.penMarkDetails || "",
      });
    }

    if (result.hasDamage === true) {
      warnings.push({
        type: "damage",
        severity: "warning",
        message: "พบความเสียหายบนเอกสาร",
        details: result.damageDetails || "",
      });
    }

    if (result.isDocumentClear === false) {
      warnings.push({
        type: "clarity",
        severity: "warning",
        message: "เอกสารไม่ชัดเจน อาจอ่านได้ยาก",
        details: result.clarityDetails || "",
      });
    }

    if (result.isValidInvoice === false) {
      criticalIssues.push({
        type: "invalid",
        severity: "error",
        message: "รูปภาพนี้อาจไม่ใช่เอกสาร Invoice/ใบส่งของ",
        details: result.invoiceDetails || "",
      });
    }

    if (Array.isArray(result.issues) && result.issues.length > 0) {
      result.issues.forEach((issue) => {
        if (!warnings.some((w) => w.message === issue)) {
          warnings.push({
            type: "other",
            severity: "info",
            message: issue,
            details: "",
          });
        }
      });
    }

    const allWarnings = [...criticalIssues, ...warnings];
    const hasProblems = allWarnings.length > 0;

    return NextResponse.json({
      valid: !hasProblems,
      warnings: allWarnings,
      suggestions: result.suggestions || [],
      summary: result.summary || "",
      score: result.overallScore || null,
      details: {
        hasSignature: result.hasSignature,
        hasScratches: result.hasScratches,
        hasPenMarks: result.hasPenMarks,
        hasDamage: result.hasDamage,
        isDocumentClear: result.isDocumentClear,
        isValidInvoice: result.isValidInvoice,
      },
      canProceed: true,
    });
  } catch (error) {
    console.error("Invoice validation error:", error);

    return NextResponse.json({
      valid: true,
      warnings: [],
      message: "เกิดข้อผิดพลาดในการตรวจสอบ กรุณาตรวจสอบด้วยตนเอง",
      canProceed: true,
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
}

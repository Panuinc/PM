import { NextResponse } from "next/server";
import OpenAI from "openai";

// ใช้ OpenRouter + DeepSeek R1T2 Chimera (free)
const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

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

    // -----------------------------
    //   AI CALL → DeepSeek Vision
    // -----------------------------
    const response = await client.chat.completions.create({
      model: "tngtech/deepseek-r1t2-chimera:free",
      max_tokens: 4096,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "input_image",
              image_url: `data:${mediaType};base64,${base64}`,
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
    "companyName": "...",
    "invoiceNumber": "...",
    "invoiceDate": "...",
    "totalAmount": "...",
    "customerName": "...",
    "confidence": {
      "companyName": 0-100,
      "invoiceNumber": 0-100
    }
  },
  "invoiceInfo": {...},
  "signatures": {...},
  "cleanliness": {...},
  "condition": {...},
  "imageQuality": {...},
  "overallResult": {...},
  "recommendation": {...}
}

## สำคัญมาก:
- ตอบเป็น JSON ล้วน ๆ เท่านั้น
- ห้ามมี markdown
- ห้ามใส่ text อื่นนอกเหนือ JSON
`,
            },
          ],
        },
      ],
    });

    // --------------------------
    // PARSE JSON SAFELY
    // --------------------------
    const content = response.choices?.[0]?.message?.content || "";
    let result;

    try {
      result = JSON.parse(content);
    } catch {
      const m = content.match(/\{[\s\S]*\}/);
      if (m) result = JSON.parse(m[0]);
    }

    if (!result) {
      return NextResponse.json({
        valid: false,
        canProceed: false,
        decision: "NEED_REVIEW",
        message: "ไม่สามารถอ่านผลลัพธ์ JSON จาก AI ได้",
      });
    }

    // --------------------------------------------------------
    //   🔥 ตั้งแต่ตรงนี้ลงไป = ใช้ logic ของคุณ 100% ไม่เปลี่ยน
    // --------------------------------------------------------

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

      if (!sig.allFourComplete) {
        criticalIssues.push({
          type: "signature_incomplete",
          severity: "critical",
          message: `ลายเซ็นไม่ครบ 4 ช่อง (พบ ${sig.totalFound}/4 ช่อง)`,
          details: sig.summary || "",
        });

        [
          ["receivedBy", "ผู้รับของ/Received by"],
          ["deliveredBy", "ผู้ส่งของ/Delivered by"],
          ["checkedBy", "ผู้ตรวจสอบ/Checked by"],
          ["issuedBy", "ผู้จัดทำ/Issued by"],
        ].forEach(([key, label]) => {
          if (!sig[key]?.hasSignature) {
            warnings.push({
              type: "signature_missing",
              severity: "error",
              message: `ไม่พบลายเซ็นช่อง ${label}`,
              details: sig[key]?.details || "",
            });
          }
        });
      }
    }

    if (result.cleanliness) {
      const clean = result.cleanliness;

      if (!clean.isClean) {
        if (clean.hasScratches)
          criticalIssues.push({ type: "scratches", severity: "critical" });

        if (clean.hasCrossOuts)
          criticalIssues.push({ type: "cross_outs", severity: "critical" });

        if (clean.hasUnauthorizedMarks)
          criticalIssues.push({
            type: "unauthorized_marks",
            severity: "critical",
            locations: clean.markLocations || [],
          });
      }
    }

    if (result.condition) {
      const cond = result.condition;

      if (!cond.isGoodCondition) {
        if (cond.hasTears)
          criticalIssues.push({ type: "tears", severity: "critical" });
        if (cond.hasMissingParts)
          criticalIssues.push({ type: "missing_parts", severity: "critical" });
      }
    }

    if (result.imageQuality) {
      const img = result.imageQuality;
      if (!img.isAcceptable) {
        warnings.push({
          type: "image_quality",
          severity: "warning",
        });
      }
    }

    const allIssues = [...criticalIssues, ...warnings];
    const hasCriticalIssues = criticalIssues.length > 0;

    return NextResponse.json({
      valid: !hasCriticalIssues,
      canProceed: !hasCriticalIssues,
      decision: hasCriticalIssues ? "REJECT" : "ACCEPT",
      score: result.overallResult?.score || 0,
      extractedData: result.extractedData || null,
      criticalIssues,
      warnings,
      allIssues,
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
      error: error.message,
      summary: "เกิดข้อผิดพลาดในการตรวจสอบ กรุณาตรวจสอบด้วยตนเองหรือลองใหม่",
    });
  }
}

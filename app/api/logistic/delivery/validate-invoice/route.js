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
              text: `คุณคือระบบตรวจสอบเอกสารสำหรับบริษัท C.H.H. INDUSTRY CO., LTD. งานของคุณคือ “ตัดสินตามสิ่งที่มองเห็นในภาพเท่านั้น” ห้ามเดา ห้ามเติมข้อมูลเอง

กฎเหล็ก (สำคัญที่สุด):
1) ห้ามคาดเดา: ถ้ามองไม่ชัด/ไม่มั่นใจ ให้ตอบ "unknown" เท่านั้น
2) ห้ามสรุปเกินภาพ: ต้องอ้างอิงสิ่งที่เห็นจริงจากภาพ
3) ตอบเป็น JSON เพียว ๆ เท่านั้น (ไม่มี markdown ไม่มีคำอธิบายนอก JSON)
4) ห้ามใส่ key อื่นนอก schema ที่กำหนด
5) ห้าม “เหมารวม” ว่ามีลายเซ็น/วันที่ ถ้าไม่เห็นชัดเจน

นิยามระดับความมั่นใจ (ใช้ทุกช่องที่เป็น confidence):
- 90-100 = เห็นชัด อ่านได้ชัวร์
- 70-89  = เห็นค่อนข้างชัด แต่อาจมีจุดกำกวมเล็กน้อย
- 40-69  = เห็นบางส่วน ไม่แน่ใจ
- 0-39   = แทบไม่เห็น / อ่านไม่ได้
ถ้าความมั่นใจ < 70 ให้ผลเป็น "unknown" สำหรับค่านั้น (ยกเว้น boolean ที่ใช้การ “เห็น/ไม่เห็น”)

สิ่งที่ต้องตรวจ (ตามภาพเท่านั้น):

A) Document Validity
- เป็น Invoice/ใบส่งสินค้า/ใบกำกับภาษีจริงหรือไม่
- มีหัวเอกสาร (ชื่อบริษัท/ที่อยู่/เลขผู้เสียภาษี) หรือไม่
- มีเลขที่เอกสาร + วันที่เอกสาร หรือไม่
- มีรายละเอียดสินค้า/บริการ จำนวน ราคา หรือไม่
- มียอดรวม + VAT (ถ้ามี) หรือไม่

B) ลายเซ็น 4 ช่อง (เคร่งมาก)
ตรวจ “แต่ละช่อง” ต้องแยกผล:
- receivedBy
- deliveredBy
- checkedBy
- issuedBy

แต่ละช่องให้ตอบ:
- hasSignature: true/false/unknown
- hasDate: true/false/unknown
กฎ: ถ้าไม่เห็นลายเซ็นชัด -> unknown (ไม่ใช่ false)
กฎ: ถ้าเห็นช่องนั้นว่างชัดเจน -> false
กฎ: ถ้าเห็นเป็นลายเซ็นชัด -> true
กฎ: วันที่ใช้ตรรกะเดียวกัน

C) ความสะอาด (เคร่งมาก)
นับว่า “ไม่สะอาด” ทันทีถ้าเห็น:
- รอยขีดฆ่า / ขีดทับ / เขียนทับข้อความสำคัญ
- วงกลม เน้น ไฮไลต์ ในส่วนรายละเอียดสินค้า/ยอดเงิน
- การแก้ตัวเลข/ข้อความด้วยปากกา
- รอยลิควิด/white out
ยกเว้น: รอยปากกา “ภายในช่องลายเซ็น 4 ช่อง” ถือว่าปกติ

D) สภาพเอกสาร
- ฉีกขาด/ชำรุดจนอ่านข้อมูลสำคัญไม่ได้
- เปื้อน/น้ำ/สกปรกบดบังข้อมูล
- บางส่วนถูกตัด/หายไป
- รอยพับเล็กน้อยที่ไม่กระทบข้อมูล = acceptable

E) คุณภาพรูป
- ชัด อ่านได้ทุกส่วน
- ไม่มืด/ไม่สว่างเกิน
- ไม่เบลอ
- ถ่ายครบทั้งเอกสาร ไม่ตัดขอบ

ผลลัพธ์ต้องเป็น JSON ตาม schema นี้เท่านั้น:

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
    "docType": "invoice|delivery_note|tax_invoice|unknown",
    "hasCompanyHeader": true/false/unknown,
    "hasCompanyTaxId": true/false/unknown,
    "hasInvoiceNumber": true/false/unknown,
    "hasInvoiceDate": true/false/unknown,
    "hasLineItems": true/false/unknown,
    "hasTotalAmount": true/false/unknown,
    "hasVat": true/false/unknown,
    "notes": "string"
  },
  "signatures": {
    "receivedBy": { "hasSignature": true/false/unknown, "hasDate": true/false/unknown, "evidence": "string" },
    "deliveredBy": { "hasSignature": true/false/unknown, "hasDate": true/false/unknown, "evidence": "string" },
    "checkedBy": { "hasSignature": true/false/unknown, "hasDate": true/false/unknown, "evidence": "string" },
    "issuedBy": { "hasSignature": true/false/unknown, "hasDate": true/false/unknown, "evidence": "string" },
    "totalFound": 0-4,
    "allFourComplete": true/false,
    "summary": "string"
  },
  "cleanliness": {
    "isClean": true/false/unknown,
    "hasScratches": true/false/unknown,
    "hasCrossOuts": true/false/unknown,
    "hasUnauthorizedMarks": true/false/unknown,
    "hasNumberCorrections": true/false/unknown,
    "hasLiquidPaper": true/false/unknown,
    "markLocations": ["string"],
    "evidence": "string"
  },
  "condition": {
    "isGoodCondition": true/false/unknown,
    "hasTears": true/false/unknown,
    "hasStains": true/false/unknown,
    "hasMissingParts": true/false/unknown,
    "evidence": "string"
  },
  "imageQuality": {
    "isAcceptable": true/false/unknown,
    "isBlurry": true/false/unknown,
    "isTooDark": true/false/unknown,
    "isTooBright": true/false/unknown,
    "isCropped": true/false/unknown,
    "evidence": "string"
  },
  "overallResult": {
    "score": 0-100,
    "decision": "ACCEPT|REJECT|NEED_REVIEW",
    "reasons": ["string"]
  },
  "recommendation": {
    "shouldRetakePhoto": true/false,
    "requiredActions": ["string"]
  }
}

กติกาการตัดสิน decision:
- REJECT ถ้า:
  - isValidInvoice = false
  - หรือ allFourComplete = false (แม้ช่องเดียวไม่ครบก็ REJECT)
  - หรือ cleanliness.isClean = false
  - หรือ condition.isGoodCondition = false
- NEED_REVIEW ถ้ามีค่า unknown ในหัวข้อสำคัญ เช่น signatures / cleanliness / imageQuality
- ACCEPT เมื่อ:
  - isValidInvoice = true
  - allFourComplete = true
  - cleanliness.isClean = true
  - condition.isGoodCondition = true
  - imageQuality.isAcceptable = true

สำคัญ: ถ้าคุณไม่มั่นใจใน “ตำแหน่งลายเซ็น/วันที่” ให้ใส่ unknown และอธิบายใน evidence ว่าไม่ชัด/ภาพเบลอ/แสงสะท้อน ฯลฯ

ตอบ JSON เท่านั้น
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

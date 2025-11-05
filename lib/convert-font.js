const fs = require("fs");
const path = require("path");

const fontPath = path.join(__dirname, "public", "fonts", "THSarabunNew.ttf");

const font = fs.readFileSync(fontPath);

const base64Font = font.toString("base64");

const output = `export const THSARABUN = \`${base64Font}\`;`;

fs.writeFileSync(path.join(__dirname, "thsarabun.js"), output);

console.log("✅ แปลง Font เป็น Base64 เรียบร้อย!");
console.log("ไฟล์ถูกสร้างที่:", path.join(__dirname, "thsarabun.js"));

import fs from "fs/promises";
import path from "path";

export async function saveUploadedFile(file, typeFolder, baseName) {
  const safeName = baseName.replace(/\s/g, "");
  const folder = path.join(process.cwd(), "public", typeFolder, safeName);
  await fs.mkdir(folder, { recursive: true });

  const filePath = path.join(folder, `${safeName}${path.extname(file.name)}`);
  const data = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(filePath, data);

  return path
    .relative(path.join(process.cwd(), "public"), filePath)
    .replace(/\\/g, "/");
}

export async function deleteFile(publicPath) {
  try {
    if (!publicPath) return;

    const fullPath = path.join(process.cwd(), "public", publicPath);
    await fs.unlink(fullPath);
  } catch (err) {
    console.error("deleteFile error:", err.message);
  }
}

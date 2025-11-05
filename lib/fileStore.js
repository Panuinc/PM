import fs from "fs/promises";
import path from "path";

export async function saveUploadedFile(file, typeFolder, baseName) {
  const safeBase = baseName.replace(/\s/g, "");
  const folder = path.join(process.cwd(), "public", typeFolder, safeBase);
  await fs.mkdir(folder, { recursive: true });
  const filePath = path.join(folder, `${safeBase}${path.extname(file.name)}`);
  await fs.writeFile(filePath, Buffer.from(await file.arrayBuffer()));
  return path
    .relative(path.join(process.cwd(), "public"), filePath)
    .replace(/\\/g, "/");
}

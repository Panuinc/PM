import { NextResponse } from "next/server";
import { saveUploadedFile } from "@/lib/fileStore";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const typeFolder = formData.get("typeFolder") || "uploads";
    const baseName = formData.get("baseName") || `file_${Date.now()}`;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only images are allowed." },
        { status: 400 }
      );
    }

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File size exceeds 10MB limit." },
        { status: 400 }
      );
    }

    const filePath = await saveUploadedFile(file, typeFolder, baseName);

    return NextResponse.json({
      message: "File uploaded successfully",
      filePath: `/${filePath}`,
      url: `/${filePath}`,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}
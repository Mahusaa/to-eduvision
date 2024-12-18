import type { NextRequest, } from "next/server";
import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import crypto from "crypto"

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file = data.get("file") as File;

    if (!file) {
      console.log("No file found in request.");
      return NextResponse.json({ success: false, message: "No file uploaded" });
    }
    const details = data.get("details") as string;
    if (!details) {
      return NextResponse.json({ success: false, message: "No details provided" });
    }

    // Hash the details string to use as the file name
    const hashedDetails = crypto.createHash('sha256').update(details).digest('hex');

    // Convert file to Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Define the upload path
    const uploadDir = join(process.cwd(), "public", "uploads");
    const fileExtension = file.name.split('.').pop();
    const newFileName = `${hashedDetails}.${fileExtension}`;
    const filePath = join(uploadDir, newFileName);

    // Ensure the upload directory exists
    await mkdir(uploadDir, { recursive: true });

    await writeFile(filePath, buffer);

    console.log("File uploaded successfully!");

    return NextResponse.json({
      success: true,
      message: "File uploaded successfully",
      path: `/uploads/${newFileName}`,
    });
  } catch (error) {
    console.error("Error during file upload:", error);
    return NextResponse.json({ success: false, message: "File upload failed" });
  }
}


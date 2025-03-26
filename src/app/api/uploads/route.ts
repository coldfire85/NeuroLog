import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

// Convert bytes to MB for easier reading
const MB = 1024 * 1024;
const IMAGE_MAX_SIZE = 20 * MB; // 20MB
const VIDEO_MAX_SIZE = 500 * MB; // 500MB
const RADIOLOGY_MAX_SIZE = 50 * MB; // 50MB (increased for DICOM files)

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // In a real app, this would use the session userId
    // For mock purposes we're using user1
    const userId = "user1";

    // Process the form data
    const formData = await request.formData();

    // Get the file from the request
    const file = formData.get("file") as File | null;
    const fileType = formData.get("type") as string | null;
    const specificFileType = formData.get("fileType") as string | null; // Get the specific file type if provided

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!fileType || !["image", "video", "radiology"].includes(fileType)) {
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
    }

    // Check file size based on type
    let maxSize;
    if (fileType === "image") {
      maxSize = IMAGE_MAX_SIZE;
    } else if (fileType === "video") {
      maxSize = VIDEO_MAX_SIZE;
    } else { // radiology
      maxSize = RADIOLOGY_MAX_SIZE;
    }

    if (file.size > maxSize) {
      const limitInMB = maxSize / MB;
      return NextResponse.json(
        { error: `File too large. Maximum size for ${fileType} is ${limitInMB}MB` },
        { status: 400 }
      );
    }

    // Get file extension
    const fileExtension = file.name.split(".").pop()?.toLowerCase();

    // Validate file type
    if (fileType === "image" && ![
      "jpg", "jpeg", "png", "gif"
    ].includes(fileExtension || "")) {
      return NextResponse.json(
        { error: "Invalid image format. Allowed formats: JPG, JPEG, PNG, GIF" },
        { status: 400 }
      );
    }

    if (fileType === "video" && ![
      "mp4", "webm", "avi", "mov", "mkv"
    ].includes(fileExtension || "")) {
      return NextResponse.json(
        { error: "Invalid video format. Allowed formats: MP4, WEBM, AVI, MOV, MKV" },
        { status: 400 }
      );
    }

    if (fileType === "radiology" && ![
      "jpg", "jpeg", "png", "dcm", "zip"
    ].includes(fileExtension || "")) {
      return NextResponse.json(
        { error: "Invalid radiology format. Allowed formats: JPG, JPEG, PNG, DCM, ZIP" },
        { status: 400 }
      );
    }

    // Generate a unique filename to prevent collisions
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 10);
    const fileName = `${timestamp}-${randomString}.${fileExtension}`;

    // Create upload directory path
    const userUploadsDir = path.join(process.cwd(), "public", "uploads", userId);
    let fileTypeDir;

    if (fileType === "image") {
      fileTypeDir = path.join(userUploadsDir, "images");
    } else if (fileType === "video") {
      fileTypeDir = path.join(userUploadsDir, "videos");
    } else { // radiology
      fileTypeDir = path.join(userUploadsDir, "radiology");
    }

    try {
      // Create directories if they don't exist
      await mkdir(userUploadsDir, { recursive: true });
      await mkdir(fileTypeDir, { recursive: true });
    } catch (error) {
      console.error("Error creating upload directories:", error);
      return NextResponse.json(
        { error: "Failed to create upload directories" },
        { status: 500 }
      );
    }

    // Path where the file will be saved
    const filePath = path.join(fileTypeDir, fileName);

    // Convert the file to a Buffer and save it
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filePath, buffer);

    // Generate the public URL
    let publicPath;
    if (fileType === "image") {
      publicPath = `/uploads/${userId}/images/${fileName}`;
    } else if (fileType === "video") {
      publicPath = `/uploads/${userId}/videos/${fileName}`;
    } else { // radiology
      publicPath = `/uploads/${userId}/radiology/${fileName}`;
    }

    // Determine the specific file type for the response
    let responseFileType: string | undefined;

    if (specificFileType) {
      // Use the file type sent from the client
      responseFileType = specificFileType;
    } else if (fileExtension) {
      // Infer from extension if not provided
      if (fileExtension === "dcm") {
        responseFileType = "dicom";
      } else if (["jpg", "jpeg"].includes(fileExtension)) {
        responseFileType = "jpg";
      } else if (fileExtension === "png") {
        responseFileType = "png";
      } else if (["mp4", "webm", "avi", "mov", "mkv"].includes(fileExtension)) {
        responseFileType = "mp4"; // Simplifying video types for frontend
      }
    }

    return NextResponse.json({
      success: true,
      url: publicPath,
      fileName: file.name,
      type: fileType,
      fileType: responseFileType // Include the specific file type in the response
    });

  } catch (error) {
    console.error("[FILE_UPLOAD]", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

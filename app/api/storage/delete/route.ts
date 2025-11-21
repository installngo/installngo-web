import { NextRequest, NextResponse } from "next/server";
import { S3Client, DeleteObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
import { requireAuth } from "@/lib/authMiddleware";

// Initialize S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION || "ap-southeast-2",
});

// Utility: normalize path and ensure org prefix
const normalizePath = (path: string, orgCode: string) => {
  let cleanPath = path.startsWith("--") ? path.slice(2) : path;

  if (cleanPath.startsWith("http")) {
    try {
      const url = new URL(cleanPath);
      cleanPath = url.pathname.startsWith("/") ? url.pathname.slice(1) : url.pathname;
    } catch {
      cleanPath = cleanPath.split(".com/")[1] || cleanPath;
    }
  }

  if (cleanPath.includes("?")) cleanPath = cleanPath.split("?")[0];

  if (!cleanPath.startsWith(`${orgCode}/`)) {
    cleanPath = `${orgCode}/${cleanPath}`;
  }

  return cleanPath;
};

export async function POST(req: NextRequest) {
  const user = requireAuth(req);
  if (!user) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { path } = body;

    if (!path) {
      return NextResponse.json({ success: false, error: "Missing file path" }, { status: 400 });
    }

    const normalizedPath = normalizePath(path, user.organization_code);

    if (!normalizedPath.startsWith(`${user.organization_code}/`)) {
      return NextResponse.json({ success: false, error: "Forbidden: File does not belong to your organization" }, { status: 403 });
    }

    // Verify file exists
    try {
      await s3Client.send(
        new HeadObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME!,
          Key: normalizedPath,
        })
      );
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "File does not exist or cannot be accessed";
      return NextResponse.json({ success: false, error: message }, { status: 404 });
    }

    // Delete the file
    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME!,
        Key: normalizedPath,
      })
    );

    // Confirm deletion
    try {
      await s3Client.send(
        new HeadObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME!,
          Key: normalizedPath,
        })
      );
      return NextResponse.json({ success: false, error: "Failed to delete file" }, { status: 500 });
    } catch {
      return NextResponse.json({ success: true, message: "File deleted successfully" });
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
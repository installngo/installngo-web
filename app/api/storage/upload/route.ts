export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// app/api/upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { requireAuth } from "@/lib/authMiddleware";

// Environment variables
const CLOUDFRONT_DOMAIN = process.env.CLOUDFRONT_DOMAIN!;
const AWS_BUCKET_NAME = process.env.AWS_BUCKET_NAME!;
const REGION = process.env.AWS_REGION!;
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID!;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY!;

// Initialize S3 client with credentials (required for local dev)
const s3Client = new S3Client({
  region: REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  },
});

export async function POST(req: NextRequest) {
  try {
    // Authenticate user
    const user = requireAuth(req);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Parse form data
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const folder = formData.get("folder") as string | null;
    const courseCode = formData.get("course_code") as string | null;

    if (!file || !folder || !courseCode) {
      return NextResponse.json(
        { success: false, error: "Missing file, folder, or course_code" },
        { status: 400 }
      );
    }

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Generate unique file path in S3
    const fileName = `${Date.now()}_${file.name}`;
    const filePath = `${user.organization_code}/${folder}/${courseCode}/${fileName}`;

    // Upload to S3
    const uploadParams = {
      Bucket: AWS_BUCKET_NAME,
      Key: filePath,
      Body: buffer,
      ContentType: file.type,
    };

    await s3Client.send(new PutObjectCommand(uploadParams));

    // Generate CloudFront URL
    const cloudFrontUrl = `https://${CLOUDFRONT_DOMAIN}/${filePath}`;

    return NextResponse.json({
      success: true,
      url: cloudFrontUrl,
      fileName,
      message: "File uploaded successfully via CloudFront",
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    console.error("S3 Upload API error:", message);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
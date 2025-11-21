import { NextRequest, NextResponse } from "next/server";
import { getSignedUrl } from "@aws-sdk/cloudfront-signer";

const CLOUDFRONT_DOMAIN = process.env.CLOUDFRONT_DOMAIN!;
const CLOUDFRONT_KEY_PAIR_ID = process.env.CLOUDFRONT_KEY_PAIR_ID!;
const CLOUDFRONT_PRIVATE_KEY = process.env.CLOUDFRONT_PRIVATE_KEY!;

export async function GET(req: NextRequest) {
  try {
    const path = req.nextUrl.searchParams.get("path");
    if (!path) return NextResponse.json({ success: false, error: "Missing file path" }, { status: 400 });

    const url = `https://${CLOUDFRONT_DOMAIN}/${path}`;

    // Expire in 5 minutes
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    const signedUrl = getSignedUrl({
      url,
      keyPairId: CLOUDFRONT_KEY_PAIR_ID,
      privateKey: CLOUDFRONT_PRIVATE_KEY,
      dateLessThan: expiresAt,
    });

    return NextResponse.json({ success: true, url: signedUrl });
  } catch (err: unknown) {
    console.error(err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
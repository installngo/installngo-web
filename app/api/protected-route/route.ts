import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/authMiddleware";

export async function GET(req: NextRequest) {
  const user = requireAuth(req);

  if (!user) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  return NextResponse.json({
    success: true,
    message: `Hello ${user.email_id}, you are authorized!`,
    organization_id: user.organization_id,
  });
}
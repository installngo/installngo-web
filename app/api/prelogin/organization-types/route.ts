import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function GET() {
  try {
    const { data, error } = await supabaseServer.rpc("get_organization_types_by_country");

    if (error) {
      console.error("Error fetching organization types:", error);
      return NextResponse.json(
        { success: false, error: "Failed to fetch organization types" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Organization types retrieved successfully",
      data,
    });
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
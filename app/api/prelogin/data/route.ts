import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function GET() {
  try {
    const { data, error } = await supabaseServer.rpc("get_prelogin_data");

    if (error) {
      console.error("Error fetching prelogin data:", error);
      return NextResponse.json(
        { success: false, error: "Failed to fetch prelogin data" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Prelogin data retrieved successfully",
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
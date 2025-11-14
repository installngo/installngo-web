export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { requireAuth } from "@/lib/authMiddleware";

interface SubCode {
  subcode_master_id: string;
  subcode_code: string;
  display_name: string;
  is_default?: boolean;
  display_sequence?: number;
}

interface MasterRecord {
  code_master_id: string;
  code_type: string;
  code_code: string;
  display_name: string;
  is_default?: boolean;
  display_sequence?: number;
  sub_codes: SubCode[];
}

export async function POST(req: NextRequest) {
  const user = requireAuth(req);

  if (!user) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    const  { code_type } = body;

    if (!code_type) {
      return NextResponse.json(
        { success: false, error: "Missing code_type" },
        { status: 400 }
      );
    }

    // Wrap single string into array
    const codeTypesArray: string[] = Array.isArray(code_type)
      ? code_type
      : [code_type];

    const { data: rawData, error } = await supabaseServer.rpc(
      "sp_get_code_subcode_master",
      { p_code_types: codeTypesArray }
    );

    if (error) {
      console.error("Supabase RPC Error:", error.message);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    const masterData: MasterRecord[] = (rawData as MasterRecord[]) || [];

    return NextResponse.json({
      success: true,
      message: "Master data retrieved successfully",
      code_type,
      data: masterData,
      user,
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("Route Error:", err.message);
      return NextResponse.json(
        { success: false, error: err.message },
        { status: 500 }
      );
    }
    console.error("Unexpected Error:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

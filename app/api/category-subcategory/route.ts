export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { requireAuth } from "@/lib/authMiddleware";

interface CategorySubcategoryBody {
  id?: string; // category_id or sub_category_id
  type: "category" | "subcategory";
  category_code?: string;
  subcategory_code?: string;
  display_name?: string;
  display_order?: number;
  is_default?: boolean;
  is_active?: boolean;
}

function handleError(error: unknown, label: string) {
  if (error instanceof Error) {
    console.error(`${label}:`, error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
}

export async function POST(req: NextRequest) {
  const user = requireAuth(req);
  if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

  try {
    const body: CategorySubcategoryBody = await req.json();
    if (!body.type) return NextResponse.json({ success: false, error: "Missing type" }, { status: 400 });

    const { data, error } = await supabaseServer.rpc("sp_manage_course_category_subcategory", {
      p_action: "insert",
      p_type: body.type,
      p_organization_id: user.organization_id,
      p_category_code: body.category_code ?? null,
      p_subcategory_code: body.subcategory_code ?? null,
      p_display_name: body.display_name ?? null,
      p_display_order: body.display_order ?? null,
      p_is_default: body.is_default ?? null,
      p_is_active: body.is_active ?? null,
    });

    if (error) {
      console.error("Supabase RPC Error (insert):", error.message);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error) {
    return handleError(error, "POST /categories-subcategories Error");
  }
}

export async function PUT(req: NextRequest) {
  const user = requireAuth(req);
  if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

  try {
    const body: CategorySubcategoryBody = await req.json();
    if (!body.type) return NextResponse.json({ success: false, error: "Missing type" }, { status: 400 });
    if (!body.id) return NextResponse.json({ success: false, error: "Missing id" }, { status: 400 });

    const { data, error } = await supabaseServer.rpc("sp_manage_course_category_subcategory", {
      p_action: "update",
      p_type: body.type,
      p_organization_id: user.organization_id,
      p_id: body.id,
      p_display_name: body.display_name ?? null,
      p_display_order: body.display_order ?? null,
      p_is_default: body.is_default ?? null,
      p_is_active: body.is_active ?? null,
    });

    if (error) {
      console.error("Supabase RPC Error (update):", error.message);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    return handleError(error, "PUT /categories-subcategories Error");
  }
}

export async function DELETE(req: NextRequest) {
  const user = requireAuth(req);
  if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const type = searchParams.get("type");

    if (!type) return NextResponse.json({ success: false, error: "Missing type" }, { status: 400 });
    if (!id) return NextResponse.json({ success: false, error: "Missing id" }, { status: 400 });

    const { data, error } = await supabaseServer.rpc("sp_manage_course_category_subcategory", {
      p_action: "delete",
      p_type: type,
      p_organization_id: user.organization_id,
      p_id: id,
    });

    if (error) {
      console.error("Supabase RPC Error (delete):", error.message);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    return handleError(error, "DELETE /categories-subcategories Error");
  }
}

export async function GET(req: NextRequest) {
  const user = requireAuth(req);
  if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const type = searchParams.get("type");
    const category_code = searchParams.get("category_code");

    if (!type) return NextResponse.json({ success: false, error: "Missing type" }, { status: 400 });

    let action = "get_all";
    if (id) action = "get_one";
    else if (type === "subcategory" && category_code) action = "get_by_category";

    const { data, error } = await supabaseServer.rpc("sp_manage_course_category_subcategory", {
      p_action: action,
      p_type: type,
      p_organization_id: user.organization_id,
      p_id: id ?? null,
      p_category_code: category_code ?? null,
    });

    if (error) {
      console.error("Supabase RPC Error (get):", error.message);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    return handleError(error, "GET /categories-subcategories Error");
  }
}
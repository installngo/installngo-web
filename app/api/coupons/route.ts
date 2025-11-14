export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { requireAuth } from "@/lib/authMiddleware";

interface CouponBody {
  coupon_id?: string;
  coupon_title?: string;
  coupon_code?: string;

  discount_type_code?: string;
  fixed_discount_value?: number | null;
  percentage_discount_value?: number | null;

  is_lifetime?: boolean;
  start_date?: string | null;
  end_date?: string | null;

  max_uses?: number | null;
  per_user_limit?: number | null;

  is_public?: boolean;
  is_visible?: boolean;
  is_active?: boolean;

  applicable_courses?: string[];
}

function handleError(error: unknown, label: string) {
  if (error instanceof Error) {
    return NextResponse.json(
      { success: false, error: error.message + label },
      { status: 500 }
    );
  }
  return NextResponse.json(
    { success: false, error: "Internal server error" },
    { status: 500 }
  );
}

function normalizeDate(dateString?: string | null): string | null {
  if (!dateString) return null;
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return null;
  return d.toISOString();
}

/* CREATE COUPON */
export async function POST(req: NextRequest) {
  const user = requireAuth(req);
  if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

  try {
    const body: CouponBody = await req.json();
    const startDate = normalizeDate(body.start_date);
    const endDate = normalizeDate(body.end_date);

    const { data, error } = await supabaseServer.rpc("sp_manage_coupons", {
      p_action: "insert",
      p_coupon_id: body.coupon_id ?? null,
      p_organization_id: user.organization_id,
      p_coupon_title: body.coupon_title ?? null,
      p_coupon_code: body.coupon_code ?? null,
      p_discount_type_code: body.discount_type_code ?? null,
      p_fixed_discount_value: body.fixed_discount_value ?? null,
      p_percentage_discount_value: body.percentage_discount_value ?? null,
      p_is_lifetime: body.is_lifetime ?? false,
      p_start_date: startDate,
      p_end_date: endDate,
      p_max_uses: body.max_uses ?? null,
      p_per_user_limit: body.per_user_limit ?? null,
      p_is_public: body.is_public ?? true,
      p_is_visible: body.is_visible ?? true,
      p_is_active: body.is_active ?? true,
      p_applicable_courses: body.applicable_courses ?? [],
    });

    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error) {
    return handleError(error, "POST /coupons Error");
  }
}

/* UPDATE COUPON */
export async function PUT(req: NextRequest) {
  const user = requireAuth(req);
  if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

  try {
    const body: CouponBody = await req.json();
    if (!body.coupon_id) return NextResponse.json({ success: false, error: "Missing coupon_id" }, { status: 400 });

    const startDate = normalizeDate(body.start_date);
    const endDate = normalizeDate(body.end_date);

    const { data, error } = await supabaseServer.rpc("sp_manage_coupons", {
      p_action: "update",
      p_coupon_id: body.coupon_id,
      p_organization_id: user.organization_id,
      p_coupon_title: body.coupon_title ?? null,
      p_coupon_code: body.coupon_code ?? null,
      p_discount_type_code: body.discount_type_code ?? null,
      p_fixed_discount_value: body.fixed_discount_value ?? null,
      p_percentage_discount_value: body.percentage_discount_value ?? null,
      p_is_lifetime: body.is_lifetime ?? false,
      p_start_date: startDate,
      p_end_date: endDate,
      p_max_uses: body.max_uses ?? null,
      p_per_user_limit: body.per_user_limit ?? null,
      p_is_public: body.is_public ?? true,
      p_is_visible: body.is_visible ?? true,
      p_is_active: body.is_active ?? true,
      p_applicable_courses: body.applicable_courses ?? [],
    });

    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    return handleError(error, "PUT /coupons Error");
  }
}

/* DELETE COUPON */
export async function DELETE(req: NextRequest) {
  const user = requireAuth(req);
  if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const coupon_id = searchParams.get("coupon_id");

    if (!coupon_id) return NextResponse.json({ success: false, error: "Missing coupon_id" }, { status: 400 });

    const { data, error } = await supabaseServer.rpc("sp_manage_coupons", {
      p_action: "delete",
      p_coupon_id: coupon_id,
      p_organization_id: user.organization_id,
      p_coupon_title: null,
      p_coupon_code: null,
      p_discount_type_code: null,
      p_fixed_discount_value: null,
      p_percentage_discount_value: null,
      p_is_lifetime: false,
      p_start_date: null,
      p_end_date: null,
      p_max_uses: null,
      p_per_user_limit: null,
      p_is_public: true,
      p_is_visible: true,
      p_is_active: true,
      p_applicable_courses: [],
    });

    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    return handleError(error, "DELETE /coupons Error");
  }
}

/* GET COUPON(S) */
export async function GET(req: NextRequest) {
  const user = requireAuth(req);
  if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const coupon_id = searchParams.get("coupon_id");
    const action = coupon_id ? "get_one" : "get_all";

    const { data, error } = await supabaseServer.rpc("sp_manage_coupons", {
      p_action: action,
      p_coupon_id: coupon_id,
      p_organization_id: user.organization_id,
      p_coupon_title: null,
      p_coupon_code: null,
      p_discount_type_code: null,
      p_fixed_discount_value: null,
      p_percentage_discount_value: null,
      p_is_lifetime: false,
      p_start_date: null,
      p_end_date: null,
      p_max_uses: null,
      p_per_user_limit: null,
      p_is_public: true,
      p_is_visible: true,
      p_is_active: true,
      p_applicable_courses: [],
    });

    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    return handleError(error, "GET /coupons Error");
  }
}
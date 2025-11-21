import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { requireAuth } from "@/lib/authMiddleware";

interface CourseBody {
  course_id?: string;
  course_code?: string;

  is_paid?: boolean;

  course_title?: string;
  course_description?: string;

  thumbnail_url?: string;

  category_code?: string;
  subcategory_code?: string;

  original_price?: number;
  discount_price?: number;
  effective_price?: number;

  validity_code?: string;
  single_validity_code?: string;

  expiry_date?: string | null;

  mark_new?: boolean;
  mark_featured?: boolean;
  has_offline_material?: boolean;

  status_code?: string;
}

function handleError(error: unknown, label: string) {
  if (error instanceof Error) {
    console.error(`${label}:`, error.message);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
  return NextResponse.json(
    { success: false, error: "Internal server error" },
    { status: 500 }
  );
}

function normalizeExpiryDate(dateString?: string | null): string | null {
  if (!dateString) return null;

  try {
    // If frontend sends only "YYYY-MM-DD", convert to UTC end of day
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      return new Date(`${dateString}T23:59:59Z`).toISOString();
    }

    // If already ISO timestamp, keep it consistent (force UTC)
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return null;
    return new Date(
      Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 23, 59, 59)
    ).toISOString();
  } catch {
    return null;
  }
}

// ----------------- Remove CloudFront domain -----------------
function getRelativeFilePath(fileUrl?: string | null): string | null {
  if (!fileUrl) return null;

  // Remove protocol
  let cleanUrl = fileUrl.replace(/^https?:\/\//, "");

  // Remove domain (everything before the first /)
  const firstSlashIndex = cleanUrl.indexOf("/");
  if (firstSlashIndex >= 0) {
    cleanUrl = cleanUrl.slice(firstSlashIndex + 1);
  }

  return cleanUrl;
}

export async function POST(req: NextRequest) {
  const user = requireAuth(req);
  if (!user)
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );

  try {
    const body: CourseBody = await req.json();
    const expiryDateUTC = normalizeExpiryDate(body.expiry_date);

    const { data, error } = await supabaseServer.rpc("sp_manage_courses", {
      p_action: "insert",
      p_course_id: body.course_id,
      p_course_code: body.course_code ?? null,
      p_organization_id: user.organization_id,
      p_is_paid: body.is_paid ?? false,
      p_course_title: body.course_title ?? null,
      p_course_description: body.course_description ?? null,
      p_thumbnail_url: getRelativeFilePath(body.thumbnail_url),
      p_category_code: body.category_code ?? null,
      p_sub_category_code: body.subcategory_code ?? null,
      p_original_price: body.original_price ?? null,
      p_discount_price: body.discount_price ?? null,
      p_effective_price: body.effective_price ?? null,
      p_validity_code: body.validity_code ?? null,
      p_single_validity_code: body.single_validity_code ?? null,
      p_expiry_date: expiryDateUTC,
      p_mark_new: body.mark_new ?? false,
      p_mark_featured: body.mark_featured ?? false,
      p_has_offline_material: body.has_offline_material ?? false,
      p_status_code: body.status_code ?? "ACTIVE",
    });

    if (error)
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error) {
    return handleError(error, "POST /courses Error");
  }
}

export async function PUT(req: NextRequest) {
  const user = requireAuth(req);
  if (!user)
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );

  try {
    const body: CourseBody = await req.json();
    if (!body.course_id)
      return NextResponse.json(
        { success: false, error: "Missing course_id" },
        { status: 400 }
      );

    const expiryDateUTC = normalizeExpiryDate(body.expiry_date);

    const { data, error } = await supabaseServer.rpc("sp_manage_courses", {
      p_action: "update",
      p_course_id: body.course_id,
      p_course_code: body.course_code ?? null,
      p_organization_id: user.organization_id,
      p_is_paid: body.is_paid ?? false,
      p_course_title: body.course_title ?? null,
      p_course_description: body.course_description ?? null,
      p_thumbnail_url:
        body.thumbnail_url && /^https?:\/\//.test(body.thumbnail_url)
          ? getRelativeFilePath(body.thumbnail_url)
          : body.thumbnail_url ?? null,
      p_category_code: body.category_code ?? null,
      p_sub_category_code: body.subcategory_code ?? null,
      p_original_price: body.original_price ?? null,
      p_discount_price: body.discount_price ?? null,
      p_effective_price: body.effective_price ?? null,
      p_validity_code: body.validity_code ?? null,
      p_single_validity_code: body.single_validity_code ?? null,
      p_expiry_date: expiryDateUTC,
      p_mark_new: body.mark_new ?? false,
      p_mark_featured: body.mark_featured ?? false,
      p_has_offline_material: body.has_offline_material ?? false,
      p_status_code: body.status_code ?? "ACTIVE",
    });

    if (error)
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    return handleError(error, "PUT /courses Error");
  }
}

export async function DELETE(req: NextRequest) {
  const user = requireAuth(req);
  if (!user)
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );

  try {
    const { searchParams } = new URL(req.url);
    const course_id = searchParams.get("course_id");
    const course_code = searchParams.get("course_code");

    if (!course_id)
      return NextResponse.json(
        { success: false, error: "Missing course_id" },
        { status: 400 }
      );

    const { data, error } = await supabaseServer.rpc("sp_manage_courses", {
      p_action: "delete",
      p_course_id: course_id,
      p_course_code: course_code,
      p_organization_id: user.organization_id,
      p_is_paid: false,
      p_course_title: null,
      p_course_description: null,
      p_thumbnail_url: null,
      p_category_code: null,
      p_sub_category_code: null,
      p_original_price: null,
      p_discount_price: null,
      p_effective_price: null,
      p_validity_code: null,
      p_single_validity_code: null,
      p_expiry_date: null,
      p_mark_new: false,
      p_mark_featured: false,
      p_has_offline_material: false,
      p_status_code: null,
    });

    if (error)
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    return handleError(error, "DELETE /courses Error");
  }
}

export async function GET(req: NextRequest) {
  const user = requireAuth(req);
  if (!user)
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );

  try {
    const { searchParams } = new URL(req.url);
    const course_id = searchParams.get("course_id");
    const course_code = searchParams.get("course_code") ?? null;
    const action = course_id ? "get_one" : "get_all";

    const { data, error } = await supabaseServer.rpc("sp_manage_courses", {
      p_action: action,
      p_course_id: course_id ?? null,
      p_course_code: course_code,
      p_organization_id: user.organization_id,
      p_is_paid: false,
      p_course_title: null,
      p_course_description: null,
      p_thumbnail_url: null,
      p_category_code: null,
      p_sub_category_code: null,
      p_original_price: null,
      p_discount_price: null,
      p_effective_price: null,
      p_validity_code: null,
      p_single_validity_code: null,
      p_expiry_date: null,
      p_mark_new: false,
      p_mark_featured: false,
      p_has_offline_material: false,
      p_status_code: null,
    });

    if (error)
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    return handleError(error, "GET /courses Error");
  }
}

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { requireAuth } from "@/lib/authMiddleware";

interface SubMenu {
  name: string;
  path: string;
  is_premium: boolean;
  menu_status_code: string;
  allowed_roles?: string[];
}

interface Menu {
  name: string;
  path: string;
  is_premium: boolean;
  menu_status_code: string;
  allowed_roles?: string[];
  sub_menus?: SubMenu[];
}

export async function GET(req: NextRequest) {
  const user = requireAuth(req);
  if (!user) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const url = new URL(req.url);
    const type = url.searchParams.get("type");

    if (!type) return NextResponse.json({ success: true, data: [] });

    const { data, error } = await supabaseServer
      .from("organization_menus")
      .select(`
        name:route_name,
        path:path_name,
        is_premium,
        menu_status_code,
        allowed_roles,
        sub_menus:organization_menus!menu_parent_id(
          name:route_name,
          path:path_name,
          is_premium,
          menu_status_code,
          allowed_roles
        )
      `)
      .eq("organization_type_code", type)
      .is("menu_parent_id", null)
      .order("menu_order", { ascending: true });

    if (error) throw error;

    // Filter menus based on user role and status
    const menus: Menu[] = (data || [])
      .filter((menu: Menu) => !menu.allowed_roles || menu.allowed_roles.includes(user.role || ""))
      .map((menu: Menu) => ({
        ...menu,
        sub_menus: (menu.sub_menus || [])
          .filter(
            (sub: SubMenu) =>
              sub.menu_status_code === "ACTIVE" &&
              (!sub.allowed_roles || sub.allowed_roles.includes(user.role || ""))
          ),
      }));

    return NextResponse.json({ success: true, data: menus });
  } catch (err) {
    console.error("Menus API error:", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
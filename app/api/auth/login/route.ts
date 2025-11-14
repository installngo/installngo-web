export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { supabaseClient } from "@/lib/supabaseClient";
import { supabaseServer } from "@/lib/supabaseServer";
import { issueOrgJWT } from "@/lib/authMiddleware";

export async function POST(req: NextRequest) {
  try {
    const { email_id, password } = await req.json() as { email_id?: string; password?: string };

    if (!email_id || !password) {
      return NextResponse.json({ success: false, error: "Email and password are required" }, { status: 400 });
    }

    // Authenticate user with Supabase
    const { data: authData, error: authError } = await supabaseClient.auth.signInWithPassword({
      email: email_id,
      password,
    });

    if (authError || !authData?.user) {
      return NextResponse.json({ success: false, error: authError?.message || "Invalid credentials" }, { status: 401 });
    }

    const auth_user_id = authData.user.id;

    // Fetch linked organization
    const { data: orgData, error: orgError } = await supabaseServer
      .from("organizations")
      .select(
        "organization_id, organization_code, full_name, email_id, type_code, category_code, country_code, status_code"
      )
      .eq("auth_user_id", auth_user_id)
      .single();

    if (orgError || !orgData) {
      return NextResponse.json({ success: false, error: "Organization not found for this user" }, { status: 404 });
    }

    // Fetch user role from organization_users
    const { data: userRoleData, error: roleError } = await supabaseServer
      .from("organization_users")
      .select("user_role")
      .eq("organization_id", orgData.organization_id)
      .eq("user_id", auth_user_id)
      .single();

    if (roleError || !userRoleData) {
      return NextResponse.json({ success: false, error: "User role not found" }, { status: 404 });
    }

    const role = userRoleData.user_role;

    // Issue JWT with actual role
    const token = issueOrgJWT({
      organization_id: orgData.organization_id,
      organization_code: orgData.organization_code,
      user_id: auth_user_id,
      email_id: orgData.email_id,
      role,
    });

    const response = NextResponse.json({
      success: true,
      message: "Login successful",
      token,
      organization: {
        organization_id: orgData.organization_id,
        code: orgData.organization_code,
        full_name: orgData.full_name,
        email_id: orgData.email_id,
        type_code: orgData.type_code,
        category_code: orgData.category_code,
        country_code: orgData.country_code,
        status_code: orgData.status_code,
        role,
      },
    });

    response.headers.set("Authorization", `Bearer ${token}`);
    return response;

  } catch (err: unknown) {
    console.error("Login Error:", err);
    return NextResponse.json({ success: false, error: err instanceof Error ? err.message : "Internal server error" }, { status: 500 });
  }
}
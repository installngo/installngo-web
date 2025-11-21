import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { issueOrgJWT } from "@/lib/authMiddleware";

export async function POST(req: NextRequest) {
  try {
    const { orgName, orgType, country, email, password } = await req.json();

    if (!orgName || !orgType || !country || !email || !password) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // 1. Create Supabase auth user
    const { data: authData, error: authError } = await supabaseServer.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (authError || !authData?.user) {
      return NextResponse.json(
        { success: false, error: authError?.message || "Failed to create auth user" },
        { status: 500 }
      );
    }

    const auth_user_id = authData.user.id;
    const organization_code = Math.random().toString(36).substring(2, 8).toUpperCase();

    // 2. Insert organization
    const { data: orgData, error: orgError } = await supabaseServer
      .from("organizations")
      .insert({
        auth_user_id,
        organization_code,
        full_name: orgName,
        type_code: orgType,
        category_code: "COACHING",
        country_code: country,
        email_id: email,
      })
      .select(
        "organization_id, organization_code, full_name, type_code, category_code, country_code"
      )
      .single();

    if (orgError) {
      await supabaseServer.auth.admin.deleteUser(auth_user_id);
      return NextResponse.json(
        { success: false, error: orgError.message || "Failed to create organization" },
        { status: 500 }
      );
    }

    // 3. Link organization user as ADMIN
    const { error: mappingError } = await supabaseServer.from("organization_users").insert({
      organization_id: orgData.organization_id,
      user_id: auth_user_id,
      user_role: "ADMIN",
      is_primary: true,
    });

    if (mappingError) {
      return NextResponse.json(
        { success: false, error: mappingError.message || "Failed to link organization user" },
        { status: 500 }
      );
    }

    // 4. Issue JWT for auto-login
    const token = issueOrgJWT({
      organization_id: orgData.organization_id,
      organization_code: orgData.organization_code,
      user_id: auth_user_id,
      email_id: email,
      role: "ADMIN",
    });

    // 5. Return response with token
    const response = NextResponse.json({
      success: true,
      message: "Organization registered successfully",
      token,
      organization: {
        organization_id: orgData.organization_id,
        code: orgData.organization_code,
        full_name: orgData.full_name,
        type_code: orgData.type_code,
        category_code: orgData.category_code,
        country_code: orgData.country_code,
      },
    }, { status: 201 });

    response.headers.set("Authorization", `Bearer ${token}`);
    return response;

  } catch (err: unknown) {
    console.error("Signup Error:", err);
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 }
    );
  }
}
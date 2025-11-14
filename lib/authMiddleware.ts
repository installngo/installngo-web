import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export interface AuthPayload {
  organization_id: string;
  organization_code: string;
  user_id?: string;
  email_id: string;
  role?: string;
}

export function verifyJWT(req: NextRequest): AuthPayload | null {
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) return null;
    const token = authHeader.split(" ")[1];
    return jwt.verify(token, process.env.JWT_SECRET!) as AuthPayload;
  } catch {
    return null;
  }
}

export function requireAuth(req: NextRequest): AuthPayload | null {
  return verifyJWT(req);
}

export function issueOrgJWT(data: AuthPayload): string {
  return jwt.sign(data, process.env.JWT_SECRET!, { expiresIn: "12h" });
}
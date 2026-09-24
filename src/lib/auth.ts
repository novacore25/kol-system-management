import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const JWT_SECRET = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || "creavy_jwt_secret_production_2026_super_secure"
);

export interface AuthSessionUser {
  id: string;
  email: string;
  name?: string;
  avatarUrl?: string;
  role: "ADMIN" | "PIC" | "CREATOR" | "BRAND";
  creatorProfileId?: string;
}

export async function createSessionToken(user: AuthSessionUser): Promise<string> {
  return new SignJWT({ ...user })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(JWT_SECRET);
}

export async function verifySessionToken(token: string): Promise<AuthSessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as AuthSessionUser;
  } catch {
    return null;
  }
}

export async function getCurrentSession(): Promise<AuthSessionUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("creavy_session")?.value;
    if (!token) return null;
    return await verifySessionToken(token);
  } catch {
    return null;
  }
}

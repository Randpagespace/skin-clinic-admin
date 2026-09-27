import { EncryptJWT, jwtDecrypt } from "jose";

export const roles = { DIRECTOR: "원장", MANAGER: "상담실장", DESK: "데스크", NURSE: "간호사" };
export type LoginData = {
  staffId: number;
  name: string;
  role: keyof typeof roles;
  accessToken: string;
  accessTokenExpiresAt: string;
  mustChangePassword: boolean;
};
export type Session = LoginData & { remember: boolean };

export function parseLoginData(value: unknown): LoginData {
  if (!value || typeof value !== "object") throw new Error("Invalid login response");
  const data = value as Record<string, unknown>;
  if (!Number.isSafeInteger(data.staffId) || (data.staffId as number) <= 0 ||
      typeof data.name !== "string" || !data.name ||
      typeof data.role !== "string" || !Object.hasOwn(roles, data.role) ||
      typeof data.accessToken !== "string" || !data.accessToken ||
      typeof data.accessTokenExpiresAt !== "string" || !Number.isFinite(Date.parse(data.accessTokenExpiresAt)) ||
      typeof data.mustChangePassword !== "boolean") throw new Error("Invalid login response");
  return { staffId: data.staffId as number, name: data.name, role: data.role as LoginData["role"], accessToken: data.accessToken, accessTokenExpiresAt: data.accessTokenExpiresAt, mustChangePassword: data.mustChangePassword };
}

export async function sealSession(session: Session, key: Uint8Array): Promise<string> {
  return new EncryptJWT({ session })
    .setProtectedHeader({ alg: "dir", enc: "A256GCM" })
    .setIssuedAt()
    .setIssuer("skin-clinic-admin")
    .setAudience("skin-clinic-admin")
    .setExpirationTime(Math.min(Math.floor(Date.parse(session.accessTokenExpiresAt) / 1000), Math.floor(Date.now() / 1000) + 12 * 3600))
    .encrypt(key);
}

export async function openSession(cookie: string, key: Uint8Array): Promise<Session | null> {
  try {
    const { payload } = await jwtDecrypt(cookie, key, { issuer: "skin-clinic-admin", audience: "skin-clinic-admin", keyManagementAlgorithms: ["dir"], contentEncryptionAlgorithms: ["A256GCM"] });
    const value = payload.session as Record<string, unknown>;
    const data = parseLoginData(value);
    if (typeof value.remember !== "boolean" || Date.parse(data.accessTokenExpiresAt) <= Date.now()) return null;
    return { ...data, remember: value.remember };
  } catch {
    return null;
  }
}

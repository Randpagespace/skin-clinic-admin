import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { openSession, sealSession, type Session } from "./session-codec";

const cookieName = "clinic_session";
function sessionKey() {
  const secret = process.env.AUTH_SESSION_SECRET;
  if (!secret || !/^[a-f0-9]{64}$/i.test(secret)) throw new Error("AUTH_SESSION_SECRET must be 32 random bytes encoded as hex");
  return Buffer.from(secret, "hex");
}

export async function getSession() {
  const cookie = (await cookies()).get(cookieName)?.value;
  return cookie ? openSession(cookie, sessionKey()) : null;
}

export async function requireSession() {
  const session = await getSession();
  if (!session) redirect("/");
  if (session.mustChangePassword) redirect("/initial-password");
  return session;
}

export async function saveSession(session: Session) {
  const cookie = await sealSession(session, sessionKey());
  (await cookies()).set(cookieName, cookie, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    ...(session.remember ? { expires: new Date(Math.min(Date.parse(session.accessTokenExpiresAt), Date.now() + 12 * 3600_000)) } : {}),
  });
}

export async function clearSession() {
  (await cookies()).delete(cookieName);
}

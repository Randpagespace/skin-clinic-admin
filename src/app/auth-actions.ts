"use server";

import { redirect } from "next/navigation";
import { authRequest, AuthApiError, authErrorMessage } from "@/lib/auth-api";
import { parseLoginData } from "@/lib/session-codec";
import { clearSession, getSession, saveSession } from "@/lib/session";

export async function loginAction(_previous: { message: string }, form: FormData) {
  const loginId = form.get("username");
  const password = form.get("password");
  if (typeof loginId !== "string" || !loginId.trim() || typeof password !== "string" || !password) return { message: "아이디와 비밀번호를 입력해 주세요." };
  let changeRequired: boolean;
  try {
    const data = parseLoginData(await authRequest("/auth/login", { loginId, password }));
    if (Date.parse(data.accessTokenExpiresAt) <= Date.now()) throw new AuthApiError("TOKEN_EXPIRED");
    await saveSession({ ...data, remember: form.get("remember") === "on" });
    changeRequired = data.mustChangePassword;
  } catch (error) {
    return { message: authErrorMessage(error) };
  }
  redirect(changeRequired ? "/initial-password" : "/dashboard");
}

export async function initialPasswordAction(_previous: { message: string }, form: FormData) {
  const session = await getSession();
  if (!session) redirect("/");
  if (!session.mustChangePassword) redirect("/dashboard");
  const newPassword = form.get("newPassword");
  if (typeof newPassword !== "string" || newPassword.length < 8 || newPassword.length > 64) return { message: "새 비밀번호는 8~64자로 입력해 주세요." };
  if (newPassword !== form.get("confirmPassword")) return { message: "새 비밀번호가 일치하지 않습니다." };
  try {
    const result = await authRequest("/auth/initial-password", { newPassword }, session.accessToken);
    if (!result || typeof result !== "object" || !("mustChangePassword" in result) || result.mustChangePassword !== false) throw new Error("Invalid password change response");
    await saveSession({ ...session, mustChangePassword: false });
  } catch (error) {
    if (error instanceof AuthApiError && ["INVALID_TOKEN", "TOKEN_EXPIRED", "ACCOUNT_INACTIVE", "PASSWORD_CHANGE_NOT_REQUIRED"].includes(error.code)) {
      await clearSession();
    } else {
      return { message: authErrorMessage(error) };
    }
    redirect("/");
  }
  redirect("/dashboard");
}

export async function logoutAction() {
  await clearSession();
  redirect("/");
}

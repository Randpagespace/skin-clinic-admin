import "server-only";

export class AuthApiError extends Error {
  constructor(public code: string) { super(code); }
}

export async function authRequest(path: "/auth/login" | "/auth/initial-password", body: object, token?: string): Promise<unknown> {
  let response: Response;
  try {
    response = await fetch(new URL(path, process.env.BACKEND_URL || "http://localhost:8000"), {
      method: "POST",
      headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: JSON.stringify(body),
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    });
  } catch {
    throw new AuthApiError("UNAVAILABLE");
  }
  const result = await response.json().catch(() => null);
  if (!response.ok || result?.success !== true) {
    throw new AuthApiError(typeof result?.code === "string" ? result.code : "UNAVAILABLE");
  }
  return result.data;
}

export function authErrorMessage(error: unknown) {
  const messages: Record<string, string> = {
    INVALID_CREDENTIALS: "아이디 또는 비밀번호가 올바르지 않습니다.",
    ACCOUNT_INACTIVE: "비활성화된 계정입니다. 관리자에게 문의해 주세요.",
    ACCOUNT_LOCKED: "계정이 잠겼습니다. 10분 후 다시 시도해 주세요.",
    VALIDATION_FAILED: "입력한 정보를 확인해 주세요.",
    TOKEN_EXPIRED: "로그인이 만료되었습니다. 다시 로그인해 주세요.",
    INVALID_TOKEN: "인증 정보가 유효하지 않습니다. 다시 로그인해 주세요.",
    PASSWORD_CHANGE_NOT_REQUIRED: "이미 비밀번호 변경을 완료했습니다. 다시 로그인해 주세요.",
    UNAVAILABLE: "인증 서버에 연결할 수 없습니다. 잠시 후 다시 시도해 주세요.",
  };
  return error instanceof AuthApiError ? (messages[error.code] || "로그인 요청을 처리할 수 없습니다. 관리자에게 문의해 주세요.") : "인증 응답을 처리할 수 없습니다. 관리자에게 문의해 주세요.";
}

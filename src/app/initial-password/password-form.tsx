"use client";

import { useActionState } from "react";
import { initialPasswordAction } from "../auth-actions";

export default function PasswordForm() {
  const [state, action, pending] = useActionState(initialPasswordAction, { message: "" });
  return (
    <form action={action}>
      <div className="login-field"><label htmlFor="newPassword">새 비밀번호</label><input id="newPassword" name="newPassword" type="password" autoComplete="new-password" minLength={8} maxLength={64} required disabled={pending} aria-describedby="password-help" /></div>
      <p id="password-help" className="password-help">8~64자로 입력하세요.</p>
      <div className="login-field"><label htmlFor="confirmPassword">새 비밀번호 확인</label><input id="confirmPassword" name="confirmPassword" type="password" autoComplete="new-password" minLength={8} maxLength={64} required disabled={pending} /></div>
      <button type="submit" className="login-submit" disabled={pending}>{pending ? "변경 중…" : "비밀번호 변경"}</button>
      {state.message && <p className="login-message" role="alert">{state.message}</p>}
    </form>
  );
}

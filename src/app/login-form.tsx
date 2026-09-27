"use client";

import { useActionState, useState } from "react";
import { loginAction } from "./auth-actions";

export default function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, { message: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");

  return (
    <form action={action}>
      <div className="login-field">
        <label htmlFor="username">아이디</label>
        <input id="username" name="username" autoComplete="username" placeholder="아이디를 입력하세요" required autoCapitalize="none" spellCheck={false} disabled={pending} />
      </div>
      <div className="login-field">
        <label htmlFor="password">비밀번호</label>
        <div className="password-field">
          <input id="password" name="password" type={showPassword ? "text" : "password"} autoComplete="current-password" placeholder="비밀번호를 입력하세요" required disabled={pending} />
          <button className="password-toggle" type="button" aria-controls="password" aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 표시"} aria-pressed={showPassword} onClick={() => setShowPassword(!showPassword)}>{showPassword ? "숨김" : "표시"}</button>
        </div>
      </div>
      <div className="login-options">
        <label className="remember-label" htmlFor="remember"><input id="remember" name="remember" type="checkbox" disabled={pending} />로그인 유지</label>
        <button className="recovery-button" type="button" data-recovery onClick={() => setMessage("비밀번호 재설정은 병원 계정 관리자에게 문의해 주세요. 온라인 재설정 기능은 아직 연결되지 않았습니다.")}>비밀번호 찾기</button>
      </div>
      <button className="login-submit" type="submit" disabled={pending}>{pending ? "로그인 중…" : "로그인"}</button>
      {state.message && <p className="login-message" role="alert">{state.message}</p>}
      {message && <p className="login-message" role="status">{message}</p>}
    </form>
  );
}

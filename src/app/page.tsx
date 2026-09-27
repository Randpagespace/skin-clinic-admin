import LoginForm from "./login-form";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const session = await getSession();
  if (session) redirect(session.mustChangePassword ? "/initial-password" : "/dashboard");
  return (
    <main className="login-page">
      <section className="login-card" aria-labelledby="login-title">
        <div className="login-brand"><span className="brand-mark" aria-hidden="true" />우리메디 CRM</div>
        <header className="login-heading">
          <h1 id="login-title">로그인</h1>
          <p>직원 계정으로 로그인하세요.</p>
        </header>
        <LoginForm />
        <footer className="login-footer">
          <p>역할별로 접근 범위가 다릅니다</p>
          <ul className="role-list" aria-label="직원 역할">
            <li className="doctor-role">원장</li>
            <li>상담실장</li>
            <li>데스크</li>
            <li>간호사</li>
          </ul>
        </footer>
      </section>
    </main>
  );
}

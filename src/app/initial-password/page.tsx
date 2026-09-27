import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { logoutAction } from "../auth-actions";
import PasswordForm from "./password-form";

export default async function InitialPasswordPage() {
  const session = await getSession();
  if (!session) redirect("/");
  if (!session.mustChangePassword) redirect("/dashboard");
  return (
    <main className="login-page">
      <section className="login-card" aria-labelledby="password-title">
        <div className="login-brand"><span className="brand-mark" aria-hidden="true" />우리메디 CRM</div>
        <header className="login-heading"><h1 id="password-title">최초 비밀번호 변경</h1><p>계정 보호를 위해 새 비밀번호를 설정해 주세요.</p></header>
        <PasswordForm />
        <form action={logoutAction}><button className="recovery-button password-logout" type="submit">로그아웃</button></form>
      </section>
    </main>
  );
}

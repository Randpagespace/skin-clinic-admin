import type { ReactNode } from "react";
import Sidebar from "./sidebar";
import { requireSession } from "@/lib/session";
import { roles } from "@/lib/session-codec";
import CustomerStore from "./customers/customer-store";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await requireSession();
  return (
    <div className="admin-shell">
      <a className="skip-link" href="#admin-content">본문으로 이동</a>
      <Sidebar name={session.name} roleName={roles[session.role]} />
      <main id="admin-content" className="admin-main"><CustomerStore>{children}</CustomerStore></main>
    </div>
  );
}

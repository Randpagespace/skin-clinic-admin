"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "../auth-actions";

const groups = [
  { title: "데스크 콘솔", items: [
    { label: "대시보드", href: "/dashboard", icon: "M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h7v7h-7z" },
    { label: "고객", href: "/customers", icon: "M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0 M4 21v-2a8 8 0 0 1 16 0v2" },
    { label: "예약", icon: "M5 5h14v16H5z M8 3v4 M16 3v4 M5 10h14" },
    { label: "시술", icon: "M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0 M12 8v8 M8 12h8" },
    { label: "결제", icon: "M3 5h18v14H3z M3 10h18 M6 15h4" },
  ] },
  { title: "관리 콘솔", items: [
    { label: "시술·패키지 마스터", icon: "m12 3 9 5v9l-9 5-9-5V8z M3 8l9 5 9-5 M12 13v9" },
    { label: "매출·통계", icon: "M5 20v-7 M12 20V4 M19 20V9" },
    { label: "알림 관리", icon: "M6 16V9a6 6 0 0 1 12 0v7l2 2H4z M10 21h4" },
    { label: "직원 계정", icon: "M3 5h18v14H3z M7 9h3v3H7z M14 9h4 M14 13h4 M6 16h5" },
    { label: "데이터 이관", icon: "M3 4h18v5H3z M5 9v12h14V9 M9 13h6" },
  ] },
];

export default function Sidebar({ name, roleName }: { name: string; roleName: string }) {
  const pathname = usePathname();
  return (
    <aside className="admin-sidebar">
      <Link className="sidebar-brand" href="/dashboard"><span className="brand-mark" aria-hidden="true" />우리메디 CRM</Link>
      <nav aria-label="관리자 메뉴">
        {groups.map(group => (
          <div className="nav-group" key={group.title}>
            <p className="nav-group-title">{group.title}</p>
            {group.items.map(item => {
              const icon = <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={item.icon} /></svg>;
              return "href" in item && item.href ? (
                <Link key={item.label} className="nav-item" href={item.href} aria-current={pathname === item.href || pathname.startsWith(`${item.href}/`) ? "page" : undefined}>{icon}{item.label}</Link>
              ) : (
                <button className="nav-item" key={item.label} type="button" disabled title="아직 구현되지 않은 메뉴입니다">{icon}{item.label}</button>
              );
            })}
          </div>
        ))}
      </nav>
      <div className="sidebar-account">
        <span className="account-avatar" aria-hidden="true">{name.slice(0, 1)}</span>
        <div><strong>{name}</strong><span>{roleName}</span></div>
        <form action={logoutAction}><button type="submit" className="exit-preview">로그아웃</button></form>
      </div>
    </aside>
  );
}

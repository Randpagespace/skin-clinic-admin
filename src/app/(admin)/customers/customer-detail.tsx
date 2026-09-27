"use client";

import Link from "next/link";
import { useCustomers } from "./customer-store";

const packages = [
  { name: "리프팅 10회 패키지", remaining: 6, total: 10, status: "사용중", expires: "2027.01.15", expiring: false },
  { name: "제모 5회 패키지", remaining: 1, total: 5, status: "만료 임박", expires: "2026.08.02", expiring: true },
];

const history = [
  { date: "2026.07.06", description: "리프팅 시술 완료", detail: "1회 차감", employee: "간호사A" },
  { date: "2026.06.20", description: "제모 시술 완료", detail: "1회 차감", employee: "간호사B" },
  { date: "2026.01.15", description: "리프팅 10회 패키지 구매", detail: "₩1,800,000", employee: "상담실장" },
];

export default function CustomerDetail({ id }: { id: string }) {
  const { customers } = useCustomers();
  const customer = customers.find(item => item.id === id);
  if (!customer) return <div className="customer-detail"><section className="panel customer-profile"><h1>고객을 찾을 수 없습니다</h1><p>추가한 예시 고객은 새로고침하면 초기화됩니다.</p><Link href="/customers">고객 목록으로</Link></section></div>;
  const customerPackages = id === "demo" ? packages : [];
  const customerHistory = id === "demo" ? history : [];
  return (
    <>
      <header className="admin-header">
        <div className="customer-breadcrumb"><Link href="/customers">고객 목록</Link><span aria-hidden="true">/</span><h1>{customer.name}</h1><span className="preview-badge">예시 데이터</span></div>
        <div className="header-actions" title="실제 업무 처리 API는 아직 연결되지 않았습니다">
          <button type="button" disabled>결제 기록</button>
          <button type="button" disabled>시술 완료</button>
          <button type="button" className="primary-action" disabled>패키지 판매</button>
        </div>
      </header>
      <div className="customer-detail">
        <section className="customer-profile panel" aria-labelledby="customer-name">
          <div className="profile-heading"><span className="customer-avatar" aria-hidden="true">{customer.name.slice(0,1)}</span><div><h2 id="customer-name">{customer.name}</h2><p>{customer.gender} · {customer.birthDate}</p></div></div>
          <dl className="customer-facts">
            <div><dt>연락처</dt><dd>{customer.phone}</dd></div>
            <div><dt>유입경로</dt><dd><span className="source-tag">{customer.source}</span></dd></div>
            <div><dt>마케팅 수신</dt><dd className={customer.consent ? "consent-status" : ""}>{customer.consent ? "동의함" : "미동의"}</dd></div>
            <div><dt>첫 방문</dt><dd>{customer.firstVisit || "방문 이력 없음"}</dd></div>
          </dl>
          <h3 className="memo-title">상담 메모</h3>
          <p className="consultation-memo">{customer.memo || "등록된 상담 메모가 없습니다."}</p>
        </section>
        <div className="customer-records">
          <section aria-labelledby="packages-title">
            <h2 className="section-title" id="packages-title">보유 패키지</h2>
            <div className="package-grid">
              {customerPackages.length === 0 && <p className="sample-note">보유 패키지가 없습니다.</p>}
              {customerPackages.map(pkg => (
                <article className={`package-card panel${pkg.expiring ? " expiring" : ""}`} key={pkg.name}>
                  <div className="package-heading"><h3>{pkg.name}</h3><span className="package-status">{pkg.status}</span></div>
                  <p className="package-balance"><strong>{pkg.remaining}</strong><span>/ {pkg.total}회 잔여</span></p>
                  <progress value={pkg.remaining} max={pkg.total} aria-label={`${pkg.name} 잔여 ${pkg.remaining}회`} />
                  <p className="package-expiry">유효기간 · {pkg.expires}</p>
                </article>
              ))}
            </div>
          </section>
          <section className="history-panel panel" aria-labelledby="history-title">
            <h2 className="section-title" id="history-title">최근 이력</h2>
            <div className="history-table-scroll"><table className="history-table">
              <thead><tr><th scope="col">날짜</th><th scope="col">내용</th><th scope="col">처리자</th></tr></thead>
              <tbody>{customerHistory.map(item => <tr key={item.date}><td>{item.date}</td><td>{item.description}<span className="history-detail"> · {item.detail}</span></td><td>{item.employee}</td></tr>)}{customerHistory.length === 0 && <tr><td colSpan={3}>등록된 이력이 없습니다.</td></tr>}</tbody>
            </table></div>
            <p className="sample-note">화면 확인용 예시입니다. 패키지 상태와 이력은 실제 고객 데이터가 아닙니다.</p>
          </section>
        </div>
      </div>
    </>
  );
}

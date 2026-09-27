import { requireSession } from "@/lib/session";

export default async function DashboardPage() {
  await requireSession();
  return (
    <>
      <header className="admin-header"><h1>대시보드</h1></header>
      <div className="dashboard-placeholder">DASHBOARD</div>
    </>
  );
}

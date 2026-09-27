import { requireSession } from '@/lib/session';
import CustomerDetail from '../customer-detail';
export default async function CustomerPage({params}: {params: Promise<{id: string}>}) {
  await requireSession();
  const {id} = await params;
  return <CustomerDetail id={id} />;
}

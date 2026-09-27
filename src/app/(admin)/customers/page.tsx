import { requireSession } from '@/lib/session';
import CustomerList from './customer-list';
export default async function CustomersPage() {
  await requireSession();
  return <CustomerList />;
}

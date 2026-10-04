import Link from 'next/link';
import { requireAdmin } from '@/server/auth';
import { Logo } from '@/components/ui/logo';
import { LogoutButton } from '@/components/admin/logout-button';
import fr from '../../../../messages/fr.json';
export const dynamic = 'force-dynamic';
export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return <div className="admin-body"><header className="admin-header"><Logo/><nav><Link href="/admin">{fr.admin.dashboard}</Link><Link href="/admin/requests">{fr.admin.requests}</Link><LogoutButton/></nav></header><main className="admin-main">{children}</main></div>;
}

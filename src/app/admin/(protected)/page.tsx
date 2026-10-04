import Link from 'next/link';
import { db } from '@/lib/db';
import { requireAdmin } from '@/server/auth';
import { RequestsTable } from '@/components/admin/requests-table';
import fr from '../../../../messages/fr.json';
export default async function Dashboard() {
  await requireAdmin();
  const [counts, recent] = await Promise.all([db.auditRequest.groupBy({ by: ['status'], _count: { _all: true } }), db.auditRequest.findMany({ take: 7, orderBy: { createdAt: 'desc' }, include: { property: true } })]);
  const stats = Object.fromEntries(counts.map(row => [row.status, row._count._all]));
  const t = fr.admin;
  return <><div className="admin-heading"><div><h1>{t.title}</h1><p>{t.subtitle}</p></div><Link className="button" href="/admin/requests">{t.viewAll} ↗</Link></div><div className="stats-grid">{[{ label: t.total, value: counts.reduce((sum, row) => sum + row._count._all, 0) }, { label: t.new, value: stats.NEW || 0 }, { label: t.progress, value: stats.IN_PROGRESS || 0 }, { label: t.sent, value: stats.AUDIT_SENT || 0 }].map(stat => <div className="stat-card" key={stat.label}><span>{stat.label}</span><strong>{stat.value}</strong></div>)}</div><section className="admin-panel"><h2>{t.recent}</h2><RequestsTable requests={recent}/></section></>;
}

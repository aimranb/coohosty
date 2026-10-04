import Link from 'next/link';
import type { Prisma } from '@prisma/client';
import { displayValue } from '@/lib/request-data';
import fr from '../../../messages/fr.json';
type Row = Prisma.AuditRequestGetPayload<{ include: { property: true } }>;
export function RequestsTable({ requests }: { requests: Row[] }) {
  const t = fr.admin;
  if (!requests.length) return <p className="empty-state">{t.empty}</p>;
  return <div className="table-scroll"><table><thead><tr>{[t.date, t.name, t.city, t.type, t.plan, t.status, t.phone, t.email, t.actions].map(title => <th key={title} scope="col">{title}</th>)}</tr></thead><tbody>{requests.map(request => <tr key={request.id}><td>{request.createdAt.toLocaleDateString('fr-MA')}</td><td>{request.fullName}</td><td>{request.property?.city}</td><td>{displayValue(request.property?.type)}</td><td>{displayValue(request.plan)}</td><td><span className={`status-badge status-${request.status}`}>{t[`status${request.status}`]}</span></td><td><bdi>{request.phone}</bdi></td><td>{request.email}</td><td><Link href={`/admin/requests/${request.id}`}>{t.open} ↗</Link></td></tr>)}</tbody></table></div>;
}

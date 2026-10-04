import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { requireAdmin } from '@/server/auth';
import { requestSections } from '@/lib/request-data';
import { StatusForm } from '@/components/admin/status-form';
import { RetryEmails } from '@/components/admin/retry-emails';
import fr from '../../../../../../messages/fr.json';
export default async function RequestDetails({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin(); const { id } = await params;
  const request = await db.auditRequest.findUnique({ where: { id }, include: { property: { include: { photos: true } }, activities: { include: { user: { select: { email: true } } }, orderBy: { createdAt: 'desc' } }, emails: true } });
  if (!request) notFound();
  const t = fr.admin;
  return <><div className="admin-heading"><div><Link href="/admin/requests">← {t.back}</Link><h1 style={{ marginTop: 15 }}>{request.fullName}</h1><p>{request.property?.city} · {request.createdAt.toLocaleString('fr-MA')}</p></div><span className={`status-badge status-${request.status}`}>{t[`status${request.status}`]}</span></div><div className="detail-actions"><a className="button button-outline" href={`tel:${request.phone.replace(/[^+\d]/g, '')}`}>{t.call}</a><a className="button button-outline" href={`https://wa.me/${request.phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer">{t.whatsapp}</a><a className="button button-outline" href={`mailto:${request.email}`}>{t.mail}</a><a className="button button-outline" href={`/api/admin/export?id=${id}`}>{t.export} ↓</a><a className="button" href={`/api/admin/requests/${id}/pdf`}>{t.pdf} ↓</a></div><div className="admin-panel"><StatusForm id={id} status={request.status}/></div><div className="detail-grid">{requestSections(request).map(section => <section className="admin-panel" key={section.title}><h2>{section.title}</h2><dl className="detail-list">{section.rows.map(row => <div key={row.label} style={{ display: 'contents' }}><dt>{row.label}</dt><dd>{row.value}</dd></div>)}</dl></section>)}</div><section className="admin-panel" id="photos"><h2>{t.photos}</h2>{request.property?.photos.length ? <div className="admin-photo-grid">{request.property.photos.map((photo, i) => <a key={photo.id} href={`/api/admin/photos/${photo.id}`} target="_blank" rel="noopener noreferrer"><Image src={`/api/admin/photos/${photo.id}`} width={300} height={200} alt={`${t.photos} ${i + 1}`} unoptimized/></a>)}</div> : <p>{t.noPhotos}</p>}</section><section className="admin-panel"><h2>{t.emails}</h2>{request.emails.map(email => <p key={email.id} style={{ fontSize: 12, marginBottom: 10 }}>{email.kind} · {email.sentAt ? `${t.emailSent} ${email.sentAt.toLocaleString('fr-MA')}` : t.emailPending} · {email.attempts} {t.attempts}</p>)}{request.emails.some(email => !email.sentAt) && <RetryEmails id={id}/>}</section><section className="admin-panel"><h2>{t.activity}</h2>{request.activities.map(activity => <p key={activity.id} style={{ fontSize: 12 }}>{activity.createdAt.toLocaleString('fr-MA')} · {activity.user.email} · {activity.action}</p>)}</section></>;
}

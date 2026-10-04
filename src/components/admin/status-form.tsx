'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import type { RequestStatus } from '@prisma/client';
export function StatusForm({ id, status }: { id: string; status: RequestStatus }) {
  const t = useTranslations('admin'); const router = useRouter();
  const [value, setValue] = useState(status), [busy, setBusy] = useState(false), [message, setMessage] = useState('');
  return <form className="status-form" onSubmit={async event => { event.preventDefault(); setBusy(true); setMessage(''); try { const response = await fetch(`/api/admin/requests/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: value }) }); if (!response.ok) throw new Error(); setMessage(t('saved')); router.refresh(); } catch { setMessage(t('error')); } finally { setBusy(false); } }}><label htmlFor="request-status">{t('status')}</label><select id="request-status" value={value} onChange={event => setValue(event.target.value as RequestStatus)}>{(['NEW', 'IN_PROGRESS', 'AUDIT_SENT'] as const).map(item => <option key={item} value={item}>{t(`status${item}`)}</option>)}</select><button className="button" type="submit" disabled={busy}>{t(busy ? 'saving' : 'save')}</button><p role="status">{message}</p></form>;
}

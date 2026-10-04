'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
export function RetryEmails({ id }: { id: string }) {
  const t = useTranslations('admin'); const router = useRouter();
  const [busy, setBusy] = useState(false), [error, setError] = useState(false);
  return <><button className="button button-outline" disabled={busy} type="button" onClick={async () => { setBusy(true); setError(false); try { const result = await fetch(`/api/admin/requests/${id}/emails`, { method: 'POST' }); if (!result.ok) throw new Error(); router.refresh(); } catch { setError(true); } finally { setBusy(false); } }}>{t('retryEmails')}</button>{error && <p role="alert">{t('error')}</p>}</>;
}

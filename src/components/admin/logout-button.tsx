'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
export function LogoutButton() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);
  const router = useRouter(); const t = useTranslations('admin');
  return <><button type="button" disabled={busy} onClick={async () => { setBusy(true); setError(false); try { const response = await fetch('/api/auth/logout', { method: 'POST' }); if (!response.ok) throw new Error(); router.replace('/admin/login'); router.refresh(); } catch { setError(true); setBusy(false); } }}>{t('logout')}</button>{error && <span role="alert">{t('error')}</span>}</>;
}

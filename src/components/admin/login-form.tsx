'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { LoaderCircle, ArrowRight } from 'lucide-react';
import { Logo } from '@/components/ui/logo';
export function LoginForm() {
  const t = useTranslations('admin'); const router = useRouter();
  const [busy, setBusy] = useState(false), [error, setError] = useState('');
  return <div className="login-card"><Logo/><h1>{t('login')}</h1><p>{t('loginDescription')}</p><form onSubmit={async event => { event.preventDefault(); if (busy) return; const data = new FormData(event.currentTarget); setBusy(true); setError(''); try { const response = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: data.get('email'), password: data.get('password') }) }); if (!response.ok) throw new Error(); router.replace('/admin'); router.refresh(); } catch { setError(t('loginError')); setBusy(false); } }}><div className="field"><label htmlFor="admin-email">{t('email')}</label><input id="admin-email" name="email" type="email" required autoComplete="username"/></div><div className="field"><label htmlFor="admin-password">{t('password')}</label><input id="admin-password" name="password" type="password" required autoComplete="current-password" maxLength={72}/></div><button className="button" disabled={busy} type="submit">{t(busy ? 'signingIn' : 'signIn')}{busy ? <LoaderCircle className="spinner" size={16}/> : <ArrowRight size={16}/>}</button>{error && <p className="alert" role="alert">{error}</p>}</form></div>;
}

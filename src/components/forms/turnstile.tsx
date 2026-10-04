'use client';
import Script from 'next/script';
import { useEffect, useRef, useState } from 'react';
declare global { interface Window { turnstile?: { render: (element: HTMLElement, options: { sitekey: string; callback: (token: string) => void; 'expired-callback': () => void; 'error-callback': () => void }) => string; remove: (id: string) => void } } }
export function Turnstile({ onToken }: { onToken: (token: string) => void }) {
  const [loaded, setLoaded] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const callback = useRef(onToken);
  useEffect(() => { callback.current = onToken; }, [onToken]);
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
    if (!loaded || !key || !ref.current || !window.turnstile) return;
    const id = window.turnstile.render(ref.current, { sitekey: key, callback: token => callback.current(token), 'expired-callback': () => callback.current(''), 'error-callback': () => callback.current('') });
    return () => window.turnstile?.remove(id);
  }, [loaded]);
  if (!process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY) return null;
  return <><Script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit" onReady={() => setLoaded(true)}/><div ref={ref} className="field-full"/></>;
}

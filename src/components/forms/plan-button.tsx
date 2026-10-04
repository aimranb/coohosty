'use client';
import type { Plan } from '@/config/site';
export function PlanButton({ plan, className, children }: { plan: Plan; className: string; children: React.ReactNode }) {
  return <a href={`?plan=${plan}#contact`} className={className} onClick={event => {
    event.preventDefault();
    const url = new URL(window.location.href);
    url.searchParams.set('plan', plan); url.hash = 'contact';
    window.history.replaceState(null, '', url);
    window.dispatchEvent(new CustomEvent('cohosty:plan', { detail: plan }));
    document.querySelector('#contact')?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  }}>{children}</a>;
}

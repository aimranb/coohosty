'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Menu, X, Phone, Globe } from 'lucide-react';
import { Logo } from '@/components/ui/logo';
import { locales, site, type Locale } from '@/config/site';
export function Header({ locale }: { locale: Locale }) {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [compact, setCompact] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLElement>(null);
  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 30);
    onScroll(); window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setOpen(false); toggle.current?.focus(); }
      if (event.key === 'Tab') {
        const links = menu.current?.querySelectorAll<HTMLAnchorElement>('a');
        if (!links?.length) return;
        const first = links[0], last = links[links.length - 1];
        if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); toggle.current?.focus(); }
        else if (event.shiftKey && document.activeElement === toggle.current) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === toggle.current) { event.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);
  return <header className={`site-header ${compact ? 'compact' : ''}`}><div className="header-inner"><Logo href={`/${locale}`} /><nav aria-label={t('menu')} className="desktop-nav">{site.navigation.map(id => <Link key={id} href={`/${locale}#${id}`}>{t(id)}</Link>)}</nav><div className="header-actions"><Globe className="navbar-language-icon" size={20} aria-hidden="true"/><select className="language-select" aria-label={t('language')} value={locale} onChange={event => { window.location.href = pathname.replace(/^\/(fr|en|ar)/, `/${event.target.value}`) + window.location.hash; }}>{locales.map(language => <option key={language} value={language}>{language.toUpperCase()}</option>)}</select><a className="call-link" href={`tel:${site.tel}`} aria-label={t('call')}><Phone size={16}/></a><Link href={`/${locale}#contact`} className="button header-button">{t('audit')}<ArrowUpRight size={15}/></Link><button ref={toggle} type="button" className="mobile-toggle" aria-expanded={open} aria-controls="mobile-menu" aria-label={t('menu')} onClick={() => setOpen(!open)}>{open ? <X/> : <Menu/>}</button></div></div>{open && <nav ref={menu} id="mobile-menu" className="mobile-menu" aria-label={t('menu')}>{site.navigation.map(id => <Link key={id} href={`/${locale}#${id}`} onClick={() => setOpen(false)}>{t(id)}<ArrowUpRight size={18}/></Link>)}<a href={`tel:${site.tel}`}>{site.phone}</a></nav>}</header>;
}

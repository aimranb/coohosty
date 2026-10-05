'use client';
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { ArrowRight, Check, X } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

type PlanServices = { id: string; subtitle: string; groups: { id: string; title: string; features: string[] }[] };
type PanelContext = { active: string | null; toggle: (id: string, trigger: HTMLButtonElement) => void };
const ServicesContext = createContext<PanelContext | null>(null);

export function PlanServicesLayout({ cards, plans, title, closeLabel }: { cards: ReactNode[]; plans: PlanServices[]; title: string; closeLabel: string }) {
  const [active, setActive] = useState<string | null>(null);
  const reduced = useReducedMotion();
  const trigger = useRef<HTMLButtonElement | null>(null);
  const heading = useRef<HTMLHeadingElement | null>(null);
  const selected = plans.find(plan => plan.id === active);
  function close() { setActive(null); trigger.current?.focus({ preventScroll: true }); }
  useEffect(() => {
    if (!active) return;
    const focusTimer = window.setTimeout(() => heading.current?.focus({ preventScroll: true }), reduced ? 40 : 950);
    function escape(event: KeyboardEvent) {
      if (event.key === 'Escape') { setActive(null); trigger.current?.focus({ preventScroll: true }); }
    }
    document.addEventListener('keydown', escape);
    return () => { window.clearTimeout(focusTimer); document.removeEventListener('keydown', escape); };
  }, [active, reduced]);
  return <ServicesContext.Provider value={{ active, toggle: (id, button) => { trigger.current = button; setActive(current => current === id ? null : id); } }}>
    <div className={`plan-services-layout ${selected ? 'has-services-panel' : ''}`}>
      <div className="plan-grid plan-services-track">
        {cards.map((card, index) => <div key={plans[index].id} className="plan-services-card" data-plan-card={plans[index].id}>{card}</div>)}
      </div>
      <AnimatePresence initial={false} mode="wait">{selected && <motion.aside key={selected.id} id="plan-services-panel" className="plan-services-panel" aria-labelledby="plan-services-title" initial={{ width: 0, marginLeft: 0, opacity: 0, x: reduced ? 0 : 40 }} animate={{ width: 'var(--services-panel-width)', marginLeft: 18, opacity: 1, x: 0 }} exit={{ width: 0, marginLeft: 0, opacity: 0, x: reduced ? 0 : 30 }} transition={{ duration: reduced ? 0 : .45, ease: [.22, 1, .36, 1] }}>
        <div className="plan-services-panel-inner">
        <div className="plan-services-panel-heading"><div><span>{title}</span><h3 id="plan-services-title" ref={heading} tabIndex={-1}>{selected.id}</h3><p>{selected.subtitle}</p></div><button type="button" className="plan-services-close" aria-label={closeLabel} onClick={close}><X size={20}/></button></div>
        <div className="plan-services-panel-body" key={selected.id}>{selected.groups.map((group, index) => <section className="plan-services-group" key={group.id} style={{ animationDelay: `${index * 70}ms` }}><h4>{group.title}</h4><ul>{group.features.map(feature => <li key={feature}><Check size={16} aria-hidden="true"/><span>{feature}</span></li>)}</ul></section>)}</div>
        </div>
      </motion.aside>}</AnimatePresence>
    </div>
  </ServicesContext.Provider>;
}

export function PlanServicesButton({ plan, children }: { plan: string; children: ReactNode }) {
  const context = useContext(ServicesContext);
  if (!context) throw new Error('PlanServicesButton requires PlanServicesLayout');
  const expanded = context.active === plan;
  return <button type="button" className="plan-services-button" aria-expanded={expanded} aria-controls={expanded ? 'plan-services-panel' : undefined} onClick={event => context.toggle(plan, event.currentTarget)}><span>{children}</span><ArrowRight size={19} aria-hidden="true"/></button>;
}

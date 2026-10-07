'use client';

import { useEffect, useState, type CSSProperties, type ReactNode } from 'react';
import { Pause, Play } from 'lucide-react';
import { Logo } from '@/components/ui/logo';
import { useVisibleMotion } from '@/components/ui/use-visible-motion';
import { motionCopy } from '@/config/motion-copy';
import type { Locale } from '@/config/site';

type Connection = { id: string; path: string; kind: 'input' | 'output'; index: number };
type Geometry = { width: number; height: number; connections: Connection[] };

export function AnalysisNetwork({ tools, children, locale }: { tools: ReactNode; children: ReactNode; locale: Locale }) {
  const { root, running, reduced, paused, setPaused } = useVisibleMotion();
  const [geometry, setGeometry] = useState<Geometry>({ width: 1, height: 1, connections: [] });
  const copy = motionCopy[locale];

  useEffect(() => {
    const stage = root.current;
    if (!stage) return;
    let frame = 0;
    let disposed = false;
    function measure() {
      if (!stage || disposed) return;
      const box = stage.getBoundingClientRect();
      const hub = stage.querySelector<HTMLElement>('[data-flow-hub]')?.getBoundingClientRect();
      if (!hub || !box.width) return;
      const mobile = window.matchMedia('(max-width: 760px)').matches;
      const connections: Connection[] = [];
      const local = (rect: DOMRect) => ({ left: rect.left - box.left, right: rect.right - box.left, top: rect.top - box.top, bottom: rect.bottom - box.top, x: rect.left + rect.width / 2 - box.left, y: rect.top + rect.height / 2 - box.top });
      const center = local(hub);
      stage.querySelectorAll<HTMLElement>('[data-flow-source]').forEach((element, index) => {
        const source = local(element.getBoundingClientRect());
        let path: string;
        if (mobile) {
          path = `M${source.x} ${source.bottom} C${source.x} ${source.bottom + 28} ${center.x} ${center.top - 28} ${center.x} ${center.top}`;
        } else {
          const forward = source.x < center.x;
          const sx = forward ? source.right : source.left;
          const hx = forward ? center.left : center.right;
          const bend = (sx + hx) / 2;
          path = `M${sx} ${source.y} C${bend} ${source.y} ${bend} ${center.y} ${hx} ${center.y}`;
        }
        connections.push({ id: `source-${index}`, path, kind: 'input', index });
      });
      stage.querySelectorAll<HTMLElement>('[data-flow-target]').forEach((element, index) => {
        const target = local(element.getBoundingClientRect());
        let path: string;
        if (mobile) {
          const gutter = 12;
          path = `M${center.left} ${center.y} L${gutter + 10} ${center.y} Q${gutter} ${center.y} ${gutter} ${center.y + 10} L${gutter} ${target.y - 10} Q${gutter} ${target.y} ${gutter + 10} ${target.y} L${target.left} ${target.y}`;
        } else {
          const forward = center.x < target.x;
          const hx = forward ? center.right : center.left;
          const tx = forward ? target.left : target.right;
          const bend = (hx + tx) / 2;
          path = `M${hx} ${center.y} C${bend} ${center.y} ${bend} ${target.y} ${tx} ${target.y}`;
        }
        connections.push({ id: `target-${index}`, path, kind: 'output', index });
      });
      setGeometry({ width: box.width, height: box.height, connections });
    }
    const schedule = () => { if (disposed) return; cancelAnimationFrame(frame); frame = requestAnimationFrame(measure); };
    const observer = new ResizeObserver(schedule);
    observer.observe(stage);
    stage.querySelectorAll<HTMLElement>('[data-flow-source], [data-flow-hub], [data-flow-target]').forEach(element => observer.observe(element));
    window.addEventListener('resize', schedule);
    document.fonts.ready.then(schedule);
    schedule();
    return () => { disposed = true; observer.disconnect(); window.removeEventListener('resize', schedule); cancelAnimationFrame(frame); };
  }, [root]);

  return <div ref={root} className="analysis-network" data-running={running} data-reduced={reduced} role="group" aria-label={copy.network}>
    <svg className="analysis-network-wires" viewBox={`0 0 ${geometry.width} ${geometry.height}`} aria-hidden="true">
      {geometry.connections.map(connection => <g key={connection.id} className={`analysis-connection ${connection.kind}`} style={{ '--launch-delay': `${connection.kind === 'input' ? connection.index * .24 : 2.1 + connection.index * .28}s` } as CSSProperties}>
        <path className="analysis-wire" d={connection.path} fill="none"/>
        <path className="analysis-beam" d={connection.path} fill="none" pathLength="100"/>
        <g className="analysis-projectile" style={{ offsetPath: `path("${connection.path}")` }}>
          <path className="analysis-projectile-trail" d="M-20 0 H-5"/>
          <path className="analysis-projectile-arrow" d="M-7 -4 L0 0 L-7 4"/>
          <circle r="2" fill="#ff7415"/>
        </g>
      </g>)}
    </svg>
    <div className="analysis-network-sources"><span className="analysis-network-kicker">{copy.sources}</span>{tools}</div>
    <div className="analysis-network-center">
      <div className="analysis-network-hub" data-flow-hub><Logo href={`/${locale}`} centered/></div>
      <button type="button" className="analysis-network-pause" aria-label={paused ? copy.play : copy.pause} aria-pressed={paused} onClick={() => setPaused(value => !value)}>{paused ? <Play size={13}/> : <Pause size={13}/>}</button>
    </div>
    <div className="analysis-network-targets"><span className="analysis-network-kicker">{copy.decisions}</span>{children}</div>
  </div>;
}

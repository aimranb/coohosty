'use client';

import { useEffect, useRef } from 'react';
import styles from './income-motion.module.css';

export function IncomeMotion({ children }: { children: React.ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stage = root.current;
    if (!stage) return;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const animations: Animation[] = [];
    let started = false;
    let visible = false;
    const cycle = 9000;
    const ease = 'cubic-bezier(.22,1,.36,1)';

    function animate(selector: string, frames: Keyframe[], delay: number, stagger = 0, duration = 800, repeat = true) {
      stage!.querySelectorAll<HTMLElement | SVGElement>(selector).forEach((element, index) => {
        const start = delay + index * stagger;
        if (repeat) {
          const first = frames[0];
          const last = frames[frames.length - 1];
          animations.push(element.animate([
            { ...first, offset: 0 },
            { ...first, offset: start / cycle, easing: ease },
            { ...last, offset: (start + duration) / cycle },
            { ...last, offset: .96, easing: 'ease-in-out' },
            { ...first, offset: 1 },
          ], { duration: cycle, iterations: Infinity, fill: 'both' }));
        } else {
          animations.push(element.animate(frames, { duration, delay: start, easing: ease, fill: 'both' }));
        }
      });
    }

    function play() {
      if (started || preference.matches) return;
      started = true;
      animate('.income-intro-copy > .eyebrow, .income-intro-copy > h2, .income-intro-cta', [{ opacity: 0, translate: '0 14px' }, { opacity: 1, translate: '0 0' }], 0, 160, 800, false);
      animate('.income-phone', [{ opacity: 0, translate: '0 36px' }, { opacity: 1, translate: '0 0' }], 320, 420, 1100, false);
      animate('.income-stars svg', [{ opacity: .18, scale: '.65', fill: 'transparent' }, { opacity: 1, scale: '1', fill: '#ff7415' }], 1200, 95, 650);
      animate('.income-mini-guest', [{ opacity: 0, translate: '0 8px' }, { opacity: 1, translate: '0 0' }], 2450);
      animate('.income-mini-task', [{ opacity: 0, translate: '0 6px' }, { opacity: 1, translate: '0 0' }], 2850);
      animate('.income-chart > span', [{ transform: 'scaleY(0)', opacity: .2 }, { transform: 'scaleY(1)', opacity: 1 }], 1900, 110, 1200);
      animate('.income-chart-axis > span', [{ opacity: 0 }, { opacity: 1 }], 2400, 180);
      animate('.income-donut', [{ opacity: 0, scale: '.82' }, { opacity: 1, scale: '1' }], 3150, 0, 1000);
      animate('.income-occupancy li', [{ opacity: 0, translate: '0 5px' }, { opacity: 1, translate: '0 0' }], 3400, 180);
      animate('.income-mini-calendar > span', [{ opacity: .2 }, { opacity: 1 }], 2400, 25, 450);
      animate('.income-calendar-stay', [{ transform: 'scaleX(0)', opacity: 0 }, { transform: 'scaleX(1)', opacity: 1 }], 3300, 550, 1000);
      animate('.income-cleaning', [{ opacity: 0, translate: '0 8px' }, { opacity: 1, translate: '0 0' }], 4900, 0, 900);
      animate('.income-cleaning > span', [{ scale: '.65' }, { scale: '1' }], 5150, 0, 700);
    }

    function syncPlayback() {
      animations.forEach(animation => {
        if (visible && !document.hidden && !preference.matches) {
          if (animation.playState === 'paused') animation.play();
        } else if (animation.playState === 'running') animation.pause();
      });
    }

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting && entry.intersectionRatio >= .12;
      if (visible) {
        play();
      }
      syncPlayback();
    }, { threshold: .12 });
    observer.observe(stage);
    function reduceMotion() {
      if (preference.matches) {
        animations.forEach(animation => animation.cancel());
        animations.length = 0;
        started = false;
      } else if (visible) {
        play();
        syncPlayback();
      }
    }
    preference.addEventListener('change', reduceMotion);
    document.addEventListener('visibilitychange', syncPlayback);
    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', syncPlayback);
      preference.removeEventListener('change', reduceMotion);
      animations.forEach(animation => animation.cancel());
    };
  }, []);

  return <div ref={root} className={`container income-intro-inner ${styles.stage}`}>{children}</div>;
}

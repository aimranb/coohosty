/** Pointer tracking shared by the Next wordmark and the dependency-free preview. */
export function mountLogoGaze(root) {
  const art = root.querySelector('.logo-gaze-art');
  if (!art) return () => {};
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const events = new AbortController();
  let frame = 0;
  const reset = () => {
    cancelAnimationFrame(frame);
    root.style.setProperty('--gaze-x', '0px');
    root.style.setProperty('--gaze-y', '0px');
  };
  const move = event => {
    if (motion.matches || document.hidden || event.pointerType === 'touch') return;
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      const box = art.getBoundingClientRect();
      const dx = event.clientX - box.left - box.width / 2;
      const dy = event.clientY - box.top - box.height / 2;
      const length = Math.hypot(dx, dy);
      const weight = Math.min(length / 180, 1);
      root.style.setProperty('--gaze-x', `${length ? dx / length * 7 * weight : 0}px`);
      root.style.setProperty('--gaze-y', `${length ? dy / length * 8 * weight : 0}px`);
    });
  };
  window.addEventListener('pointermove', move, { passive: true, signal: events.signal });
  window.addEventListener('blur', reset, { signal: events.signal });
  document.addEventListener('pointerleave', reset, { signal: events.signal });
  document.addEventListener('visibilitychange', reset, { signal: events.signal });
  motion.addEventListener('change', reset, { signal: events.signal });
  return () => { reset(); events.abort(); };
}

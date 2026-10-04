/** Shared eye choreography for the Next.js application and the local preview. */
export function mountEyeSignature(root) {
  const section = root.closest('#workflow');
  if (!section) return () => {};
  const steps = [...section.querySelectorAll('.workflow-steps li')];
  const artwork = root.querySelector('.signature-eyes');
  const pause = root.querySelector('.signature-pause');
  const focusLabel = root.querySelector('.signature-focus-label');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const events = new AbortController();
  const options = { signal: events.signal };
  let visible = false, paused = false, hovered = false, disposed = false;
  let active = 0, timer, blinkTimer, blinkEnd, pointerFrame;
  let lastPointer = 0, pointer = null;

  const canAnimate = () => visible && !paused && !motion.matches && !document.hidden && !disposed;
  const gaze = (x, y) => {
    root.style.setProperty('--gaze-x', `${Math.max(-7, Math.min(7, x))}px`);
    root.style.setProperty('--gaze-y', `${Math.max(-8, Math.min(8, y))}px`);
  };
  const lookAt = (x, y) => {
    const rect = artwork.getBoundingClientRect();
    gaze((x - rect.left - rect.width / 2) / Math.max(1, rect.width) * 12, (y - rect.top - rect.height / 2) / Math.max(1, rect.height) * 12);
  };
  const highlight = index => {
    active = index;
    steps.forEach((step, i) => step.classList.toggle('is-watched', i === index && canAnimate()));
    if (focusLabel && steps[index]) focusLabel.textContent = steps[index].dataset.signatureLabel;
  };
  const lookAtStep = index => {
    if (!steps[index] || !canAnimate()) return;
    const rect = steps[index].getBoundingClientRect();
    lookAt(rect.left + rect.width / 2, rect.top + 30);
  };
  const blink = () => {
    if (!canAnimate()) return;
    root.classList.add('is-blinking');
    clearTimeout(blinkEnd);
    blinkEnd = setTimeout(() => root.classList.remove('is-blinking'), 210);
  };
  const scheduleBlink = () => {
    clearTimeout(blinkTimer);
    if (canAnimate()) blinkTimer = setTimeout(() => { blink(); scheduleBlink(); }, 3800 + Math.random() * 2600);
  };
  const cycle = () => {
    clearTimeout(timer);
    if (!canAnimate()) return;
    if (!hovered) {
      highlight((active + 1) % steps.length);
      if (!pointer || performance.now() - lastPointer > 1600) lookAtStep(active);
    }
    timer = setTimeout(cycle, 2600);
  };
  const sync = () => {
    clearTimeout(timer); clearTimeout(blinkTimer); clearTimeout(blinkEnd);
    cancelAnimationFrame(pointerFrame);
    root.classList.remove('is-blinking');
    root.dataset.motionState = motion.matches ? 'reduced' : paused ? 'paused' : canAnimate() ? 'active' : 'idle';
    if (pause) {
      pause.disabled = motion.matches;
      pause.setAttribute('aria-pressed', String(paused));
      pause.setAttribute('aria-label', paused ? pause.dataset.resume : pause.dataset.pause);
      pause.textContent = paused ? pause.dataset.resume : pause.dataset.pause;
    }
    if (canAnimate()) {
      highlight(active); lookAtStep(active);
      timer = setTimeout(cycle, 2600); scheduleBlink();
    } else {
      gaze(0, 0);
      steps.forEach(step => step.classList.remove('is-watched'));
    }
  };

  section.addEventListener('pointermove', event => {
    if (!canAnimate() || event.pointerType !== 'mouse') return;
    pointer = { x: event.clientX, y: event.clientY }; lastPointer = performance.now();
    cancelAnimationFrame(pointerFrame);
    pointerFrame = requestAnimationFrame(() => { if (canAnimate() && pointer) lookAt(pointer.x, pointer.y); });
  }, { ...options, passive: true });
  section.addEventListener('pointerleave', () => { pointer = null; hovered = false; lookAtStep(active); }, options);
  steps.forEach((step, index) => {
    step.addEventListener('pointerenter', () => { if (canAnimate()) { hovered = true; highlight(index); lookAtStep(index); } }, options);
    step.addEventListener('pointerleave', () => { hovered = false; }, options);
  });
  root.addEventListener('pointerdown', event => { if (!event.target.closest('button')) blink(); }, options);
  pause?.addEventListener('click', () => { paused = !paused; sync(); }, options);
  document.addEventListener('visibilitychange', sync, options);
  window.addEventListener('blur', () => { pointer = null; gaze(0, 0); }, options);
  motion.addEventListener('change', sync, options);
  let observer;
  if ('IntersectionObserver' in window) {
    observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); }, { threshold: 0.18 });
    observer.observe(root);
  } else { visible = true; }
  sync();
  return () => {
    disposed = true; events.abort(); observer?.disconnect();
    clearTimeout(timer); clearTimeout(blinkTimer); clearTimeout(blinkEnd); cancelAnimationFrame(pointerFrame);
    root.classList.remove('is-blinking'); gaze(0, 0);
    steps.forEach(step => step.classList.remove('is-watched'));
  };
}

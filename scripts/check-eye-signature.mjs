/** Run without npm dependencies: node scripts/check-eye-signature.mjs */
import assert from 'node:assert/strict';
import { mountEyeSignature } from '../public/eye-signature.js';

class Element extends EventTarget {
  constructor() {
    super();
    this.dataset = {};
    this.attributes = new Map();
    this.classes = new Set();
    this.values = new Map();
    this.style = { setProperty: (key, value) => this.values.set(key, value) };
    this.classList = {
      add: value => this.classes.add(value),
      remove: value => this.classes.delete(value),
      toggle: (value, enabled) => enabled ? this.classes.add(value) : this.classes.delete(value),
    };
  }
  setAttribute(key, value) { this.attributes.set(key, value); }
  getBoundingClientRect() { return { left: 100, top: 100, width: 190, height: 112 }; }
}

const root = new Element(), section = new Element(), art = new Element(), pause = new Element(), label = new Element();
pause.dataset = { pause: 'Pause', resume: 'Resume' };
const steps = Array.from({ length: 5 }, (_, index) => {
  const element = new Element();
  element.dataset.signatureLabel = `Step ${index + 1}`;
  return element;
});
section.querySelectorAll = () => steps;
root.closest = () => section;
root.querySelector = selector => ({ '.signature-eyes': art, '.signature-pause': pause, '.signature-focus-label': label })[selector];
const motion = new Element();
motion.matches = false;
globalThis.matchMedia = () => motion;
globalThis.document = new Element();
document.hidden = false;
globalThis.window = new Element();
let observer;
function captureObserver(instance) { observer = instance; }
window.IntersectionObserver = globalThis.IntersectionObserver = class {
  constructor(callback) { this.callback = callback; captureObserver(this); }
  observe() {}
  disconnect() { this.disconnected = true; }
  show(visible) { this.callback([{ isIntersecting: visible }]); }
};
let sequence = 0;
const timers = new Map(), frames = new Map();
globalThis.setTimeout = callback => { timers.set(++sequence, callback); return sequence; };
globalThis.clearTimeout = id => timers.delete(id);
globalThis.requestAnimationFrame = callback => { frames.set(++sequence, callback); return sequence; };
globalThis.cancelAnimationFrame = id => frames.delete(id);

const cleanup = mountEyeSignature(root);
assert.equal(root.dataset.motionState, 'idle');
assert.equal(timers.size, 0);
observer.show(true);
assert.equal(root.dataset.motionState, 'active');
assert.equal(steps.filter(step => step.classes.has('is-watched')).length, 1);
assert.equal(label.textContent, 'Step 1');
const cycle = [...timers.values()][0];
cycle();
assert.equal(label.textContent, 'Step 2');
const pointer = new Event('pointermove');
Object.assign(pointer, { pointerType: 'mouse', clientX: 100000, clientY: -100000 });
section.dispatchEvent(pointer);
for (const callback of frames.values()) callback();
frames.clear();
assert.equal(root.values.get('--gaze-x'), '7px');
assert.equal(root.values.get('--gaze-y'), '-8px');
pause.dispatchEvent(new Event('click'));
assert.equal(root.dataset.motionState, 'paused');
assert.equal(pause.attributes.get('aria-pressed'), 'true');
assert.equal(timers.size, 0);
assert.equal(steps.filter(step => step.classes.has('is-watched')).length, 0);
pause.dispatchEvent(new Event('click'));
assert.equal(root.dataset.motionState, 'active');
motion.matches = true;
motion.dispatchEvent(new Event('change'));
assert.equal(root.dataset.motionState, 'reduced');
assert.equal(pause.disabled, true);
assert.equal(timers.size, 0);
assert.equal(root.values.get('--gaze-x'), '0px');
motion.matches = false;
motion.dispatchEvent(new Event('change'));
document.hidden = true;
document.dispatchEvent(new Event('visibilitychange'));
assert.equal(root.dataset.motionState, 'idle');
assert.equal(timers.size, 0);
document.hidden = false;
document.dispatchEvent(new Event('visibilitychange'));
observer.show(false);
assert.equal(timers.size, 0);
observer.show(true);
cleanup();
assert.equal(timers.size, 0);
assert.equal(frames.size, 0);
assert.equal(observer.disconnected, true);
assert.equal(steps.filter(step => step.classes.has('is-watched')).length, 0);
pause.dispatchEvent(new Event('click'));
assert.equal(pause.attributes.get('aria-pressed'), 'false');
console.log('Eye signature: bounded gaze, stage choreography, pause/resume, reduced motion, visibility and cleanup passed.');

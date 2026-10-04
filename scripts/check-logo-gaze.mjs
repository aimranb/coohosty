import assert from 'node:assert/strict';
import { mountLogoGaze } from '../public/logo-gaze.js';

const motion = new EventTarget();
motion.matches = false;
globalThis.matchMedia = () => motion;
globalThis.window = new EventTarget();
globalThis.document = new EventTarget();
document.hidden = false;
let callback;
globalThis.requestAnimationFrame = fn => { callback = fn; return 1; };
globalThis.cancelAnimationFrame = () => { callback = null; };
const values = new Map();
const root = {
  style: { setProperty: (key,value) => values.set(key,parseFloat(value)) },
  querySelector: () => ({ getBoundingClientRect: () => ({ left: 100, top: 100, width: 60, height: 40 }) }),
};
const dispose = mountLogoGaze(root);
function move(x,y,type='mouse') {
  const event = new Event('pointermove');
  Object.assign(event,{ clientX:x,clientY:y,pointerType:type });
  window.dispatchEvent(event);
  const paint=callback; callback=null; paint?.();
}
move(1000,120);
assert.equal(values.get('--gaze-x'),7);
assert.equal(values.get('--gaze-y'),0);
move(-1000,120);
assert.equal(values.get('--gaze-x'),-7);
move(130,1000);
assert.equal(values.get('--gaze-y'),8);
move(130,-1000);
assert.equal(values.get('--gaze-y'),-8);
motion.matches=true; motion.dispatchEvent(new Event('change'));
move(1000,1000);
assert.equal(values.get('--gaze-x'),0);
assert.equal(values.get('--gaze-y'),0);
motion.matches=false;
move(1000,120,'touch');
assert.equal(values.get('--gaze-x'),0);
move(1000,120);
window.dispatchEvent(new Event('blur'));
assert.equal(values.get('--gaze-x'),0);
dispose(); move(1000,120);
assert.equal(values.get('--gaze-x'),0);
assert.equal(callback,null);
console.log('Logo gaze: full-page tracking, bounded directions, reduced motion, touch, blur and cleanup passed.');

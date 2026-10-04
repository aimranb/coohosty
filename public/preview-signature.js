import { mountEyeSignature } from './eye-signature.js';

document.querySelectorAll('[data-eye-signature]').forEach(root => mountEyeSignature(root));

import { mountLogoGaze } from './logo-gaze.js';
document.querySelectorAll('.logo').forEach(root => mountLogoGaze(root));

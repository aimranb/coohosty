# Shared logo and city motion correction — 2026-10-02

Header and service signature use `EyeArtwork`, sharing eye geometry, pupil highlights and gold smile. `public/logo/full.svg` was generated from the matching signature SVG for the visual preview. The logo pointer controller tracks across the page, bounds pupil motion inside the eyes, excludes touch, respects reduced motion and cleans up listeners and frames.

The previous carousel stopped image motion on hover and after a city selection. Switching pauses during hover/focus, but cinematic image movement now pauses only on explicit pause, reduced-motion preference, hidden document or when the carousel leaves the viewport. City selection no longer sets an explicit pause. Destination cards keep moving on hover and retain their section pause button. Stronger 10–11 second zoom/pan cycles make the motion more apparent. These are animated photographs, not real city video recordings.

Validation commands: `node scripts/check-logo-gaze.mjs`, `node scripts/check-eye-signature.mjs`, `node --check public/preview-interactions.js`, `python -m py_compile scripts/preview.py`, `python scripts/check-gallery-preview.py`, `python scripts/check-city-tools-preview.py`, `python scripts/check-phone-cinema.py`. Full Next.js build remains blocked by uninstalled npm dependencies; browser visual rendering has not been verified.

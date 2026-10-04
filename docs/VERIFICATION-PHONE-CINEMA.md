# Reference-inspired listing and animated cities — 2026-10-02

The supplied local JPEG was inspected as design inspiration. Its composition informs an original COOHOSTY phone listing: immersive image, photo counter, title, illustrative stars, host team, arrival information and bottom audit bar. The reference image, Airbnb UI screenshots, guest names, rating and review totals are not published. Phone photos and counters stay synchronized with the ten-photo gallery. Copy is translated in French, English and Arabic.

City images have CSS zoom/pan motion and remain inside fixed frames with crossfading captions. This is a cinematic animation of photographs, not recorded video footage. The hero retains its motion pause, visibility and reduced-motion handling; destination cards have a pause control and reduced-motion overrides.

Checks: JavaScript syntax, Python compilation, gallery structural checks in all three languages and eye animation controller tests pass. Additional script `scripts/check-phone-cinema.py` checks the new phone hierarchy, absence of the reference rating/review metrics, translated generated/served preview parity, motion/pause/reduced-motion CSS and stylesheet route.

Full Next.js lint/test/build remain unverified because dependencies are unavailable. See VERIFICATION-CITY-TOOLS.md. No browser screenshot or mobile device rendering verification was possible; local preview HTTP and structural checks do not substitute for those checks.

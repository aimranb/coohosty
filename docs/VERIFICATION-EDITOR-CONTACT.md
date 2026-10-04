# Listing editor and contact redesign — 2026-10-02

The latest supplied reference is a listing editor, replacing the prior guest listing phone layout. The implementation follows its composition: black straight phone frame, white status/header, segmented tabs, photo-tour card with three overlapping gallery images, and title card. COOHOSTY content is translated; no copied Airbnb title, property metrics or claims are published. The phone remains a decorative preview, not an actual listing editor. Its three photos and title update together with the gallery.

City switching is now every 3000 ms, with a 700 ms fixed-frame opacity transition. Cinematic zoom/pan remains active, respecting pause and reduced motion.

Contact has a restrained lavender background, larger inputs, stronger readable labels, softer card borders, prominent focus states, red validation errors, five labeled progress steps, per-step guidance and direct WhatsApp access. Existing submission validation and backend logic are unchanged. Mobile uses a single-column form. The lightweight local preview still does not submit to the real backend.

Passed: Python compilation, preview JavaScript syntax, gallery regression checks, logo gaze tests, city/tools preview checks, phone/cinema checks and `scripts/check-editor-contact.py` in all three locales. That final check covers editor hierarchy, three image offsets, contact guidance, progress labels, WhatsApp, translation parity, matching served HTML and the new stylesheet HTTP route. Full npm lint/test/build remain unverified due to unavailable dependencies. Pixel-perfect equivalence and browser/device rendering have not been verified.

# Verification status

Recorded during project implementation on 2026-10-02.

## Executed

### Navigation and listing presentation

- Enlarged the COOHOSTY header logo and navigation labels. Desktop navigation uses the same plum color as the hero headline accent; the mobile drawer shares that color. The black/white audit button has reduced vertical padding.
- Added a realistic listing layout to both device screens, with a property title, presentation details and a review area. The five-star example is explicitly labeled as illustrative. No customer quotation, review count, occupancy figure or rating claim has been invented.
- Genuine review content can be added to `src/config/social-proof.ts` with permission and a public verification source. The list is empty until authentic reviews are supplied.
- The heading “Avec COOHOSTY, votre bien se distingue” and listing/review labels are translated into French, English and Arabic.
- Localized gallery/translation checks, Python compilation, preview JavaScript syntax and eye-animation controller checks passed. Full Next.js compilation and browser visual checks remain unverified because dependencies are unavailable.

### Header and destination-title clarity

- Enlarged the black/white header audit button to a 44 px minimum target, with readable text and increased header spacing. Long localized labels may wrap on small mobile screens.
- Removed the forced destination-title line break in both application and preview. The heading uses the full row with natural responsive wrapping and the subtitle beneath it.
- Localized preview regression checks passed. The French, English and Arabic pages and the new stylesheet returned HTTP 200; source checks confirm no forced break remains in the destination heading. Browser layout and the full Next.js build remain unverified under the restrictions below.

### Animated eye signature

- Added a larger COOHOSTY eye signature with localized headline/tagline, pointer tracking, natural blinks and a five-stage service choreography. The current stage is highlighted without announcing every automatic change to screen readers.
- The shared animation controller powers the React client component and the local preview. It includes pause/resume, reduced-motion handling, off-screen/hidden-tab suspension, bounded pupil travel and listener/timer cleanup.
- Dependency-free controller checks: `node scripts/check-eye-signature.mjs`. JavaScript syntax and Python preview checks are also available locally. Full Next.js build verification is still subject to the dependency restrictions below.

### Latest workflow-icon refresh

- Removed all decorative and action-arrow icons from the three service cards, retaining numbers and localized text links.
- Replaced the workflow icons with a local subset of Phosphor's MIT-licensed duotone artwork. Shared SVG path data is used by both the Next.js server components and the Python preview; attribution is in `docs/licenses/phosphor-icons.txt`.
- Workflow artwork is 60 px on desktop and 54 px on tablet/mobile, with 108 / 94 px frames, visible labels, RTL support and reduced-motion handling.
- Preview compilation, all-language gallery regression checks and checks for five workflow SVGs and no service-card SVGs passed. Full Next.js build/lint/tests remain unverified because the installation restrictions recorded below still apply.

### Latest photo-gallery refresh

- Replaced the apartment video and before/after controls with ten configured villa/apartment photographs, one COOHOSTY bar and synchronized laptop/phone views. Removed the video component, media configuration and caption file.
- Reduced device dimensions and pricing-card width. Pricing cards show four highlights, with the full included-service list in native expandable details (9 / 19 / 28 services).
- Added a reusable WhatsApp SVG logo to plan contact links, the footer contact link and the floating contact button.
- `python scripts/check-gallery-preview.py`: passed in French, English and Arabic, including distinct-photo count, one H1, translation parity, RTL, preserved FAQ/destinations and removal of comparison/video UI.
- Python preview compilation and `node --check public/preview-interactions.js`: passed.
- Updated Playwright coverage for photo selection/wrapping, both device views, keyboard selection, compact package details, WhatsApp targets and plan preselection. These tests have not run because dependencies are unavailable.
- Online installation failed with `EACCES`; offline installation failed with `ENOTCACHED`. `npm run lint`, `npm run build` and `npm run test` could not execute because ESLint, Prisma and Vitest are not installed. This update has **not** passed a production build.
- External photo loading and full browser visual checks remain unverified. Photos use remote Unsplash URLs because this runner blocks direct image downloads. The local preview must be restarted if it was running before the refresh.

The older entries below describe earlier revisions; their video, before/after and fictional-review UI has now been removed.

- Inspected the existing folder before adapting the static starter.
- Attempted online npm installation using a workspace-local cache. Registry access failed with network `EACCES`.
- Attempted offline installation. Required dependencies were not cached (`ENOTCACHED`).
- Attempted `npm run lint`, `npm run build`, and `npm run test`. None could execute their tools because dependencies were not installed (eslint, Prisma and Vitest missing).
- Attempted `npm run typecheck`; TypeScript was also unavailable because dependencies were not installed.
- Checked local source import targets, translation key parity and JSON structure using Python: passed.
- Executed the actual HTML escaping and CSV utility functions directly with Node.js TypeScript stripping, checking markup escaping, spreadsheet formula neutralization and Arabic Unicode: passed.
- Final offline structure check covered 97 source/test scripts, 315 matching translation keys per language and migration tables for all 8 Prisma models: passed. This is not a TypeScript compile check.

## Not verified yet

The compact city and apartment-video update passed localized structure checks, translation parity, Python compilation, preview JavaScript syntax checks and local HTTP checks for the new CSS and VTT asset. The source page and download redirect identify the Pexels clip and MP4 URL. Media is integrated in both devices without autoplay and pauses/reset on before/after switching. External video playback, visual sizing in a real browser, and the Next.js build remain unverified here.

The elegant accent update passed localized preview structure and translation checks, Python compilation, JavaScript syntax checks and HTTP checks for the accent stylesheet. Device displays now use Airbnb artwork while retaining the illustrative disclosure; stars use a gold accent, platform logos retain their colors, WhatsApp has finite entrance/ring animations with reduced-motion handling, and the FAQ uses bordered cards. Next.js compilation and browser visual checks remain unverified because dependencies are unavailable.

The listing demonstration and FAQ update passed Python compilation, preview JavaScript syntax checks, localized structural checks (one laptop, one phone, two comparison controls, eight FAQ entries and a visible illustration disclosure), translation parity and HTTP checks including the new stylesheet. Five-star review text is explicitly fictional and is not published as customer evidence or review structured data. New Playwright cases for device-screen switching and keyboard FAQ expansion have been added but could not run without dependencies. Visual rendering and the Next.js production build remain unverified.

The compact comparison update also passed the dependency-free preview checks: all three packages show 28 services, with 9 / 19 / 28 included respectively, no decorative package icons, and the compact stylesheet served successfully. Header and page sizes were reduced through responsive CSS rather than browser zoom. A Playwright comparison and plan-selection test was added but remains unexecuted while dependencies are unavailable.

The Morocco city design update passed dependency-free preview structure checks for French, English and Arabic (six city slides, six cards, three platform logos, one H1 and matching translation keys), HTTP checks for all three pages and the new assets, Python compilation, and JavaScript syntax checks. Run these local checks with `python scripts/check-city-preview.py` while `python scripts/preview.py` is running. New Playwright cases cover manual city selection and reduced motion; these have not been run because Playwright dependencies remain unavailable. The server on port 3000 is a visual preview with submission disabled, not the full Next.js backend.

TypeScript compilation, ESLint, production Next.js build, Vitest, Playwright, responsive browser rendering, database migration and insertion, admin login with a seeded account, live Cloudinary uploads, live Resend delivery and PDF font rendering have not been executed successfully in this environment.

This project must not be described as production verified until these checks pass. No external services have been configured or deployed. No real email was sent.

## Required verification on an unrestricted development machine

Follow README setup, then run:

```sh
npm install
npx prisma generate
npx prisma migrate dev
npm run db:seed
npm run lint
npm run typecheck
npm run test
npm run build
npx playwright install chromium
npm run test:e2e
```

Run database integration tests against a separate disposable database (`RUN_DATABASE_TESTS=1`). Run actual submission with configured Resend and Cloudinary, confirm both email outbox entries are sent, inspect all persisted answers, and test admin status updates, filtered CSV and PDF exports. Review Arabic shaping in exported PDFs, including mixed Arabic/Latin text. Inspect widths 375, 768, and 1440 pixels in all languages. Never use production customer data for tests.

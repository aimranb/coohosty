# Website maintenance — 8 October 2026

Applied initial-loading optimizations and fixed service selection in the estimate workflow. Photos are requested as needed; the current image stays visible while a new one loads. Automatic playback primes the next image when visible and pauses off-screen, in hidden tabs and with reduced motion. The estimate form uses CSS transitions instead of loading Framer Motion. Public pages send only client-required translation namespaces; administration sends only its own translations.

Selected AUDIT, OPTIMIZE and COHOST plans now survive navigation to the estimate page, reload, server validation/storage and WhatsApp preparation. Older requests default to AUDIT. Regression tests cover validation and storage. Obsolete browser tests now exercise the current site, and CI uses `npm ci` with the committed lockfile.

Validation: production build with TypeScript and ESLint pass; 93 unit tests pass and one database integration test is skipped. Desktop/mobile browser suite: 18 passed, two email-provider checks skipped because no sender is configured locally. Checks include French/English/Arabic, RTL, no overflow/runtime errors, service navigation, admin access protection, form validation, continuation/reload, plan selection, WhatsApp content, photo loading, motion preference changes, city controls and keyboard FAQ access.

After the final carousel continuity adjustment, the production build and lint passed again; all ten desktop/mobile carousel, hydration, city and FAQ regression checks passed. `git diff --check` passed. Temporary local production servers were stopped after verification.

Local production mobile audit (390 × 844, fresh browser contexts, reduced motion):

| Locale | Initial resource transfer before | After | Initial HTML before | After | Hero photo requests before → after |
| --- | ---: | ---: | ---: | ---: | --- |
| French | 579,830 B | 421,544 B | 269,728 B | 239,894 B | 5 → 1 |
| English | 579,827 B | 421,539 B | 240,455 B | 212,770 B | 5 → 1 |
| Arabic | 579,893 B | 421,606 B | 253,167 B | 220,324 B | 5 → 1 |

Initial resource transfer fell about 27%; HTML fell 11–13%. With normal motion, the next photo is also primed. Response/LCP timing varied under local test load and does not establish a live speed improvement. Raw results are in `maintenance-before.json` and `maintenance-after.json`.

Homepage, journal, estimate, legal/privacy, three service pages and admin login return 200 locally; an unknown journal article returns 404. No broken assets or browser runtime errors were recorded.

The maintenance changes were published to Vercel from GitHub `main` in commit `0a27970`; Vercel reported deployment success. Deployment CI exposed a city-selection failure with normal motion: pointer focus cancelled an entrance animation and moved the button between press and release. The follow-up fix preserves pointer-click geometry while still revealing content immediately for keyboard focus. City controls also wait until hydration completes. CI now tests the production build with two workers, checks PostgreSQL health using its configured role, and checks the deployed site's pages and desktop/mobile flows after Vercel completes.

The public domain intermittently times out from this local environment. Live verification now also runs from GitHub's runner. Real production database insertion, email delivery and uploads remain unverified; browser form submissions are intercepted. No customer enquiry or email was sent. Existing unrelated workspace edits were preserved.

## Previous verification — 7 October 2026

- Production build passed, including TypeScript and route generation.
- ESLint passed with zero warnings.
- Unit tests: 91 passed; one database integration test skipped without its database setup.
- Published section entrance checks passed for French desktop/mobile and Arabic mobile, including reduced motion, no overflow, and content visible without JavaScript.
- Published French journal loads successfully at https://www.coohosty.com/fr/blog and displays eight articles.
- The older `scripts/check-live-journal.cjs` assumes six articles and is stale for the published journal.

Unused, incomplete translation drafts were preserved in `journal-drafts` as text files. Their missing Arabic import previously blocked compilation. No published content was overwritten.

# Website handoff — 10 October 2026

Resumed the existing 9 October work: Marrakech service landing pages and neighbourhood guides, multilingual blog routing/content, canonical sitemap and technical SEO changes. Existing source edits were preserved.

Fixed ESLint scanning temporary build copies: `.tmp/**` and `.github/maintenance-test-results/**` are now excluded. Added current-sitemap verification instead of relying on the old 45-page inventory in the saved SEO report.

Verified the current local production build:

- Production build, TypeScript, full ESLint and `git diff --check` pass.
- Unit tests: 105 passed; one database integration test skipped.
- Desktop/mobile browser suite: 18 passed; two email-provider checks skipped because no local sender is configured.
- All 55 sitemap pages return 200 with correct language paths, production canonicals, metadata, one main H1 and parseable structured data where expected. Titles are unique. Invalid routes return 404; robots references the canonical www sitemap.
- Marrakech page at 390px and 1440px: French, English and Arabic, all four neighbourhood buttons, French guide links, RTL, no horizontal overflow or browser runtime errors pass.
- Preview initially logged sandbox image-cache write failures. Repeated Marrakech checks with approved cache access pass; all four optimized neighbourhood images return HTTP 200 with image content types.

Evidence: `current-website-verification.json`. Repeat against a running production server with `node .github/verify-current-website.cjs` and `node .github/verify-marrakech-browser.cjs`; set `VERIFY_ORIGIN` to its origin (default localhost:3140).

No deployment was performed in this session. The previous SEO audit and sitemap documentation describe an older 45-page inventory; the current crawl contains 55 pages. Real database insertion, email delivery and Search Console submission remain unverified. Browser tests intercept customer submissions.

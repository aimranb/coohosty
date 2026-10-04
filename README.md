# coohosty.com

A full-stack property audit and co-hosting platform for Morocco. French is the default language; English and Arabic have their own routes, metadata and content. Arabic uses RTL layouts. The public experience combines a concise premium marketing page with a five-step audit form. A protected admin area manages actual PostgreSQL submissions.

**Verification status:** dependency downloads were blocked by network `EACCES` in the implementation environment. Lint, build and tests were attempted but could not run without their packages. Local import and translation structure checks passed. This is implemented application source, not a production-verified deployment. See [docs/VERIFICATION.md](docs/VERIFICATION.md) for the exact outstanding checks.

## Stack and architecture

- Next.js 16 App Router, React 19, strict TypeScript and Tailwind CSS 4.
- Server-rendered marketing sections, reusable client form components and restrained Framer Motion reveals.
- next-intl, French/English/Arabic JSON translations, localized metadata and hreflang.
- React Hook Form + Zod shared validation, including server-side validation.
- PostgreSQL + Prisma 6 with committed migration and normalized request/property/photo models.
- Seeded bcrypt admin credentials; random database-backed sessions with hashed tokens, 8-hour expiry, httpOnly/SameSite cookies and secure production cookies.
- Cloudinary authenticated image storage, signed submission-bound receipts, MIME signature checks and Sharp re-encoding.
- Resend HTML transactional emails and a durable database outbox with retries.
- Protected CSV streaming exports and PDF exports with embedded Latin/Arabic fonts.
- Vitest unit/API tests, optional live database integration tests, Playwright desktop/mobile tests and GitHub Actions.

```text
src/app/[locale]/          Public landing page and legal/privacy routes
src/app/admin/             Login and protected dashboard/request routes
src/app/api/               Audit, uploads, auth, admin and scheduled email endpoints
src/components/            Layout, sections, forms, admin and UI
src/config/site.ts         Contact, pricing, brand, navigation, images and company data
src/validations/           Shared form schemas and typed choices
src/server/                Business services, auth, rate limits, exports and integrations
src/emails/                Escaped HTML email templates
src/i18n/                  Translation configuration
messages/                  fr.json, en.json, ar.json
prisma/                    Models, migration, seed
scripts/                   Password hash and abandoned-upload cleanup
tests/                     Validation, authorization, utilities, API and browser tests
public/logo/               Replaceable full and icon SVGs
```

## 1. Install

Use Node.js 22 or newer and npm. Internet access is needed for npm packages, Prisma engines and Next.js font downloads during build.

```sh
npm install
```

On Windows where PowerShell blocks `npm.ps1`, use `npm.cmd` and `npx.cmd` for the commands in this guide; no execution-policy change is needed.

Commit the generated `package-lock.json` after the first successful installation and use `npm ci` for subsequent CI/production installs. A lockfile could not be generated in the restricted environment; no lockfile was fabricated.

## 2. Environment

Copy `.env.example` to `.env`:

```sh
cp .env.example .env
```

PowerShell:

```powershell
Copy-Item .env.example .env
```

| Variable | Use |
| --- | --- |
| `DATABASE_URL` | PostgreSQL application connection, optionally pooled |
| `DIRECT_URL` | Direct/non-pooled migration connection |
| `AUTH_SECRET` | Random secret of at least 32 characters for session and receipt signing |
| `ADMIN_EMAIL` | Initial administrator email |
| `ADMIN_PASSWORD_HASH` | Generated bcrypt hash, never a plaintext password |
| `RESEND_API_KEY` | Server-only Resend API key |
| `EMAIL_FROM` | Sender on your verified domain |
| `INTERNAL_NOTIFICATION_EMAIL` | Defaults to benaissiimran08@gmail.com |
| `NEXT_PUBLIC_SITE_URL` | Canonical origin; use http://localhost:3000 locally, https://coohosty.com in production |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary product environment |
| `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | Server-side storage credentials |
| `CRON_SECRET` | Strong bearer token for scheduled email retries |
| `TURNSTILE_SECRET_KEY` | Optional Cloudflare bot verification secret |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Optional corresponding public site key |
| `TRUSTED_IP_HEADER` | Trusted reverse-proxy IP header; defaults to x-vercel-forwarded-for |

Generate random secrets with:

```sh
node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
```

Generate `AUTH_SECRET` and `CRON_SECRET` separately. Keep `.env` out of Git. Only `NEXT_PUBLIC_*` variables are public. Set both Turnstile keys together or leave both empty. Production requests enforce the configured canonical origin; set the correct `NEXT_PUBLIC_SITE_URL` for preview deployments as well.

## 3. PostgreSQL and migrations

Use Neon, Supabase Postgres, managed PostgreSQL, or a local database. Use provider-issued connection strings and TLS settings. Keep the direct connection in `DIRECT_URL`; check your provider’s pooler settings for `DATABASE_URL`.

For a local-only Docker database:

```sh
docker compose up -d db
```

The compose file binds PostgreSQL to loopback. Its default password is for local development only. The sample environment matches this local database.

```sh
npx prisma generate
npx prisma migrate dev
```

This applies the committed initial migration. For production use `migrate deploy`, never `migrate dev` or `db push`:

```sh
npm run db:migrate
```

The models store every submitted answer, timestamps, consent and version, selected locale/plan, request status and restricted image metadata. Indexes cover email, date, plan, status and property city. No demonstration customers, occupancy numbers or earnings claims are seeded.

## 4. Create the first admin

```sh
npm run password:hash
```

Enter a strong password of at least 14 characters (maximum 72 UTF-8 bytes). Interactive input is hidden. Copy the output hash into `ADMIN_PASSWORD_HASH` in `.env`, preferably surrounded with single quotes to preserve `$` characters. Set `ADMIN_EMAIL`, then run:

```sh
npm run db:seed
```

Open `/admin/login`. The seed is idempotent and updates only that administrator’s password. It also revokes that administrator’s existing sessions. Remove initial-setup environment values from hosted runtime configuration after seeding if they are no longer needed. To rotate credentials, set a newly generated hash and rerun the seed.

There is no public registration endpoint. All database users created by this seed are administrators. Admin APIs perform their own authorization; a page redirect alone is never relied on to protect data. Mutations check request origin. Session tokens are never stored in plaintext in PostgreSQL.

## 5. Development and checks

```sh
npm run dev
```

Open http://localhost:3000/fr, `/en`, or `/ar`.

```sh
npm run lint
npm run typecheck
npm run test
npm run build
npm start
```

Browser tests:

```sh
npx playwright install chromium
npm run test:e2e
```

The browser success-flow test intercepts only the audit endpoint to verify UI behavior without sending real messages. Unit/API tests check consent, enums, numbers, URLs, anti-spam, server validation, plan preselection, protected admin access, CSV injection protection, photo signatures, receipt integrity and email escaping/translations.

Run live PostgreSQL integration tests **only against a dedicated disposable test database** after applying migrations. Set test database URLs in the shell, then:

```sh
RUN_DATABASE_TESTS=1 npm run test
```

PowerShell:

```powershell
$env:RUN_DATABASE_TESTS = '1'
npm.cmd run test
Remove-Item Env:RUN_DATABASE_TESTS
```

The integration test inserts an isolated synthetic request, verifies complete persistence, both email outbox entries and concurrent duplicate protection, then removes only its own records. It does not deliver live emails.

CI runs lint, typecheck, tests, build, migrations and desktop/mobile Chromium browser tests using a disposable PostgreSQL service. Once a lockfile exists, replace its `npm install` step with `npm ci`.

## 6. Form, uploads and persistence

The form has five steps: contact, property, current situation, compliance and objectives. Plan CTAs select the matching plan before scrolling to the form. Conditional rental answers are normalized server-side; hidden stale values are not stored. Privacy consent is mandatory and is deliberately not restored from a draft.

Drafts are stored locally on the device for up to seven days and cleared after successful submission or the clear-progress action. No draft is sent until the user submits or chooses photo upload. Avoid shared devices.

Configure a Cloudinary account and populate the three storage variables. No unsigned upload preset is used. Original file selection permits 8 images of up to 5 MB in JPG, PNG or WebP format. The client re-encodes images individually to WebP and keeps transferred files below 3.9 MB, beneath [Vercel’s function payload limit](https://vercel.com/docs/functions/limitations). The server bounds the complete multipart body, checks the image signature, limits decoded pixels, strips metadata and resizes with Sharp. SVG files are rejected. Each upload uses a random filename and authenticated delivery; customers never receive a public private-photo URL.

The signed upload receipt is bound to the form’s unique submission key and expires after 24 hours. Expired photos can be uploaded again without losing the other answers. Stored images are served through authorized admin routes. Initial upload failure prevents progression until the file is retried or removed; the form remains usable without optional photos.

To inspect abandoned uploads older than 48 hours:

```sh
npm run uploads:cleanup
```

To remove only abandoned assets after review:

```sh
npm run uploads:cleanup -- --apply
```

The cleanup checks database references before deleting assets and never deletes customer request rows. Schedule it in trusted operational tooling if desired.

## 7. Transactional emails

Create a Resend account, verify your sending domain and set `RESEND_API_KEY` and `EMAIL_FROM`, for example `COOHOSTY <hello@coohosty.com>` after that sender’s domain is verified. Configure `INTERNAL_NOTIFICATION_EMAIL` for internal alerts; the supplied default is the requested Gmail address.

Submission creates the request, property, photo references and two email outbox entries in one PostgreSQL transaction. It returns success after durable persistence; email dispatch runs using Next.js `after()` and does not discard a saved request if a provider fails. The internal email contains all sections and authenticated admin/photo links. The customer receives short confirmation in their selected language.

Pending messages stay visible in the request detail page and can be retried by an administrator. `/api/cron/emails` handles scheduled retries with an `Authorization: Bearer <CRON_SECRET>` header; Vercel sends that header for configured cron jobs when `CRON_SECRET` is set. The included cron runs once daily. Use an external scheduler or an eligible Vercel schedule if more frequent retry is required. Provider idempotency keys and atomic outbox claims reduce duplicate delivery; monitor the outbox for persistently failed messages.

No mock-success email transport is used. Without an API key, messages remain queued and the admin shows them as pending. Confirm both real emails arrive before launch. Provider send acceptance is not a delivery guarantee; monitor Resend delivery/bounce logs. See [Resend domain verification](https://resend.com/docs/dashboard/domains/introduction).

## 8. Administration and exports

- `/admin`: actual database totals and recent requests.
- `/admin/requests`: search, city/plan/status filters, stable sorting and 20-row pagination.
- `/admin/requests/[id]`: every submitted answer, private photos, contact buttons, status changes, email state and activity history.
- Filtered list CSV exports stream all matching rows in bounded batches. Per-request CSV is also available.
- CSV includes a UTF-8 BOM, proper quoting and spreadsheet formula neutralization.
- PDF exports contain branding, date, contact, property, amenities, situation, authorization, objectives, comments, plan and status. Embedded Fontsource Noto fonts support Latin and Arabic content; verify mixed-script shaping on your real document examples.

Authorization happens on every page and API route. Requests never appear in a public page or an unprotected photo/export endpoint. Dashboard counts are database values, not invented analytics.

## 9. Brand, translations, SEO and legal content

Edit `src/config/site.ts` for brand/contact details, image locations, navigation, plan feature lists, configurable prices and company information. All prices default to Sur devis / On request / حسب الطلب. The SVG logo and two-eye icon can be replaced independently in `public/logo` and `src/components/ui/logo.tsx`.

Edit `messages/fr.json`, `en.json` and `ar.json` for public copy, form labels/options/errors and admin translations. Admin screens currently use French as the operational default. All public pages are localized. RTL layouts use logical spacing and direction-aware workflow arrows; reduced-motion preferences are respected.

SEO includes one page H1, canonical URLs, hreflang, localized titles/descriptions, Open Graph/Twitter cards, generated social image, sitemap, robots and ProfessionalService JSON-LD using only known brand/contact information. Admin pages are noindex. There are no fabricated testimonials, statistics, company identifiers or address claims.

Legal/privacy pages are starter content. Complete the legal entity, address, registration, retention and required disclosure fields before commercial launch, and update translated legal copy to match actual operations. Review applicable obligations and transfer arrangements with the operator, using the [CNDP website compliance guidance](https://www.cndp.ma/ar/%D9%85%D9%84%D8%A7%D8%A1%D9%85%D8%A9-%D9%85%D9%88%D8%A7%D9%82%D8%B9-%D8%A7%D9%84%D8%A7%D9%86%D8%AA%D8%B1%D9%86%D8%AA/). The repository does not assert regulatory approval. The default retention value is a policy setting; it is not an automated deletion job. Implement your approved retention procedure operationally before accepting real data.

## 10. Security and operations

Use TLS for PostgreSQL and HTTPS for production. Keep database, storage, mail and admin secrets server-only. Scope service keys to the minimum privileges supported by your provider. Configure a trusted IP header only behind a proxy that overwrites client-supplied copies; clients must not control rate-limit identity. On Vercel use the default header. Requests without a trusted client IP share a conservative limiter bucket.

Security includes server validation, origin checks, hashed credentials/tokens, expiry, private storage, database-backed rate limiting across serverless instances, honeypot, optional Turnstile, output escaping, secure response headers and safe Prisma queries. CSP allows inline scripts/styles for Next.js hydration and Cloudflare challenges; it blocks frames except Turnstile and denies framing the application. It does not claim a strict nonce-only CSP.

Monitor application logs and the email outbox. Error responses omit database/provider secrets and server stack traces. Avoid logging request payloads or personal information. Re-seeding a changed administrator revokes their sessions. Rotate `AUTH_SECRET` only when prepared to invalidate all sessions and unfinished photo receipts.

Take encrypted PostgreSQL backups with your provider’s automated backups/PITR. Test restoration into a separate environment. Back up Cloudinary originals and required metadata independently; database backups do not contain image binaries. Retention and deletion procedures must cover database, Cloudinary, email history and backups. Do not use CSV files as your only backup.

## 11. Deploy to Vercel

1. Put this project in a private Git repository, including the generated lockfile but excluding `.env`, caches and build outputs.
2. Import that repository into Vercel. Select the Next.js preset, Node.js 22 or newer and the repository root. Build command: `npm run build`.
3. Create production PostgreSQL (Neon, Supabase or standard managed PostgreSQL). Add its pooled application URL and direct migration URL as `DATABASE_URL` and `DIRECT_URL` in Vercel. Keep preview and production databases separate.
4. Configure production Cloudinary credentials. Verify authenticated uploads and protected admin delivery.
5. Configure Resend, verify the sending domain, set `RESEND_API_KEY`, `EMAIL_FROM` and internal notification address.
6. Add all required environment variables in the appropriate Vercel scopes. Set `NEXT_PUBLIC_SITE_URL=https://coohosty.com`, strong `AUTH_SECRET` and `CRON_SECRET`. Use the actual preview origin for preview deployments.
7. From trusted CI or your workstation with production database URLs, run `npx prisma migrate deploy`. Do not run migration creation against production. Generate/set the first admin hash and run `npm run db:seed` against that database.
8. Deploy and run the smoke checks: all languages, complete submission, real database row, both emails, private images, seeded admin login, status changes, filters, CSV/PDF and responsive layouts. Confirm `/api/admin/export` returns 401 without authentication.

The included `vercel.json` retries pending emails once per day. Confirm cron availability and scheduling limits for your account. Next.js fonts download at build time; ensure your build runner can reach the font source. Use licensed local images/fonts if you need entirely local build assets.

## 12. Connect coohosty.com and www

Follow [Vercel’s domain setup instructions](https://vercel.com/docs/domains/set-up-custom-domain). DNS values can vary: **use the exact names, types and values shown by Vercel and Resend at deployment time. This guide deliberately supplies no invented IP addresses or CNAME targets.**

1. In Vercel Project → Settings → Domains, add `coohosty.com`.
2. Optionally add `www.coohosty.com`.
3. At the domain registrar/DNS provider, enter the records Vercel requests for the root and optional www domain. Remove conflicting records only after identifying them; preserve mail-related records.
4. An **A** record maps a hostname to an IPv4 address. A **CNAME** maps a hostname to another hostname, commonly used for www. A **TXT** stores verification or policy text, including ownership verification, SPF or DKIM. Use your provider’s support for root/ALIAS/flattening if Vercel specifically requests it.
5. If ownership verification is requested, add Vercel’s exact TXT record. Allow DNS propagation, then use Vercel’s verification button.
6. Confirm the SSL certificate is provisioned and HTTPS works for both names. Vercel provisions SSL after successful DNS verification; do not invent certificate or DNS values.
7. Choose the root `https://coohosty.com` as the preferred canonical domain, matching `NEXT_PUBLIC_SITE_URL`. In Vercel Domains configure www to redirect to root. If you choose www instead, update the site URL and redirect root consistently. Avoid conflicting redirect rules.
8. Redeploy after changing public environment values. Check canonical and hreflang tags, `/sitemap.xml` and `/robots.txt` use the preferred domain.
9. In Resend, add the sending domain and copy its exact SPF/DKIM and any required additional verification records to the registrar. Do not create a second conflicting SPF policy for the same hostname; follow the provider’s integration instructions if other mail services already use that hostname.
10. Verify all Resend records in its dashboard before sending live mail. Configure DMARC as appropriate for your actual email setup. Preserve existing mailbox MX records; sending-domain verification does not create a Gmail or hosted mailbox.
11. Send a real test inquiry and inspect both internal and customer email delivery and authentication results.

Do not mark the release production-ready until the checks in `docs/VERIFICATION.md` and live integration smoke checks pass.
#   c o o h o s t y  
 #   c o o h o s t y  
 #   c o o h o s t y  
 #   c o o h o s t y  
 #   c o o h o s t y  
 
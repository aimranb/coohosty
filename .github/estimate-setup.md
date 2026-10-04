# Property estimate form

The hero form collects property type, exact bedroom count, Moroccan city and full address, the owner's goal, intended short-let duration, starting date, name, email, optional phone, contact method and consent. Suggestions do not restrict the city field.

## Enable email delivery

Configure these server variables in Vercel and redeploy:

- `DATABASE_URL` and `AUTH_SECRET`: required by the existing enquiry database and rate limiter. The existing Prisma schema must be installed in that database.
- `RESEND_API_KEY`: valid Resend sending key.
- `EMAIL_FROM`: a sender on your verified Resend domain.
- `INTERNAL_NOTIFICATION_EMAIL`: receiving address; defaults to `benaissiimran08@gmail.com`.
- `NEXT_PUBLIC_SITE_URL`: the actual public site origin, which is used for submission origin checks.
- `CRON_SECRET`: enables the existing scheduled outbox retry endpoint. The existing Vercel job retries daily; administrators can also retry pending email.

Email submissions are stored as `AuditRequest` records with source `hero-estimate`. All property details are in the enquiry summary; fields not collected, such as surface and bathrooms, are not invented. The summary is included in the owner's notification. The client receives a confirmation. Email failure after storage is reported as a saved enquiry with pending notification, rather than as a sent notification. No database migration is introduced.

If no email sender is configured, WhatsApp is the default and the email option is disabled. The client opens a prefilled message and presses Send in WhatsApp. Preparing a message does not claim it was delivered.

## Enable sourced income ranges

Add `PRICELABS_REVENUE_API_KEY`, a **Revenue Estimator** key (not the Customer API key), and redeploy. Official API documentation: https://developers.pricelabs.co/revenue-estimator-api/api-reference/revenue-estimator-api/revenue-estimator-version-2/get-revenue-estimate-v-2 . API entitlement and coverage must be verified on your account.

The server sends only the address (with city and Morocco) and bedroom count to PriceLabs. It requests EUR, displays the annual 25th–75th percentile revenue divided by 12, names the provider and comparable sample size, and records the retrieved timestamp in the owner notification. A minimum of 10 same-bedroom listings is required; mixed bedroom categories, invalid values and failed queries do not produce a number. It is a local market benchmark, not a promise of COOHOSTY performance or an exact Airbnb earnings database. Seasonality, available nights, costs, property type and amenities need a personal review. No arbitrary management uplift is added.

If the key or adequate data is unavailable, the final screen requests a personalised review and shows no made-up income range. The example €4,644–€5,676 is not production data.

## Verification

Unit tests cover request validation, provider response checks, no-key fallback, origin checks, rate limits, bot verification, durable notifications, idempotent submissions and escaped email content. Browser tests exercise desktop/mobile step validation, back navigation, complete payloads, email failures, WhatsApp message preparation and all three languages. Test submissions are mocked; no real emails or WhatsApp messages are sent by those tests.

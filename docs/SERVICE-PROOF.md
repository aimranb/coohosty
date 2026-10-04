# Service testimonials

The unsolicited final brand finish has been reverted: its CSS, serif-heading overrides, dark footer and new footer navigation/copy were removed. Existing arrow gallery, phone alignment, contact redesign, logo gaze and city animations remain.

The new section appears immediately before FAQ. Data is in `src/config/service-proof.json`. Only confirmed customer comments and a verified count may be added. `clientCount: null` hides the metric; both a nonnegative integer count and `countVerifiedOn` are needed to show it. Empty reviews render a translated, explicit pending message rather than invented quotes or ratings.

For each authentic testimonial, supply `name` (authorized display name), `city`, `plan`, `quote` with fr/en/ar translations and `sourceUrl` (public source if available, otherwise null). Do not change the meaning when translating. Obtain permission to publish private customer feedback. Use a confirmed client total and record its verification date. The count is clients served, not audit inquiries or property bookings. No Review or AggregateRating structured data is added.

Customer evidence has been requested from the owner. Until received, the section is prepared but no social proof is represented as verified. Local preview and syntax checks do not replace browser rendering, full Next.js build or backend checks; npm dependencies remain unavailable.

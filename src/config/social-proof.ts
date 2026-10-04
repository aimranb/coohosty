import type { Locale } from './site';

export type VerifiedReview = {
  name: string;
  rating: 1 | 2 | 3 | 4 | 5;
  text: Record<Locale, string>;
  sourceUrl: string;
};

/** Add only genuine reviews with permission and a public verification source. */
export const verifiedReviews: readonly VerifiedReview[] = [];

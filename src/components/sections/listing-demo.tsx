'use client';
import Image from 'next/image';
import { PhoneListing } from './phone-listing';
import { useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import media from '@/config/property-gallery.json';
import { site } from '@/config/site';
import { verifiedReviews } from '@/config/social-proof';
import type { Locale } from '@/config/site';

export type ListingLabels = Record<'galleryLabel' | 'previousPhoto' | 'nextPhoto' | 'selectPhoto' | 'photoCredit' | 'disclosure' | 'listingCategory' | 'villaTitle' | 'apartmentTitle' | 'listingDescription' | 'photoTag' | 'infoTag' | 'welcomeTag' | 'reviewIllustration' | 'reviewPlaceholder' | 'reviewSource', string> & { photoAlts: string[]; phone: Record<'editor' | 'space' | 'arrivalGuide' | 'photoTour' | 'tourSubtitle' | 'titleLabel' | 'entireHome' | 'location' | 'attention' | 'host' | 'hostSubtitle' | 'arrival' | 'arrivalSubtitle' | 'price' | 'priceSubtitle' | 'cta', string> };

function PropertyInfo({ labels, villa, locale }: { labels: ListingLabels; villa: boolean; locale: Locale }) {
  const review = verifiedReviews[0];
  return <div className="property-listing-info"><span className="property-listing-category">{labels.listingCategory}</span><h3>{villa ? labels.villaTitle : labels.apartmentTitle}</h3><p>{labels.listingDescription}</p><div className="property-listing-tags">{[labels.photoTag, labels.infoTag, labels.welcomeTag].map(tag => <span key={tag}>{tag}</span>)}</div><div className="property-listing-review"><div className="listing-review-stars" aria-hidden="true">{'★'.repeat(review?.rating ?? 5)}{'☆'.repeat(5 - (review?.rating ?? 5))}</div>{review ? <><span>{review.name} · {review.rating}/5</span><blockquote>{review.text[locale]}</blockquote><a href={review.sourceUrl} target="_blank" rel="noopener noreferrer">{labels.reviewSource}</a></> : <><span>{labels.reviewIllustration}</span><p>{labels.reviewPlaceholder}</p></>}</div></div>;
}

export function ListingDemo({ labels, locale }: { labels: ListingLabels; locale: Locale }) {
  const [active, setActive] = useState(0);
  const move = (direction: number) => setActive(current => (current + direction + media.photos.length) % media.photos.length);
  const photo = media.photos[active];
  const alt = labels.photoAlts[active];
  const villa = active === 0 || active === 7;
  return <div className="listing-demo property-gallery" role="region" aria-label={labels.galleryLabel}>
    <div className="cohosty-gallery-bar"><span className="gallery-brand">{site.brand}</span><span aria-live="polite" aria-atomic="true">{String(active + 1).padStart(2, '0')} / {media.photos.length}</span></div>
    <div className="device-stage">
      <div className="laptop-device"><div className="laptop-screen">
        <div className="browser-chrome" aria-hidden="true"><i/><i/><i/><span>{site.brand}</span></div>
        <div className="property-listing"><div className="gallery-device-photo"><Image src={photo.src} alt={alt} fill sizes="(max-width: 600px) 45vw, 340px"/></div><PropertyInfo labels={labels} villa={villa} locale={locale}/></div>
      </div><div className="laptop-base" aria-hidden="true"/></div>
      <div className="phone-device" aria-hidden="true"><div className="phone-island"/><PhoneListing labels={labels} src={photo.src} villa={villa} active={active} total={media.photos.length}/><div className="phone-home"/></div>
    </div>
    <div className="gallery-controls"><button type="button" onClick={() => move(-1)} aria-label={labels.previousPhoto}><ArrowLeft size={18}/></button><p>{alt}</p><button type="button" onClick={() => move(1)} aria-label={labels.nextPhoto}><ArrowRight size={18}/></button></div>

    <p className="gallery-credit">{labels.disclosure} <a href="https://unsplash.com/license" target="_blank" rel="noopener noreferrer">{labels.photoCredit}</a></p>
  </div>;
}

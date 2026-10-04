import Image from 'next/image';
import { ArrowLeft, SlidersHorizontal, Signal, Wifi, BatteryFull } from 'lucide-react';
import media from '@/config/property-gallery.json';
import type { ListingLabels } from './listing-demo';

export function PhoneListing({ labels, villa, active, total }: { labels: ListingLabels; src: string; villa: boolean; active: number; total: number }) {
  const p=labels.phone;
  return <div className="phone-editor"><div className="editor-status"><span>9:41</span><span><Signal/><Wifi/><BatteryFull/></span></div><div className="editor-toolbar"><ArrowLeft/><strong>{p.editor}</strong><SlidersHorizontal/></div><div className="editor-tabs"><span className="is-selected">{p.space}</span><span>{p.arrivalGuide}</span></div><div className="editor-card editor-tour"><h4>{p.photoTour}</h4><p>{p.tourSubtitle}</p><div className="editor-photo-stack">{[-1,1,0].map(offset => { const index=(active+offset+total)%total; return <div className={`editor-stack-photo editor-stack-${offset === 0 ? 'main' : offset === -1 ? 'left' : 'right'}`} key={offset}><Image src={media.photos[index].src} alt="" fill sizes="140px"/></div>; })}</div></div><div className="editor-card property-listing-info"><h4>{p.titleLabel}</h4><h3>{villa ? labels.villaTitle : labels.apartmentTitle}</h3></div><span className="editor-brand">COOHOSTY</span></div>;
}

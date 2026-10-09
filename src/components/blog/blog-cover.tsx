import Image from 'next/image';
import { ArrowRight, FileText, KeyRound, Check } from 'lucide-react';
import type { BlogPost } from '@/content/blog';
import styles from './blog-journal.module.css';

export function BlogCover({ post }: { post: BlogPost }) {
  const kind = post.slug;
  return <div className={styles.cover} aria-hidden="true">
    {kind === 'creer-annonce-airbnb-maroc' && <>
      <Image src="/images/hero-interior-6.webp" alt="" fill sizes="(max-width: 600px) 90vw, 30vw" className={styles.coverPhoto}/>
      <div className={styles.coverShade}/><span className={styles.coverTag}>VOTRE PREMIÈRE ANNONCE</span><div className={styles.coverPhotoCaption}><strong>Un logement.<br/>Une annonce soignée.</strong></div>
    </>}
    {['conciergerie-airbnb-casablanca', 'conciergerie-airbnb-maroc', 'choisir-societe-conciergerie-maroc', 'conciergerie-ou-gestion-autonome-airbnb-maroc'].includes(kind) && <>
      <Image src="/images/hero-interior-warm.webp" alt="" fill sizes="(max-width: 600px) 90vw, 30vw" className={styles.coverPhoto}/>
      <div className={styles.coverShade}/><span className={styles.coverTag}>GESTION LOCALE</span><div className={styles.coverPhotoCaption}><strong>{kind === 'conciergerie-airbnb-casablanca' ? 'Casablanca.' : kind === 'choisir-societe-conciergerie-maroc' ? 'Choisir son partenaire.' : kind === 'conciergerie-ou-gestion-autonome-airbnb-maroc' ? 'Organiser sa gestion.' : 'Votre logement au Maroc.'}<br/>Votre bien, accompagné.</strong></div>
    </>}
    {kind === 'fiche-de-police-airbnb-maroc' && <>
      <Image src="/images/hero-interior-warm.webp" alt="" fill sizes="(max-width: 600px) 90vw, (max-width: 1000px) 45vw, 30vw" className={styles.coverPhoto}/>
      <span className={styles.coverTag}>GUIDE PROPRIÉTAIRE</span>
      <div className={styles.coverDocument}><span className={styles.documentIcon}><FileText size={23} strokeWidth={1.4}/></span><small>ACCUEIL · MAROC</small><strong>Tout commence<br/>par un bon accueil.</strong><div className={styles.documentRule}/><span className={styles.documentField}>Identité <i/></span><span className={styles.documentField}>Séjour <i/></span><span className={styles.documentCheck}><Check size={12}/> Les bonnes démarches</span></div>
    </>}
    {kind === 'fiscalite-taxes-airbnb-maroc' && <div className={styles.taxCover}>
      <svg viewBox="0 0 600 360" className={styles.coverArt}>
        <defs><linearGradient id="blog-coins" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#ffbb7b"/><stop offset=".5" stopColor="#ff7415"/><stop offset="1" stopColor="#b94c00"/></linearGradient><pattern id="blog-ledger" width="25" height="25" patternUnits="userSpaceOnUse"><path d="M25 0 H0 V25" fill="none" stroke="#111" strokeOpacity=".035"/></pattern></defs>
        <rect width="600" height="360" fill="url(#blog-ledger)"/>
        <g transform="translate(350 65) rotate(10)"><rect width="180" height="235" rx="5" fill="#d8d0c4" opacity=".3" transform="translate(7 9)"/><rect width="180" height="235" rx="5" fill="#fffdf8" stroke="#d2c6b7"/><path d="M22 45 H158 M22 76 H158 M22 107 H158 M22 138 H158 M22 169 H158 M22 200 H158 M122 24 V213" stroke="#d8cabb"/><path d="M137 73 l4 4 9-10 M137 104 l4 4 9-10 M137 135 l4 4 9-10" fill="none" stroke="#bc5200" strokeWidth="3"/></g>
        <g fill="url(#blog-coins)" stroke="#b65112" strokeWidth="1.2"><rect x="290" y="277" width="107" height="18" rx="9"/><ellipse cx="343.5" cy="277" rx="53.5" ry="13"/><rect x="300" y="257" width="107" height="18" rx="9"/><ellipse cx="353.5" cy="257" rx="53.5" ry="13"/><rect x="288" y="237" width="107" height="18" rx="9"/><ellipse cx="341.5" cy="237" rx="53.5" ry="13"/><circle cx="449" cy="249" r="52"/><circle cx="449" cy="249" r="42" fill="none" stroke="#ffc18c" strokeWidth="2"/></g>
        <text x="449" y="259" textAnchor="middle" fill="#fff0dc" fontSize="26" fontWeight="600">MAD</text>
      </svg>
      <div className={styles.coverEditorial}><span>LES REPÈRES DU PROPRIÉTAIRE</span><strong>Fiscalité<br/>& taxes.</strong><small>Comprendre. Anticiper.</small></div>
    </div>}
    {kind === 'commission-airbnb-maroc' && <div className={styles.commissionCover}>
      <span className={styles.coverTag}>EXEMPLE EN DIRHAMS</span>
      <div className={styles.receipt}><small>Réservation</small><strong>3 000<span>MAD</span></strong><div className={styles.receiptLines}><i/><i/><i/></div><span className={styles.receiptFoot}>Avant frais hôte</span></div>
      <ArrowRight className={styles.receiptArrow} size={34} strokeWidth={1.5}/>
      <div className={`${styles.receipt} ${styles.receiptNet}`}><small>Versement</small><strong>2 535<span>MAD</span></strong><div className={styles.receiptLines}><i/><i/><i/></div><span className={styles.receiptFoot}>Hypothèse : frais de 15,5 %</span></div>
    </div>}
    {kind === 'sous-location-airbnb-maroc' && <>
      <Image src="/images/hero-interior-6.webp" alt="" fill sizes="(max-width: 600px) 90vw, (max-width: 1000px) 45vw, 30vw" className={styles.coverPhoto}/>
      <div className={styles.coverShade}/><span className={styles.coverTag}>BAIL & ACCORD DU PROPRIÉTAIRE</span>
      <div className={styles.keyBadge}><KeyRound size={48} strokeWidth={1.25}/></div><div className={styles.coverPhotoCaption}><strong>Les clés<br/>d’un projet bien préparé.</strong></div>
    </>}
    {kind === 'airbnb-maroc-definition' && <>
      <Image src="/images/hero-interior-4.webp" alt="" fill sizes="(max-width: 600px) 90vw, (max-width: 1000px) 45vw, 30vw" className={styles.coverPhoto}/>
      <div className={styles.coverShade}/><span className={styles.coverTag}>VOTRE PREMIÈRE LOCATION</span><div className={styles.coverPhotoCaption}><span>DE L’ANNONCE À L’ACCUEIL</span><strong>Votre logement.<br/>De nouvelles possibilités.</strong></div>
    </>}
    {kind === 'conciergerie-airbnb-marrakech' && <div className={styles.marrakechCover}>
      <svg viewBox="0 0 600 360" className={styles.coverArt}>
        <defs><linearGradient id="blog-riad-sky" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#ffefd8"/><stop offset="1" stopColor="#f6c394"/></linearGradient></defs>
        <rect width="600" height="360" fill="#f1e9de"/><path d="M110 360 V159 Q110 30 300 8 Q490 30 490 159 V360 Z" fill="url(#blog-riad-sky)"/>
        <circle cx="342" cy="101" r="36" fill="#ff7415"/>
        <path d="M110 249 L153 218 L194 240 L252 208 L313 232 L376 213 L490 254 V360 H110 Z" fill="#cd9f7c"/>
        <path d="M110 283 H195 V236 H268 V267 H368 V224 H435 V286 H490 V360 H110 Z" fill="#b67852"/>
        <path d="M194 360 V291 Q194 267 218 267 Q242 267 242 291 V360 M334 360 V279 Q334 253 360 253 Q386 253 386 279 V360" fill="#73462f"/>
        <path d="M129 360 V169 Q129 58 300 31 Q471 58 471 169 V360" fill="none" stroke="#fffcf6" strokeWidth="9"/>
        <g fill="none" stroke="#57402d" strokeWidth="4" strokeLinecap="round"><path d="M437 330 Q424 220 430 138"/><path d="M430 138 Q386 112 376 143 M430 138 Q459 107 484 133 M430 138 Q403 91 387 97 M430 138 Q452 87 470 93 M430 138 Q397 140 383 167 M430 138 Q461 140 473 167"/></g>
        <path d="M0 343 H600 V360 H0 Z" fill="#e3d1bc"/>
      </svg>
      <span className={styles.coverTag}>UNE GESTION AU PLUS PRÈS DU BIEN</span><span className={styles.marrakechLabel}>MARRAKECH</span>
    </div>}
  </div>;
}

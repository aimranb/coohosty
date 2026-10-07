import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import styles from './blog.module.css';

export function BlogCta() {
  return <aside className={styles.cta} aria-label="Accompagnement COOHOSTY">
    <h2>Un projet de location au Maroc ?</h2>
    <p>Présentez-nous votre logement et les tâches que vous souhaitez déléguer. Nous pourrons discuter de l’accompagnement adapté à votre projet.</p>
    <div className={styles.ctaActions}>
      <Link href="/fr#estimate">Parler de mon logement <ArrowUpRight size={18} aria-hidden="true"/></Link>
      <Link href="/fr/services/cohost">Découvrir COHOST <ArrowUpRight size={18} aria-hidden="true"/></Link>
    </div>
  </aside>;
}

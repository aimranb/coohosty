import type { Locale } from '@/config/site';
import { getBlogPosts, type BlogPost } from './blog';

export const blogPathways = [
  { id: 'projet-location', title: 'Préparez votre location et son budget', description: 'Le guide de départ, les coûts et la comparaison des modèles de location.', pillar: 'location-courte-duree-maroc', slugs: ['location-courte-duree-maroc', 'rentabilite-location-courte-duree-maroc', 'location-courte-ou-longue-duree-maroc', 'couts-location-courte-duree-maroc', 'prix-location-courte-duree-maroc'] },
  { id: 'gestion-location', title: 'Organisez votre gestion, même à distance', description: 'Réservations, plateformes, responsabilités et choix de votre accompagnement.', pillar: 'conciergerie-airbnb-maroc', slugs: ['conciergerie-airbnb-maroc', 'gerer-location-courte-duree-distance-maroc', 'gestion-location-courte-duree-maroc', 'airbnb-booking-vrbo-location-courte-duree', 'prix-conciergerie-airbnb-maroc', 'cohosting-ou-conciergerie-airbnb-maroc', 'conciergerie-ou-gestion-autonome-airbnb-maroc', 'choisir-societe-conciergerie-maroc'] },
  { id: 'logement-ville', title: 'Étudiez votre logement dans sa ville', description: 'Des guides pour votre bien et votre quartier, avec un périmètre de services clair.', pillar: 'location-courte-duree-maroc', slugs: ['conciergerie-airbnb-meknes', 'location-courte-duree-casablanca', 'location-courte-duree-marrakech', 'conciergerie-airbnb-casablanca', 'conciergerie-airbnb-marrakech', 'location-courte-duree-gueliz-marrakech', 'location-courte-duree-hivernage-marrakech', 'location-courte-duree-medina-marrakech', 'location-courte-duree-palmeraie-marrakech'] },
  { id: 'demarches-annonce', title: 'Préparez vos démarches et votre annonce', description: 'Les références et les questions à vérifier pour démarrer votre projet.', pillar: 'location-courte-duree-maroc', slugs: ['fiche-de-police-airbnb-maroc', 'fiscalite-taxes-airbnb-maroc', 'commission-airbnb-maroc', 'sous-location-airbnb-maroc', 'airbnb-maroc-definition', 'creer-annonce-airbnb-maroc'] },
] as const;

export function blogPathway(post: BlogPost) {
  return blogPathways.find(pathway => (pathway.slugs as readonly string[]).includes(post.slug));
}

export function featuredBlogPosts(locale: Locale): BlogPost[] {
  const posts = getBlogPosts(locale);
  if (locale !== 'fr') return posts.slice(0, 3);
  return ['location-courte-duree-maroc', 'gerer-location-courte-duree-distance-maroc', 'conciergerie-airbnb-meknes'].flatMap(slug => posts.filter(post => post.slug === slug));
}

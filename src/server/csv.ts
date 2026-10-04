import 'server-only';
import { csvCell } from '@/lib/escape';
import type { FullRequest } from '@/lib/request-data';
import { site } from '@/config/site';
export const csvHeaders = ['ID', 'Date', 'Mise à jour', 'Nom', 'Téléphone', 'Email', 'Pays', 'Offre', 'Statut', 'Langue', 'Source', 'Ville', 'Quartier', 'Type', 'Surface m²', 'Chambres', 'Lits', 'Salles de bain', 'Capacité', 'Équipements', 'Finition', 'Location courte durée', 'URL annonce', 'Plateformes', 'Prix nuit MAD', 'Occupation %', 'Note /10', 'Gestion', 'Situation du bien', 'Autorisation', 'Objectif', 'Disponibilité', 'Commentaire', 'Consentement', 'Date consentement', 'Version consentement', 'Photos (accès admin)'];
export function csvRow(request: FullRequest) {
  const p = request.property;
  return [request.id, request.createdAt.toISOString(), request.updatedAt.toISOString(), request.fullName, request.phone, request.email, request.country, request.plan, request.status, request.locale, request.source, p?.city, p?.neighborhood, p?.type, p?.surface, p?.bedrooms, p?.beds, p?.bathrooms, p?.capacity, p?.amenities, p?.finish, p?.isRental, p?.listingUrl, p?.platforms, p?.nightlyRate, p?.occupancy, p?.rating, p?.management, p?.propertyStatus, request.authorization, request.objective, request.availability, request.comments, request.consent, request.consentAt.toISOString(), request.consentVersion, p?.photos.map(photo => `${site.url}/api/admin/photos/${photo.id}`)].map(csvCell).join(',') + '\r\n';
}

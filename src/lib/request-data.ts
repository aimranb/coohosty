import type { Prisma } from '@prisma/client';
import fr from '../../messages/fr.json';
export type FullRequest = Prisma.AuditRequestGetPayload<{ include: { property: { include: { photos: true } } } }>;
export type DataSection = { title: string; rows: { label: string; value: string }[] };
const labels = fr.form.fields as Record<string, string>;
const options = fr.form.options as Record<string, string>;
export const statusLabels = { NEW: 'Nouvelle', IN_PROGRESS: 'En cours', AUDIT_SENT: 'Audit envoyé' };
export function displayValue(value: unknown): string {
  if (value === null || value === undefined || value === '') return '—';
  if (typeof value === 'boolean') return value ? 'Oui' : 'Non';
  if (Array.isArray(value)) return value.map(item => options[String(item)] || String(item)).join(', ') || '—';
  return options[String(value)] || String(value);
}
export function requestSections(request: FullRequest): DataSection[] {
  const property = request.property;
  const rows = (source: object, keys: string[]) => keys.map(key => ({ label: labels[key] || key, value: displayValue((source as Record<string, unknown>)[key]) }));
  return [
    { title: 'Contact', rows: rows(request, ['fullName', 'phone', 'email', 'country', 'plan']) },
    { title: 'Bien', rows: property ? rows(property, ['city', 'neighborhood', 'type', 'surface', 'bedrooms', 'beds', 'bathrooms', 'capacity', 'finish']) : [] },
    { title: 'Équipements', rows: property ? rows(property, ['amenities']) : [] },
    { title: 'Situation actuelle', rows: property ? rows(property, ['isRental', ...(property.isRental ? ['listingUrl', 'platforms', 'nightlyRate', 'occupancy', 'rating', 'management'] : ['propertyStatus'])]) : [] },
    { title: 'Conformité', rows: rows(request, ['authorization']) },
    { title: 'Objectifs', rows: rows(request, ['objective', 'availability', 'comments']) },
    { title: 'Demande', rows: [{ label: 'Date', value: request.createdAt.toISOString() }, { label: 'Statut', value: statusLabels[request.status] }, { label: 'Langue', value: request.locale }, { label: 'Source', value: request.source }, { label: 'Consentement', value: `${request.consent ? 'Oui' : 'Non'} · ${request.consentAt.toISOString()} · ${request.consentVersion}` }] }
  ];
}

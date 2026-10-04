import { site } from '@/config/site';
import { escapeHtml } from '@/lib/escape';
import { requestSections, type FullRequest } from '@/lib/request-data';
import fr from '../../messages/fr.json';
import en from '../../messages/en.json';
import ar from '../../messages/ar.json';
const copy = { fr, en, ar };
function frame(content: string, locale: 'fr' | 'en' | 'ar' = 'fr') {
  return `<!doctype html><html lang="${locale}" dir="${locale === 'ar' ? 'rtl' : 'ltr'}"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="margin:0;background:#f7f5fc;font-family:Arial,sans-serif;color:#252333"><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td style="padding:32px 12px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:620px;margin:auto;background:#fff;border-radius:12px"><tr><td style="padding:32px"><h1 style="font-family:Georgia,serif;font-size:25px;letter-spacing:3px;color:#252333">COOHOSTY</h1>${content}<hr style="border:0;border-top:1px solid #ede9fe;margin:28px 0"><p style="font-size:12px;color:#73717f;line-height:1.8"><a href="tel:${site.tel}" style="color:#8b5cf6">${site.phone}</a><br><a href="${site.whatsapp}" style="color:#8b5cf6">WhatsApp</a><br><a href="mailto:${site.email}" style="color:#8b5cf6">${site.email}</a></p></td></tr></table></td></tr></table></body></html>`;
}
export function customerEmail(request: FullRequest) {
  const locale = request.locale === 'en' || request.locale === 'ar' ? request.locale : 'fr';
  const t = copy[locale].form;
  return { subject: `COOHOSTY — ${t.success}`, html: frame(`<p style="font-size:15px">${escapeHtml(request.fullName)},</p><h2 style="font-size:22px;font-weight:500">${escapeHtml(t.success)}</h2><p style="font-size:14px;line-height:1.8;color:#73717f">${escapeHtml(t.successText)}</p>`, locale) };
}
export function internalEmail(request: FullRequest) {
  const sections = requestSections(request);
  const html = sections.map(section => `<h2 style="font-size:16px;color:#8b5cf6;margin-top:25px">${escapeHtml(section.title)}</h2><table width="100%" cellpadding="0" cellspacing="0">${section.rows.map(row => `<tr><td style="width:40%;padding:8px 0;border-bottom:1px solid #f0ecf6;font-size:12px;color:#73717f;vertical-align:top">${escapeHtml(row.label)}</td><td style="padding:8px;border-bottom:1px solid #f0ecf6;font-size:12px;word-break:break-word;white-space:pre-wrap">${escapeHtml(row.value)}</td></tr>`).join('')}</table>`).join('');
  const photoLinks = request.property?.photos.map((photo, i) => `<li><a href="${site.url}/admin/requests/${request.id}#photos">Photo ${i + 1} — accès administrateur</a></li>`).join('') || '<li>Aucune photo</li>';
  return { subject: `New COOHOSTY Audit Request — ${request.property?.city || '—'} — ${request.plan}`, html: frame(`<h2 style="font-size:22px">Nouvelle demande d’audit</h2>${html}<h2 style="font-size:16px;color:#8b5cf6">Photos</h2><ul style="font-size:12px;line-height:2">${photoLinks}</ul><p><a href="${site.url}/admin/requests/${request.id}" style="color:#8b5cf6">Ouvrir la demande dans l’administration →</a></p>`) };
}

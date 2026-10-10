import { site, locales, type Locale } from '@/config/site';

export function organizationStructuredData() {
  return {
    '@type': site.company.address ? 'ProfessionalService' : 'Organization',
    '@id': `${site.url}/#organization`,
    name: site.brand,
    ...(site.company.legalName ? { legalName: site.company.legalName } : {}),
    url: site.url,
    logo: { '@type': 'ImageObject', url: `${site.url}/logo/icon.svg` },
    telephone: site.tel,
    email: site.email,
    areaServed: { '@type': 'Country', name: 'Morocco' },
    ...(site.company.address ? { address: { '@type': 'PostalAddress', streetAddress: site.company.address, addressCountry: 'MA' } } : {}),
    ...(Object.values(site.social).some(Boolean) ? { sameAs: Object.values(site.social).filter(url => /^https:\/\//.test(url)) } : {}),
  };
}

export function homeStructuredData(locale: Locale) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      organizationStructuredData(),
      { '@type': 'WebSite', '@id': `${site.url}/#website`, url: site.url, name: site.brand, inLanguage: locales, publisher: { '@id': `${site.url}/#organization` } },
      { '@type': 'WebPage', '@id': `${site.url}/${locale}#webpage`, url: `${site.url}/${locale}`, name: site.brand, inLanguage: locale, isPartOf: { '@id': `${site.url}/#website` }, about: { '@id': `${site.url}/#organization` } },
    ],
  };
}

export function serviceStructuredData(locale: Locale, slug: string, name: string, description: string) {
  const url = `${site.url}/${locale}/services/${slug}`;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      organizationStructuredData(),
      { '@type': 'Service', '@id': `${url}#service`, url, name, description, serviceType: name, provider: { '@id': `${site.url}/#organization` }, areaServed: { '@type': 'Country', name: 'Morocco' } },
      { '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: { fr: 'Accueil', en: 'Home', ar: 'الرئيسية' }[locale], item: `${site.url}/${locale}` },
        { '@type': 'ListItem', position: 2, name, item: url },
      ] },
    ],
  };
}

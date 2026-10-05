from pathlib import Path

staging = Path(__file__).resolve().parent
root = staging.parent
page = root / 'src/app/[locale]/services/[plan]/page.tsx'
page.parent.mkdir(parents=True, exist_ok=True)
page.write_text((staging / 'service-detail-page.tsx').read_text(encoding='utf-8'), encoding='utf-8')
(root / 'src/app/service-detail.css').write_text((staging / 'service-detail.css').read_text(encoding='utf-8'), encoding='utf-8')
layout = root / 'src/app/layout.tsx'
s = layout.read_text(encoding='utf-8')
if "import './service-detail.css';" not in s:
    s = s.replace("import './analysis-emphasis.css';", "import './analysis-emphasis.css';\nimport './service-detail.css';")
layout.write_text(s, encoding='utf-8')
plans = root / 'src/components/sections/plans.tsx'
s = plans.read_text(encoding='utf-8')
if "import Link from 'next/link';" not in s:
    s = "import Link from 'next/link';\n" + s
if '  const seeMore =' not in s:
    s = s.replace("  const heading = await getTranslations('services');", "  const heading = await getTranslations('services');\n  const seeMore = { en: 'See more', fr: 'Voir plus', ar: 'عرض المزيد' }[locale];")
if 'className="button plan-more-link"' not in s:
    s = s.replace('      <a className="plan-whatsapp"', '      <Link href={`/${locale}/services/${plan.id.toLowerCase()}`} className="button plan-more-link">{seeMore}<ArrowUpRight size={16}/></Link><a className="plan-whatsapp"')
plans.write_text(s, encoding='utf-8')
print('Added localized See more links, complete service detail pages, and enquiry form links.')

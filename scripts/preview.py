"""Dependency-free visual preview; does not replace the Next.js application."""
import json
import html
import pathlib
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from preview_sections import extra_sections
from service_proof_preview import service_proof

ROOT = pathlib.Path(__file__).resolve().parent.parent

def page(locale):
    m = json.loads((ROOT / 'messages' / f'{locale}.json').read_text(encoding='utf-8'))
    esc = html.escape
    logo = (ROOT / 'public/logo/full.svg').read_text(encoding='utf-8')
    eyes = (ROOT / 'public/logo/icon.svg').read_text(encoding='utf-8')
    def button(text, target, outline=False, compact=False):
        return f'<a class="button {"button-outline" if outline else ""} {"header-button" if compact else ""}" href="{target}">{esc(text)} <span>↗</span></a>'
    nav = ''.join(f'<a href="#{key}">{esc(m["nav"][key])}</a>' for key in ['services','revenue','plans','contact'])
    languages = '<select id="preview-language" class="language-select" aria-label="' + esc(m['nav']['language']) + '">' + ''.join(f'<option value="/{key}" {"selected" if key == locale else ""}>{key.upper()}</option>' for key in ['fr','en','ar']) + '</select>'
    h = m['hero']
    s = m['services']
    services = ''.join(f'<article class="service-card"><div class="service-top"><span>0{i+1}</span></div><h3>{plan}</h3><p>{esc(s[plan])}</p><a class="service-link" href="#contact" aria-label="{esc(s["cta"])} — {plan}">{esc(s["cta"])}</a></article>' for i,plan in enumerate(['AUDIT','OPTIMIZE','COHOST']))
    w = m['workflow']
    icon_artwork = json.loads((ROOT / 'src/config/phosphor-workflow.json').read_text(encoding='utf-8'))['icons']
    def premium_icon(name):
        asset = icon_artwork[name]
        return f'<svg class="premium-workflow-icon" width="60" height="60" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true" focusable="false"><path class="premium-icon-tone" d="{esc(asset["background"])}"></path><path d="{esc(asset["foreground"])}"></path></svg>'
    workflow = ''.join(f'<li data-signature-label="{esc(w[key])}"><div class="workflow-icon">{premium_icon(icon)}</div><span>{esc(w[key])}</span>{"<span class=workflow-arrow aria-hidden=true>→</span>" if i<4 else ""}</li>' for i,(key,icon) in enumerate([('listing','house'),('pricing','coins'),('guests','guests'),('calendar','calendar'),('revenue','revenue')]))
    r = m['revenue']
    revenue = ''.join(f'<div class="revenue-feature"><span style="color:#111111;font-size:25px">{icon}</span><h3>{esc(r[key])}</h3></div>' for key,icon in [('dynamic','↗'),('monitoring','◎'),('market','▥'),('calendar','▦'),('minimum','◷'),('report','▤')])
    p = m['plans']
    comparison = json.loads((ROOT / 'src/config/service-comparison.json').read_text(encoding='utf-8'))
    order = ['AUDIT','OPTIMIZE','COHOST']
    highlights = [['listing','competitors','pricing','action'],['dynamic','pricelabs','calendar','report'],['communication','bookings','checkin','review']]
    whatsapp_svg = '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M20.5 3.5A11.9 11.9 0 0 0 12.05 0C5.46 0 .1 5.36.1 11.95c0 2.11.55 4.17 1.59 5.99L0 24l6.22-1.63a11.94 11.94 0 0 0 5.83 1.49h.01C18.64 23.86 24 18.5 24 11.91c0-3.19-1.24-6.19-3.5-8.41Zm-8.44 18.34a9.9 9.9 0 0 1-5.05-1.38l-.36-.21-3.69.97.98-3.6-.24-.37a9.91 9.91 0 0 1-1.52-5.3c0-5.48 4.46-9.94 9.94-9.94 2.66 0 5.15 1.04 7.03 2.92a9.87 9.87 0 0 1 2.91 7.03c0 5.47-4.46 9.93-10 9.93Zm5.45-7.44c-.3-.15-1.77-.87-2.05-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.18-.3-.02-.46.13-.6.14-.14.3-.35.45-.53.15-.17.2-.3.3-.5.1-.19.05-.37-.03-.52-.07-.15-.67-1.61-.92-2.21-.24-.58-.48-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.21 5.1 4.5.71.31 1.27.49 1.7.63.71.22 1.35.19 1.86.12.56-.08 1.77-.72 2.02-1.41.25-.7.25-1.29.18-1.42-.08-.12-.28-.2-.58-.35Z"/></svg>'
    plan_cards = ''
    for i,plan in enumerate(order):
        scope = ''
        for group in comparison:
            if i < order.index(group['availableFrom']):
                continue
            rows = ''.join(f'<li class="comparison-row is-included"><span aria-hidden="true">✓</span><span>{esc(p["features"][feature])}</span><span class="sr-only"> — {esc(p["included"])}</span></li>' for feature in group['features'])
            scope += f'<section class="comparison-group"><h4>{esc(p["groups"][group["id"]])}</h4><ul>{rows}</ul></section>'
        brief = ''.join(f'<li><span aria-hidden="true">✓</span><span>{esc(p["features"][feature])}</span></li>' for feature in highlights[i])
        prices = {'fr':'Sur devis','en':'On request','ar':'حسب الطلب'}
        plan_cards += f'<div class="package-reveal"><article class="plan-card comparison-card {"featured" if i==2 else ""}"><div class="plan-label"><span class="package-number">{esc(p["label"])} 0{i+1}</span></div><h3>{plan}</h3><p class="plan-subtitle">{esc(p[plan]["subtitle"])}</p><p class="package-outcome">{esc(p[plan]["outcome"])}</p><div class="package-price-row"><div class="plan-price">{prices[locale]}</div><span class="package-cadence">{esc(p[plan]["cadence"])}</span></div><a class="button package-cta" href="#contact">{esc(p[plan]["cta"])} <span>↗</span></a><ul class="plan-highlights">{brief}</ul><details class="plan-details"><summary>{esc(p["details"])}</summary><div class="comparison-services">{scope}</div></details><a class="plan-whatsapp" href="https://wa.me/212663448785" target="_blank" rel="noopener noreferrer">{whatsapp_svg}{esc(p["whatsapp"])}</a></article></div>'
    f = m['form']
    fields = ''.join(f'<div class="field {"field-full" if key == "fullName" else ""}"><label for="{key}">{esc(f["fields"][key])}</label><input id="{key}" type="{kind}" placeholder="{esc(f["fields"][key])}"></div>' for key,kind in [('fullName','text'),('phone','tel'),('email','email'),('country','text')])
    options = ''.join(f'<option>{esc(f["options"][plan])}</option>' for plan in ['UNDECIDED','AUDIT','OPTIMIZE','COHOST'])
    footer = m['footer']
    document = f'''<!doctype html><html lang="{locale}" dir="{'rtl' if locale == 'ar' else 'ltr'}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>COOHOSTY — coohosty.com</title><link rel="icon" href="/logo/favicon.svg"><link rel="stylesheet" href="/styles.css"><link rel="stylesheet" href="/home-polish.css"><link rel="stylesheet" href="/destinations.css"><link rel="stylesheet" href="/monochrome.css"><script src="/preview-interactions.js" defer></script><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet"><style>body{{--font-poppins:Inter}}.hero-photo img{{position:absolute;width:100%;height:100%;object-fit:cover}}</style></head><body id="top">
    <header class="site-header"><div class="header-inner"><a class="logo" href="/{locale}">{logo}</a><nav class="desktop-nav">{nav}</nav><div class="header-actions">{languages}{button(m['nav']['audit'],'#contact',compact=True)}<button class="mobile-toggle" id="preview-menu-toggle" type="button" aria-expanded="false" aria-controls="preview-mobile-menu" aria-label="{esc(m['nav']['menu'])}">&#9776;</button></div></div><nav id="preview-mobile-menu" class="mobile-menu" hidden aria-label="{esc(m['nav']['menu'])}">{nav}</nav></header>
    <main><section class="hero container"><div class="hero-copy"><h1>{esc(h['title'])}<br>{esc(h['title2'])}<br><em>{esc(h['title3'])}</em></h1><p>{esc(h['subtitle'])}</p><div class="hero-buttons">{button(h['primary'],'#contact')}{button(h['secondary'],'#plans',True)}</div><div class="hero-note">{eyes}<div><strong>{esc(h['tag'])}</strong><span>{esc(h['location'])}</span></div></div></div><div class="hero-photo"><img src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1400&q=85" alt="{esc(h['imageAlt'])}"><div class="hero-photo-label">✧ {esc(h['caption'])}</div><div class="hero-photo-bottom"><span>{esc(h['collection'])}</span><span>{esc(h['photoLocation'])}</span></div></div><a class="hero-scroll" href="#services">↓ {esc(h['scroll'])}</a></section>
    <section id="services" class="section container"><div class="section-heading"><div class="eyebrow">{esc(s['eyebrow'])}</div><h2>{esc(s['title'])}<br><em>{esc(s['accent'])}</em></h2></div><div class="service-grid">{services}</div></section>
    <section class="workflow section"><div class="container"><div class="section-heading centered"><div class="eyebrow">{esc(w['eyebrow'])}</div><h2>{esc(w['title'])}</h2></div><div class="watching">{eyes}<span>{esc(w['watching'])}</span></div><ol class="workflow-steps">{workflow}</ol><p class="method">{esc(w['method'])}</p></div></section>
    <section id="revenue" class="section container"><div class="revenue-layout"><div><div class="eyebrow">{esc(r['eyebrow'])}</div><h2>{esc(r['title'])}<br><em>{esc(r['accent'])}</em></h2><p class="section-description">{esc(r['sentence'])}</p><div class="tool-chip"><span class="dot"></span>PriceLabs ↗</div></div><div class="revenue-grid">{revenue}</div></div></section>
    <section id="plans" class="section plans-section"><div class="container"><div class="section-heading centered"><div class="eyebrow">{esc(p['eyebrow'])}</div><h2>{esc(p['title'])}<br><em>{esc(p['accent'])}</em></h2><p class="packages-intro">{esc(p['comparison'])}</p></div><div class="plan-grid">{plan_cards}</div><p class="packages-note">{esc(p['scopeNote'])}</p><a class="package-help" href="#contact">{esc(p['help'])} ↗</a></div></section>
    <section id="contact" class="audit-section"><div class="container audit-layout"><div class="audit-intro"><div class="eyebrow">{esc(f['eyebrow'])}</div><h2>{esc(f['title'])}</h2><p>{esc(f['subtitle'])}</p><ul class="audit-comfort"><li>{esc(f["comfort"]["simple"])}</li><li>{esc(f["comfort"]["tailored"])}</li><li>{esc(f["comfort"]["direct"])}</li></ul><div class="audit-contacts"><a href="tel:+212663448785">+212 663 448 785</a><a href="mailto:benaissiimran08@gmail.com">benaissiimran08@gmail.com</a><a href="https://wa.me/212663448785" target="_blank" rel="noopener noreferrer">{whatsapp_svg}{esc(f["comfort"]["whatsapp"])}</a></div></div><div class="audit-shell"><div class="progress-header"><span>{esc(f['step'])} 1 {esc(f['of'])} 5</span><span>{esc(f['steps']['contact'])}</span></div><div class="progress-bars"><span class="active"></span><span></span><span></span><span></span><span></span></div><ol class="audit-step-labels"><li class="is-current" aria-current="step">{esc(f["steps"]["contact"])}</li><li>{esc(f["steps"]["property"])}</li><li>{esc(f["steps"]["situation"])}</li><li>{esc(f["steps"]["compliance"])}</li><li>{esc(f["steps"]["objectives"])}</li></ol><h3>{esc(f['steps']['contact'])}</h3><p class="audit-step-help">{esc(f["comfort"]["help"]["contact"])}</p><div class="form-grid">{fields}<div class="field"><label for="plan">{esc(f['fields']['plan'])}</label><select id="plan">{options}</select></div></div><div class="form-actions"><button class="button" disabled>{esc(f['next'])} →</button></div></div></div></section>
    <p class="brand-disclaimer container">{esc(r['disclaimer'])}</p></main><footer class="footer container"><div class="footer-main"><div><a class="logo" href="/{locale}">{logo}</a><p>{esc(footer['description'])}</p></div><div class="footer-contact"><h3>{esc(footer['contact'])}</h3><a href="tel:+212663448785">+212 663 448 785</a><a href="mailto:benaissiimran08@gmail.com">benaissiimran08@gmail.com</a><a href="https://wa.me/212663448785">{whatsapp_svg}WhatsApp ↗</a></div></div><div class="footer-bottom"><span>© 2026 COOHOSTY</span><a href="#top">{esc(footer['back'])} ↑</a></div></footer><a class="floating-whatsapp" href="https://wa.me/212663448785" aria-label="WhatsApp">{whatsapp_svg}</a></body></html>'''

    data = json.loads((ROOT / 'src/config/destinations.json').read_text(encoding='utf-8'))
    d = m['destinations']
    slides, selectors, cards, credits, captions = '', '', '', '', ''
    for index, city in enumerate(data['cities']):
        name, detail = d['cities'][city['id']]['name'], d['cities'][city['id']]['detail']
        image = city['image']
        if 'images.pexels.com' in image:
            candidates = ', '.join(f'{image.replace("w=3840", "w=" + str(width))} {width}w' for width in [640,1080,1920,2560,3840])
            responsive = f'srcset="{esc(candidates)}" sizes="(max-width:760px) 90vw,50vw"'
            preview_image = image.replace('w=3840','w=1400')
        else:
            responsive, preview_image = '', image
        slides += f'<div class="city-slide {"is-active" if index == 0 else ""}" aria-hidden="{str(index != 0).lower()}" data-name="{esc(name)}" data-detail="{esc(detail)}"><img src="{esc(preview_image)}" {responsive} alt="{esc(name)} — {esc(detail)}" loading="{"eager" if index == 0 else "lazy"}" decoding="async"></div>'
        selectors += f'<button class="{"is-active" if index == 0 else ""}" type="button" aria-label="{esc(name)}" aria-pressed="{str(index == 0).lower()}"><span class="sr-only">{esc(name)}</span></button>'
        cards += f'<a class="destination-card" href="#contact"><img src="{esc(image.replace("w=3840","w=1080"))}" alt="{esc(name)} — {esc(detail)}" loading="lazy" decoding="async" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover"><div class="destination-shade"></div><span class="destination-index">0{index+1}</span><div class="destination-label"><div><h3>{esc(name)}</h3><p>{esc(detail)}</p></div><span aria-hidden="true">↗</span></div></a>'
        captions += f'<div class="city-caption {"is-active" if index == 0 else ""}" aria-hidden="{str(index != 0).lower()}"><h2>{esc(name)}</h2><p>{esc(detail)}</p></div>'
        author = city.get('author', 'Pexels')
        license_link = ' · <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noreferrer">CC BY-SA 4.0</a>' if city['id'] == 'meknes' else ''
        credits += f'<li><a href="{esc(city["source"])}" target="_blank" rel="noreferrer">{esc(name)} — {author}</a>{license_link}</li>'
    first = d['cities'][data['cities'][0]['id']]
    carousel = f'<div class="hero-photo city-carousel" role="region" aria-roledescription="carousel" aria-label="{esc(d["label"])}">{slides}<div class="city-shade"></div><div class="hero-photo-label">✧ {esc(d["caption"])}</div><button class="city-pause" type="button" aria-label="{esc(d["pause"])}" aria-pressed="false" data-pause="{esc(d["pause"])}" data-play="{esc(d["play"])}">Ⅱ</button><div class="city-overlay"><span class="city-kicker">{esc(d["label"])}</span><div class="city-caption-stack">{captions}</div><div class="city-selectors">{selectors}</div></div><span class="city-count" aria-hidden="true">01 / 06</span></div>'
    platforms = ''.join(f'<div class="platform-logo"><img src="{esc(platform["image"])}" alt="{esc(platform["name"])}" width="180" height="56" loading="lazy"></div>' for platform in data['platforms'])
    gallery = f'<section class="platform-section container" aria-label="{esc(d["platforms"])}"><p>{esc(d["platforms"])}</p><div class="platform-logos">{platforms}</div><small>{esc(d["independent"])}</small></section><section class="section container destinations-section" id="destinations"><div class="destination-heading"><div><div class="eyebrow">{esc(d["eyebrow"])}</div><h2><span>{esc(d["title"])}</span> <em>{esc(d["accent"])}</em></h2></div><p>{esc(d["subtitle"])}</p></div><button class="city-motion-control" type="button" data-city-motion-toggle data-pause="{esc(d["pause"])}" data-play="{esc(d["play"])}" aria-pressed="false">{esc(d["pause"])}</button><div class="destination-grid">{cards}</div><details class="photo-credits"><summary>{esc(d["credits"])}</summary><p>{esc(d["crop"])}</p><ul>{credits}</ul></details></section>'
    start = document.index('<div class="hero-photo">')
    end = document.index('<a class="hero-scroll"',start)
    document = document[:start] + carousel + document[end:]
    showcase, faq = extra_sections(m)
    faq = service_proof(m, locale) + faq
    document = document.replace('<section id="plans"', showcase + '<section id="plans"',1)
    document = document.replace('<p class="brand-disclaimer container">', faq + '<p class="brand-disclaimer container">',1)
    document = document.replace('</head>', '<link rel="stylesheet" href="/compact.css"><link rel="stylesheet" href="/premium-details.css"><link rel="stylesheet" href="/elegant-accents.css"><link rel="stylesheet" href="/city-media.css"><link rel="stylesheet" href="/gallery-refresh.css"><link rel="stylesheet" href="/workflow-icons.css"></head>')
    document = document.replace('<section class="workflow section">', '<section id="workflow" class="workflow section">')
    signature_art = (ROOT / 'public/logo/signature-eyes.svg').read_text(encoding='utf-8')
    signature = f'<div class="eye-signature" data-eye-signature data-motion-state="idle"><div class="signature-art" aria-hidden="true"><div class="signature-orbit"></div>{signature_art}<span class="signature-wordmark">COOHOSTY</span></div><div class="signature-copy"><h3>{esc(w["watching"])}</h3><p>{esc(w["signatureTagline"])}</p><div class="signature-focus"><span class="signature-focus-dot" aria-hidden="true"></span><span class="signature-focus-label">{esc(w["listing"])}</span></div></div><button class="signature-pause" type="button" data-pause="{esc(w["pauseEyes"])}" data-resume="{esc(w["resumeEyes"])}" aria-pressed="false" aria-label="{esc(w["pauseEyes"])}">{esc(w["pauseEyes"])}</button></div>'
    document = document.replace(f'<div class="watching">{eyes}<span>{esc(w["watching"])}</span></div>', signature)
    document = document.replace('</head>', '<link rel="stylesheet" href="/eye-signature.css"><script type="module" src="/preview-signature.js"></script></head>')
    document = document.replace('</head>', '<link rel="stylesheet" href="/header-clarity.css"></head>')
    document = document.replace('</head>', '<link rel="stylesheet" href="/navigation-listing.css"></head>')
    tools = json.loads((ROOT / 'src/config/analysis-tools.json').read_text(encoding='utf-8'))
    labels = m['analysisTools']
    tools_html = ''.join(f'<a class="analysis-tool" href="{esc(tool["url"])}" target="_blank" rel="noopener noreferrer"><div class="analysis-tool-brand"><img src="{esc(tool["logo"])}" width="28" height="28" alt="" loading="lazy"><strong>{esc(tool["name"])}</strong><span aria-hidden="true">↗</span></div><span>{esc(labels[tool["role"]])}</span>' + (f'<small>{esc(labels["complementary"])}</small>' if tool['complementary'] else '') + '</a>' for tool in tools)
    start = document.index('<div class="tool-chip">')
    end = document.index('</div>', start) + 6
    document = document[:start] + f'<div class="analysis-tools"><h3>{esc(labels["title"])}</h3><div class="analysis-tools-grid">{tools_html}</div><p>{esc(labels["disclaimer"])}</p></div>' + document[end:]
    document = document.replace('</head>', '<link rel="stylesheet" href="/city-transitions.css"><link rel="stylesheet" href="/analysis-tools.css"><link rel="stylesheet" href="/phone-cinema.css"><link rel="stylesheet" href="/logo-city-refinement.css"><link rel="stylesheet" href="/editor-contact.css"><link rel="stylesheet" href="/gallery-arrows.css"><link rel="stylesheet" href="/service-proof.css"><link rel="stylesheet" href="/reference-theme.css"><link rel="stylesheet" href="/reference-essentials.css"></head>')
    return document.replace('<section id="services"',gallery + '<section id="services"',1)

class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        route = self.path.split('?')[0].rstrip('/')
        if route == '/preview-interactions.js':
            body = (ROOT / 'public/preview-interactions.js').read_bytes(); kind = 'text/javascript; charset=utf-8'
        elif route in ['/eye-signature.js', '/preview-signature.js', '/logo-gaze.js']:
            body = (ROOT / 'public' / pathlib.PurePosixPath(route).name).read_bytes(); kind = 'text/javascript; charset=utf-8'
        elif route == '/home-polish.css':
            body = (ROOT / 'src/app/home-polish.css').read_bytes(); kind = 'text/css; charset=utf-8'
        elif route in ['/monochrome.css', '/compact.css', '/premium-details.css', '/elegant-accents.css', '/city-media.css', '/gallery-refresh.css', '/workflow-icons.css', '/eye-signature.css', '/header-clarity.css', '/navigation-listing.css', '/city-transitions.css', '/analysis-tools.css', '/phone-cinema.css', '/logo-city-refinement.css', '/editor-contact.css', '/gallery-arrows.css', '/service-proof.css', '/reference-theme.css', '/reference-essentials.css']:
            body = (ROOT / 'src/app' / pathlib.PurePosixPath(route).name).read_bytes(); kind = 'text/css; charset=utf-8'
        elif route == '/destinations.css':
            body = (ROOT / 'src/app/destinations.css').read_bytes(); kind = 'text/css; charset=utf-8'
        elif route == '/styles.css':
            body = (ROOT / 'src/app/globals.css').read_text(encoding='utf-8').replace('@import "tailwindcss";', '').encode('utf-8'); kind = 'text/css; charset=utf-8'
        elif route.startswith('/logo/') and pathlib.PurePosixPath(route).name in ['full.svg','icon.svg','favicon.svg']:
            body = (ROOT / 'public/logo' / pathlib.PurePosixPath(route).name).read_bytes(); kind = 'image/svg+xml'
        elif route in ['', '/fr', '/en', '/ar']:
            body = page(route[1:] or 'fr').encode('utf-8'); kind = 'text/html; charset=utf-8'
        else:
            self.send_error(404); return
        self.send_response(200); self.send_header('Cache-Control','no-store'); self.send_header('Content-Type',kind); self.send_header('Content-Length',str(len(body))); self.end_headers(); self.wfile.write(body)

if __name__ == '__main__':
    print('COOHOSTY visual preview: http://localhost:3000', flush=True)
    ThreadingHTTPServer(('127.0.0.1',3000),Handler).serve_forever()

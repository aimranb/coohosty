"""Extra marketing sections for the dependency-free visual preview."""
from html import escape as esc
import json
from pathlib import Path
from listing_preview import property_details
from phone_preview import phone_listing

def extra_sections(messages):
    s = messages['showcase']
    media = json.loads((Path(__file__).resolve().parent.parent / 'src/config/property-gallery.json').read_text(encoding='utf-8'))
    first = media['photos'][0]
    first_alt = s['photoAlts'][0]
    photo = f'<div class="gallery-device-photo"><img src="{esc(first["src"])}" alt="{esc(first_alt)}" loading="lazy" decoding="async" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover"></div>'
    phone_photo = photo.replace(f'alt="{esc(first_alt)}"', 'alt=""')
    photo = '<div class="property-listing">' + photo + property_details(s) + '</div>'
    phone_photo = phone_listing(s, phone_photo, len(media['photos']))
    photos_data = esc(json.dumps([{'src': item['src'], 'alt': s['photoAlts'][index]} for index,item in enumerate(media['photos'])], ensure_ascii=False))
    devices = f'<div class="listing-demo property-gallery" data-gallery-photos="{photos_data}" role="region" aria-label="{esc(s["galleryLabel"])}"><div class="cohosty-gallery-bar"><span class="gallery-brand">COOHOSTY</span><span class="gallery-count" aria-live="polite" aria-atomic="true">01 / {len(media["photos"])}</span></div><div class="device-stage"><div class="laptop-device"><div class="laptop-screen"><div class="browser-chrome" aria-hidden="true"><i></i><i></i><i></i><span>COOHOSTY</span></div>{photo}</div><div class="laptop-base" aria-hidden="true"></div></div><div class="phone-device" aria-hidden="true"><div class="phone-island"></div>{phone_photo}<div class="phone-home"></div></div></div><div class="gallery-controls"><button type="button" data-gallery-prev aria-label="{esc(s["previousPhoto"])}">←</button><p>{esc(first_alt)}</p><button type="button" data-gallery-next aria-label="{esc(s["nextPhoto"])}">→</button></div><p class="gallery-credit">{esc(s["disclosure"])} <a href="https://unsplash.com/license" target="_blank" rel="noopener noreferrer">{esc(s["photoCredit"])}</a></p></div>'
    showcase = f'<section id="showcase" class="showcase-section section"><div class="container"><div class="showcase-heading"><div class="eyebrow">{esc(s["eyebrow"])}</div><h2>{esc(s["title"])}<br><em>{esc(s["accent"])}</em></h2><p>{esc(s["description"])}</p></div>{devices}</div></section>'
    f = messages['faq']
    items = ''.join(f'<details class="faq-item" name="coohosty-faq"><summary><span class="faq-number">0{index+1}</span><h3>{esc(item["question"])}</h3><span class="faq-plus" aria-hidden="true">+</span></summary><div class="faq-answer"><p>{esc(item["answer"])}</p></div></details>' for index,item in enumerate(f['items'].values()))
    faq = f'<section id="faq" class="section container faq-section"><div class="faq-intro"><div class="eyebrow">{esc(f["eyebrow"])}</div><h2>{esc(f["title"])}</h2><p>{esc(f["description"])}</p><a href="https://wa.me/212663448785" target="_blank" rel="noreferrer">{esc(f["contact"])}<span aria-hidden="true">↗</span></a></div><div class="faq-list">{items}</div></section>'
    return showcase, faq

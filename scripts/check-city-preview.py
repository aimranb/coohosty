"""Dependency-free structural and HTTP checks for the local design preview."""
import json
import urllib.request
from html.parser import HTMLParser
from preview import ROOT, page

class Structure(HTMLParser):
    def __init__(self):
        super().__init__()
        self.cards = self.slides = self.platforms = self.h1 = 0
    def handle_starttag(self, tag, attributes):
        attributes = dict(attributes)
        classes = attributes.get('class', '').split()
        self.cards += 'destination-card' in classes
        self.slides += 'city-slide' in classes
        self.platforms += 'platform-logo' in classes
        self.h1 += tag == 'h1'

def flatten(value, prefix=''):
    return {key for name, item in value.items() for key in (flatten(item, prefix + name + '.') if isinstance(item, dict) else [prefix + name])}

keys = None
for locale in ['fr', 'en', 'ar']:
    parser = Structure()
    document = page(locale)
    parser.feed(document)
    assert (parser.cards, parser.slides, parser.platforms, parser.h1) == (6, 6, 3, 1)
    assert document.count('class="comparison-services"') == 3
    assert document.count('class="comparison-row is-included"') == 56
    assert document.count('class="comparison-row is-unavailable"') == 0
    assert 'class="package-icon"' not in document
    assert document.count('class="faq-item"') == 8
    assert document.count('class="phone-device"') == 1
    assert document.count('class="laptop-device"') == 1
    assert 'data-gallery-photos=' in document
    assert 'gallery-thumbnails' not in document
    assert 'class="cohosty-gallery-bar"' in document
    assert document.count('<video') == 0
    assert document.count('class="plan-details"') == 3
    assert document.count('class="listing-review"') == 0
    assert document.index('id="faq"') > document.index('id="contact"')
    assert document.count('class="package-outcome"') == 3
    assert document.count('class="package-cta"') == 0  # CTA also has the button class.
    assert document.count('class="button package-cta"') == 3
    assert '>TECHNOLOGIE + HOSPITALITÉ<' not in document
    assert '>.com</text>' not in document
    assert 'dir="rtl"' in document if locale == 'ar' else 'dir="ltr"' in document
    translations = json.loads((ROOT / 'messages' / f'{locale}.json').read_text(encoding='utf-8'))
    current = flatten({section: translations[section] for section in ['destinations', 'plans', 'showcase', 'faq']})
    if keys is not None:
        assert keys == current
    keys = current
    print(f'{locale}: six slides, six destination cards, three logos, one H1, translations OK')

for route in ['/fr', '/en', '/ar', '/destinations.css', '/monochrome.css', '/compact.css', '/premium-details.css', '/elegant-accents.css', '/city-media.css', '/gallery-refresh.css', '/preview-interactions.js']:
    with urllib.request.urlopen('http://localhost:3000' + route) as response:
        assert response.status == 200
        print(f'{route}: HTTP 200')

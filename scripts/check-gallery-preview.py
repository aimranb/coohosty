"""Dependency-free regression checks for the updated localized design preview."""
import json
from html.parser import HTMLParser
from pathlib import Path
from preview import page

ROOT = Path(__file__).resolve().parent.parent

class Structure(HTMLParser):
    def __init__(self):
        super().__init__()
        self.counts = {}
        self.videos = self.h1 = 0
        self.photos = []
    def handle_starttag(self, tag, attributes):
        attributes = dict(attributes)
        for name in attributes.get('class', '').split():
            self.counts[name] = self.counts.get(name, 0) + 1
        self.videos += tag == 'video'
        self.h1 += tag == 'h1'
        if 'data-gallery-photos' in attributes:
            self.photos = [photo['src'] for photo in json.loads(attributes['data-gallery-photos'])]

def keys(value, prefix=''):
    return sorted(key for name, item in value.items() for key in (keys(item, prefix + name + '.') if isinstance(item, dict) else [prefix + name]))

expected_keys = None
for locale in ['fr', 'en', 'ar']:
    document = page(locale)
    parser = Structure()
    parser.feed(document)
    assert parser.counts.get('gallery-thumbnails', 0) == 0
    assert 'data-gallery-prev' in document and 'data-gallery-next' in document
    assert parser.videos == 0
    assert parser.h1 == 1
    assert len(parser.photos) == len(set(parser.photos)) == 10
    assert parser.counts['cohosty-gallery-bar'] == 1
    assert '>COOHOSTY</span>' in document
    assert parser.counts['laptop-device'] == parser.counts['phone-device'] == 1
    assert parser.counts['plan-details'] == parser.counts['plan-whatsapp'] == 3
    assert parser.counts['plan-highlights'] == 3
    assert parser.counts['comparison-row'] == 56  # 9 audit + 19 optimize + 28 cohost.
    assert parser.counts.get('is-unavailable', 0) == 0
    assert parser.counts.get('listing-switch', 0) == 0
    assert parser.counts.get('listing-review', 0) == 0
    assert parser.counts['destination-card'] == 6
    assert parser.counts['faq-item'] == 8
    assert '/gallery-refresh.css' in document
    assert ('dir="rtl"' if locale == 'ar' else 'dir="ltr"') in document
    messages = json.loads((ROOT / f'messages/{locale}.json').read_text(encoding='utf-8'))
    current_keys = keys(messages)
    if expected_keys is not None:
        assert expected_keys == current_keys
    expected_keys = current_keys
    assert len(messages['showcase']['photoAlts']) == 10
    print(f'{locale}: 10 distinct photos, no video/comparison, compact plans, WhatsApp, translation parity OK')

assert not (ROOT / 'src/components/sections/apartment-video.tsx').exists()
assert not (ROOT / 'src/config/listing-media.json').exists()
assert not (ROOT / 'public/media/apartment.vtt').exists()
print('Removed video assets OK')

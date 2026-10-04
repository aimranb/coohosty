"""Check the shared configuration and translated visual preview without npm dependencies."""
import urllib.request
from preview import page, ROOT
import json

tools = json.loads((ROOT / 'src/config/analysis-tools.json').read_text(encoding='utf-8'))
assert len(tools) == 3 and len({tool['id'] for tool in tools}) == 3
assert tools[-1]['complementary'] is True
for locale in ['fr', 'en', 'ar']:
    document = page(locale)
    assert document.count('class="city-caption ') == 6
    assert document.count('class="city-caption is-active"') == 1
    assert document.count('class="analysis-tool"') == 3
    assert 'Robert Prazeres / Wikimedia Commons' in document
    assert 'CC BY-SA 4.0' in document
    assert 'Bab_mansour_DSCF5776.jpg' in document
    assert 'signature-smile' in document
    with urllib.request.urlopen('http://127.0.0.1:3000/' + locale) as response:
        assert response.status == 200
        assert response.read().decode('utf-8') == document
    print(f'{locale}: matching HTTP preview, six fading captions, three tools, smiling eyes, Meknes attribution OK')
for filename in ['city-transitions.css', 'analysis-tools.css']:
    with urllib.request.urlopen('http://127.0.0.1:3000/' + filename) as response:
        assert response.status == 200
print('Both new stylesheets HTTP 200')

"""Structural checks for the latest reference editor and contact presentation."""
from preview import page, ROOT
import json
import urllib.request

keys=None
for locale in ['fr','en','ar']:
    m=json.loads((ROOT/f'messages/{locale}.json').read_text(encoding='utf-8'))
    current=set(m['showcase']['phone'])
    assert keys is None or current==keys
    keys=current
    document=page(locale)
    assert document.count('data-editor-offset=')==3
    assert document.count('class="editor-tabs"')==1
    assert document.count('class="phone-editor"')==1
    assert document.count('class="audit-comfort"')==1
    assert document.count('class="audit-step-labels"')==1
    assert document.count('class="audit-step-help"')==1
    for key in ['simple','tailored','direct','whatsapp']:
        assert m['form']['comfort'][key] in document
    with urllib.request.urlopen('http://127.0.0.1:3000/'+locale) as response:
        assert response.read().decode('utf-8')==document
    print(f'{locale}: editor stack, tabs, contact guidance, five-step labels, WhatsApp, translation parity and HTTP OK')
for path in ['src/components/sections/city-carousel.tsx','public/preview-interactions.js']:
    source=(ROOT/path).read_text(encoding='utf-8')
    assert '3000' in source and '6500' not in source
assert 'transition-duration:.7s' in (ROOT/'src/app/editor-contact.css').read_text(encoding='utf-8')
with urllib.request.urlopen('http://127.0.0.1:3000/editor-contact.css') as response:
    assert response.status==200
print('Three-second city timing and contact/editor CSS HTTP OK')

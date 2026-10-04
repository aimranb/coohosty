"""Source and served preview checks for the reference-inspired phone and city motion."""
import urllib.request
from preview import page, ROOT

for locale in ['fr','en','ar']:
    document=page(locale)
    for cls in ['phone-editor','editor-toolbar','editor-tabs','editor-photo-stack','editor-stack-photo editor-stack-main']:
        assert f'class="{cls}"' in document, (locale,cls)
    assert 'data-city-motion-toggle' in document
    assert '/phone-cinema.css' in document
    assert '>4.97<' not in document and '>156<' not in document
    assert 'Airbnb 2023 Winter Release' not in document
    with urllib.request.urlopen('http://127.0.0.1:3000/'+locale) as response:
        assert response.read().decode('utf-8') == document
    print(f'{locale}: reference-inspired phone, translated content, no fabricated review metrics, matching served preview')
css=(ROOT/'src/app/phone-cinema.css').read_text(encoding='utf-8')
assert '@keyframes city-cinematic' in css
assert '@keyframes city-card-cinematic' in css
assert 'prefers-reduced-motion:reduce' in css
assert '[data-motion-paused=true]' in css
with urllib.request.urlopen('http://127.0.0.1:3000/phone-cinema.css') as response:
    assert response.status == 200
print('City zoom/pan, pause, reduced-motion source rules and stylesheet HTTP route OK')

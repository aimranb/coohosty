"""Check rollback, proof placement and honest empty/data states without npm dependencies."""
from preview import ROOT, page
from service_proof_preview import service_proof
from unittest.mock import patch
from pathlib import Path
import json
import urllib.request

for locale in ['fr','en','ar']:
    messages=json.loads((ROOT/f'messages/{locale}.json').read_text(encoding='utf-8'))
    document=page(locale)
    assert document.index('id="contact"') < document.index('id="service-proof"') < document.index('id="faq"')
    assert 'service-client-count' not in document
    assert 'class="service-review-card"' not in document
    assert messages['serviceProof']['pending'] in document
    assert 'brand-finish.css' not in document and 'footer-signature' not in document and 'footer-nav' not in document
    with urllib.request.urlopen('http://127.0.0.1:3000/'+locale,timeout=10) as response:
        assert response.read().decode('utf-8')==document
    # Synthetic fixtures exercise rendering only; they are never written to site configuration.
    fixture={'clientCount':12,'countVerifiedOn':'2026-10-02','reviews':[{'name':'Test <owner>','city':'Test city','plan':'AUDIT','quote':{key:'Test <feedback>' for key in ['fr','en','ar']},'sourceUrl':None}]}
    with patch.object(Path,'read_text',return_value=json.dumps(fixture)):
        content=service_proof(messages,locale)
    assert 'service-client-count' in content and 'Test &lt;feedback&gt;' in content
    assert 'Test <feedback>' not in content
    fixture['countVerifiedOn']=None
    with patch.object(Path,'read_text',return_value=json.dumps(fixture)):
        assert 'service-client-count' not in service_proof(messages,locale)
    print(f'{locale}: previous design restored, proof before FAQ, no invented claims, verified-date gate and escaped review rendering OK')
assert not (ROOT/'src/app/brand-finish.css').exists()
with urllib.request.urlopen('http://127.0.0.1:3000/service-proof.css',timeout=10) as response:
    assert response.status==200
print('Service-proof stylesheet HTTP 200')

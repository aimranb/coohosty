"""Genuine service review presentation, with no fabricated fallback reviews or count."""
from pathlib import Path
from html import escape as esc
import json

def service_proof(messages,locale):
    data=json.loads((Path(__file__).resolve().parent.parent/'src/config/service-proof.json').read_text(encoding='utf-8'))
    t=messages['serviceProof']
    count=data['clientCount']
    count_html=f'<div class="service-client-count"><strong>{count:,}</strong><span>{esc(t["clients"])}</span></div>' if type(count) is int and count >= 0 and data['countVerifiedOn'] else ''
    cards=''
    for review in data['reviews']:
        source=f'<a href="{esc(review["sourceUrl"])}" target="_blank" rel="noopener noreferrer">{esc(t["source"])} ↗</a>' if review['sourceUrl'] else ''
        cards+=f'<article class="service-review-card"><span aria-hidden="true">“</span><blockquote>{esc(review["quote"][locale])}</blockquote><div class="service-review-person"><span class="service-review-avatar" aria-hidden="true">{esc(review["name"][:1])}</span><div><strong>{esc(review["name"])}</strong><span>{esc(" · ".join(filter(None,[review["city"],review["plan"]])))}</span></div></div>{source}</article>'
    content='<div class="service-review-grid">'+cards+'</div>' if cards else f'<div class="service-proof-empty"><span aria-hidden="true">“</span><p>{esc(t["pending"])}</p><a href="https://wa.me/212663448785" target="_blank" rel="noopener noreferrer">{esc(t["cta"])} ↗</a></div>'
    return f'<section id="service-proof" class="service-proof-section container" aria-labelledby="service-proof-title"><div class="service-proof-bar"><div class="service-proof-heading"><div><span class="eyebrow">{esc(t["eyebrow"])}</span><h2 id="service-proof-title">{esc(t["title"])}</h2><p>{esc(t["subtitle"])}</p></div>{count_html}</div>{content}</div></section>'

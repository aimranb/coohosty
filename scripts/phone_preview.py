"""Reference-inspired decorative editor, synchronized with gallery selection."""
from html import escape as esc
from pathlib import Path
import json

def phone_listing(labels, photo, total):
    p=labels['phone']
    photos=json.loads((Path(__file__).resolve().parent.parent/'src/config/property-gallery.json').read_text(encoding='utf-8'))['photos']
    stack=''.join(f'<div class="editor-stack-photo editor-stack-{position}"><img src="{esc(photos[index]["src"])}" alt="" loading="lazy" data-editor-offset="{offset}"></div>' for position,index,offset in [('left',total-1,-1),('right',1,1),('main',0,0)])
    return f'<div class="phone-editor"><div class="editor-status"><span>9:41</span><span>▮ ▰</span></div><div class="editor-toolbar"><span>←</span><strong>{esc(p["editor"])}</strong><span>☷</span></div><div class="editor-tabs"><span class="is-selected">{esc(p["space"])}</span><span>{esc(p["arrivalGuide"])}</span></div><div class="editor-card editor-tour"><h4>{esc(p["photoTour"])}</h4><p>{esc(p["tourSubtitle"])}</p><div class="editor-photo-stack">{stack}</div></div><div class="editor-card property-listing-info" data-villa-title="{esc(labels["villaTitle"])}" data-apartment-title="{esc(labels["apartmentTitle"])}"><h4>{esc(p["titleLabel"])}</h4><h3>{esc(labels["villaTitle"])}</h3></div><span class="editor-brand">COOHOSTY</span></div>'

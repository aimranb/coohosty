"""Listing presentation used by the lightweight preview, with explicit sample stars."""
from html import escape as esc

def property_details(messages, villa=True):
    title = messages['villaTitle'] if villa else messages['apartmentTitle']
    tags = ''.join(f'<span>{esc(messages[key])}</span>' for key in ['photoTag','infoTag','welcomeTag'])
    return f'<div class="property-listing-info" data-villa-title="{esc(messages["villaTitle"])}" data-apartment-title="{esc(messages["apartmentTitle"])}"><span class="property-listing-category">{esc(messages["listingCategory"])}</span><h3>{esc(title)}</h3><p>{esc(messages["listingDescription"])}</p><div class="property-listing-tags">{tags}</div><div class="property-listing-review"><div class="listing-review-stars" aria-hidden="true">★★★★★</div><span>{esc(messages["reviewIllustration"])}</span><p>{esc(messages["reviewPlaceholder"])}</p></div></div>'

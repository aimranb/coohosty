from pathlib import Path

root = Path(__file__).resolve().parent.parent
path = root / 'src/app/site-typography.css'
css = '''

/* Supporting text beneath page and section headings. */
:root{--type-subtitle:20px;--type-compact-subtitle:16px}
#main-content .income-intro-copy>p,#main-content .income-intro-copy .income-intro-lead,#main-content .section-heading>p,#main-content .section-description,#main-content .reservation-heading>p,#main-content .destination-heading>p,#main-content .service-proof-heading p,#main-content .audit-intro>p,#main-content .owner-support-copy>p,#main-content .showcase-heading>p,#main-content .workflow-heading>p{font-size:var(--type-subtitle);line-height:1.7}
.hero-surface .hero .estimate-bar .estimate-intro,.estimate-completion-card .estimate-bar .estimate-intro,#main-content .plans-section .comparison-card .plan-subtitle,#main-content .plan-services-panel-heading p{font-size:var(--type-compact-subtitle);line-height:1.7}
@media(max-width:760px){:root{--type-subtitle:18px;--type-compact-subtitle:16px}}
'''
s = path.read_text(encoding='utf-8')
if '/* Supporting text beneath page and section headings. */' not in s:
    path.write_text(s + css, encoding='utf-8')
print('Enlarged section subtitles to 20px desktop / 18px mobile and compact subtitles to 16px.')

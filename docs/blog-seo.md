# Blog propriétaires : SEO et maintenance

Six guides français sont disponibles dans le projet à `/fr/blog`. Le guide de la fiche de police apparaît en premier. Leur contenu éditorial se trouve dans `src/content/blog.ts` ; leurs métadonnées et données structurées dans `src/lib/blog-seo.ts`.

| URL sous `/fr/blog/` | Intention principale |
| --- | --- |
| `fiche-de-police-airbnb-maroc` | Fiche de police, bulletin d’hébergement et PDF officiel |
| `fiscalite-taxes-airbnb-maroc` | Fiscalité, TVA et taxe de séjour |
| `commission-airbnb-maroc` | Frais hôte et calcul en dirhams |
| `sous-location-airbnb-maroc` | Bail, accord du propriétaire et exploitation |
| `airbnb-maroc-definition` | Comprendre Airbnb côté propriétaire |
| `conciergerie-airbnb-marrakech` | Comprendre et comparer les missions de gestion |

Chaque article possède une URL canonique, un titre et une description uniques, des métadonnées de partage, des données `BlogPosting` et `BreadcrumbList`, un sommaire, des FAQ visibles, des références et des liens vers des guides et des offres. Le blog est accessible depuis le menu et le pied de page ; trois articles sont présentés sur l’accueil français. Le sitemap contient aussi les neuf pages de services localisées.

Les articles sont en français. Les URL anglaises et arabes du blog redirigent vers les pages françaises et ne sont pas déclarées comme traductions dans le sitemap ou les métadonnées. Le changement de langue depuis un article mène à l’accueil de la langue choisie.

Les chiffres de volume du screenshot ne sont pas publiés comme statistiques vérifiées. Les textes ne promettent ni revenus ni classement Google. Les sujets juridiques et fiscaux présentent les références et les démarches à faire confirmer pour chaque logement. Le lien PDF renvoie au décret officiel avec le modèle en annexe ; aucun formulaire improvisé n’est présenté comme document administratif officiel.

## Mise à jour

Les sources ont été consultées le 7 octobre 2026. Vérifier en particulier les frais Airbnb, le CGI de l’année en cours, les textes de l’hébergement touristique et les tarifs communaux avant une mise à jour. Mettre à jour `modified` uniquement après une modification réelle et une nouvelle vérification des références. Pour tout nouveau guide, ajouter des liens internes et une sélection `related` pertinente.

## Vérifications

- `npm run typecheck`
- `npm run lint`
- `npm run test -- tests/blog-seo.test.ts`
- `npm run build`
- Lancer le serveur de production sur le port 3135, puis `node scripts/check-blog.cjs` ; `BLOG_TEST_URL` permet de choisir une autre URL. Le script contrôle les pages à 1440, 900 et 390 pixels et enregistre les captures dans `.tmp/blog/`.

## Après publication

La création locale ne constitue pas un déploiement. Après publication sur le domaine, vérifier les nouvelles URL et soumettre le sitemap existant dans Google Search Console. Suivre les impressions, requêtes, clics et demandes reçues avant de choisir de nouveaux sujets. Aucun accès Search Console n’a été utilisé pour ce travail.

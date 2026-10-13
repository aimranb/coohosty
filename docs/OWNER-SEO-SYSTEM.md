# Système éditorial propriétaires — COOHOSTY

Livraison du 13 octobre 2026. Objectif : répondre aux recherches de propriétaires et convertir les visites pertinentes en demandes d’analyse. Aucun classement Google garanti.

## Fonctionnement

Le blog français contient 28 guides. Deux piliers relient les sujets : `/fr/blog/location-courte-duree-maroc` et `/fr/blog/conciergerie-airbnb-maroc`. Treize nouveaux guides couvrent notamment la gestion à distance, les coûts, la rentabilité, les tarifs, les plateformes et les biens à Casablanca, Marrakech et Meknès.

Les quatre parcours de découverte sont définis dans `src/content/blog-pathways.ts`. Chaque guide appartient à un seul parcours ; ses liens éditoriaux et ses articles associés permettent de rejoindre le pilier et les pages complémentaires. Les trois guides clés apparaissent sur l’accueil français. Les articles contiennent une estimation accessible au milieu et à la fin du parcours.

Les nouveaux contenus sont en français. Ils ne sont pas présentés comme des traductions anglaises ou arabes : les autres langues redirigent vers le français pour ces slugs, et les métadonnées ainsi que le sitemap ne déclarent que les langues réellement disponibles. Le blog anglais et arabe conserve ses guides traduits existants.

## Périmètre commercial

Gestion digitale dans tout le Maroc. Gestion physique complète à Meknès. Dans les autres villes, les interventions locales doivent être organisées séparément. Cette précision apparaît dans les guides, les CTA, les offres et les pages de villes. Les pages Casablanca et Marrakech ne promettent pas d’équipes COOHOSTY sur place.

Les commissions de plateforme et les honoraires de gestion sont distincts. Les exemples chiffrés sont des simulations pédagogiques, pas des revenus constatés. Aucun volume de recherche, classement de ville ou taux d’occupation non vérifié n’est utilisé. Les essais Google Trends ont rencontré une erreur 429.

## Avant chaque nouvel article

1. Définir la question du propriétaire et vérifier si un guide existant y répond déjà. Enrichir la page existante lorsque l’intention est identique.
2. Rédiger les procédures, tableaux ou exemples utiles au logement. Confirmer les conditions des plateformes sur leurs sources officielles ; vérifier les sujets juridiques avec les références marocaines en vigueur.
3. Ajouter le slug à l’allowlist, au groupe de langue approprié et à un parcours. Donner au guide des liens vers son pilier et des articles associés existants.
4. Renseigner un titre et une description distincts. Utiliser de vraies dates de publication, modification et consultation des références ; ne pas renouveler artificiellement les dates.
5. Vérifier types, tests SEO, canonicals, indexabilité, liens internes, JSON-LD et affichage mobile. La FAQ est une aide au lecteur, pas une promesse de résultat enrichi dans Google.

Les métadonnées Article, les canonicals, les alternances de langue, le fil d’Ariane et le sitemap sont générés par les fonctions existantes. Le sitemap attendu contient 74 URLs au moment de cette livraison.

## Suivi après mise en ligne

Dans Google Search Console, soumettre `https://www.coohosty.com/sitemap.xml` et examiner les deux piliers puis le guide à distance dans l’inspection d’URL. Aucun accès Search Console n’a été utilisé ; la mise en ligne et l’inscription au sitemap ne prouvent pas l’indexation.

Chaque mois, remplir `docs/owner-seo-tracking.csv` à partir des données réelles : page, requête, pays, impressions, clics, CTR, position moyenne et demandes d’estimation si leur mesure est disponible. Conserver la période et comparer des fenêtres équivalentes. Les positions moyennes ne sont pas des rangs garantis pour chaque internaute.

Si une page reçoit des impressions mais peu de clics, relire son titre et sa description selon les requêtes réellement affichées. Si elle reçoit des clics sans demande pertinente, examiner l’intention, le périmètre de services et le CTA. Si deux pages apparaissent pour la même intention, vérifier si leur contenu doit être différencié ou consolidé.

Planifier les mises à jour à partir de questions reçues, changements de plateformes et données de recherche. Pour les guides locaux, ajouter uniquement des informations d’adresse, d’organisation ou de marché réellement vérifiables. Aucune campagne de liens artificiels ni multiplication de pages de villes identiques.

Références : [contenu utile selon Google](https://developers.google.com/search/docs/fundamentals/creating-helpful-content), [données Google Trends](https://support.google.com/trends/answer/4365533?hl=fr), [autorisations des co-hôtes Airbnb](https://www.airbnb.fr/help/article/1534), [calendriers Airbnb](https://www.airbnb.fr/help/article/99), [calendriers Vrbo](https://help.vrbo.com/articles/How-do-I-import-my-iCal-or-Google-calendar).

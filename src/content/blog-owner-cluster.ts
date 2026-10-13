import type { BlogPost, BlogSection } from './blog';

const dates = { published: '2026-10-13', modified: '2026-10-13' };
const pillar = 'location-courte-duree-maroc';
const distance = 'gerer-location-courte-duree-distance-maroc';
const profitability = 'rentabilite-location-courte-duree-maroc';
const costs = 'couts-location-courte-duree-maroc';
const pricing = 'prix-location-courte-duree-maroc';
const platforms = 'airbnb-booking-vrbo-location-courte-duree';
const link = (slug: string, label: string) => ({ href: `/fr/blog/${slug}`, label });
const section = (id: string, title: string, paragraphs: string[], extra: Partial<BlogSection> = {}): BlogSection => ({ id, title, paragraphs, ...extra });
const scope = section('coohosty', 'Ce que nous pouvons gérer pour vous', [
  'COOHOSTY vous accompagne dans la gestion digitale de votre location courte durée dans tout le Maroc : annonces, tarifs, réservations, messages et coordination des plateformes, selon la mission définie ensemble. Vous conservez une visibilité sur les décisions et les tâches confiées.',
  'La gestion physique complète est proposée à Meknès. Dans les autres villes, vous devez prévoir une organisation locale pour le ménage, les clés et les interventions. Notre accompagnement digital ne signifie pas que nous envoyons des équipes sur place dans toutes les villes.',
], { links: [{ label: 'Analyser mon bien', href: '/fr#estimate' }] });
function post(slug: string, title: string, seoTitle: string, description: string, category: string, intro: string, takeaway: string, sections: BlogSection[], faq: BlogPost['faq'], related: string[]): BlogPost {
  return { ...dates, slug, title, seoTitle, description, category, intro, takeaway, sections: [...sections, scope], faq, related, status: 'published' };
}

export const ownerClusterPosts: BlogPost[] = [
  post(distance,
    'Comment gérer une location courte durée à distance au Maroc ?',
    'Gérer une location courte durée à distance au Maroc',
    'Vous vivez loin de votre logement au Maroc ? Organisez les annonces, tarifs, messages et intervenants locaux pour gérer votre location courte durée à distance.',
    'Gestion à distance',
    'Votre appartement est au Maroc, mais vous vivez dans une autre ville ou à l’étranger. Chaque séjour vous oblige à suivre des messages, des horaires et des dépenses. Pour déléguer sans perdre le contrôle, séparez les tâches qui se gèrent en ligne de celles qui nécessitent une personne sur place.',
    'La distance se gère avec des responsabilités précises, des accès adaptés et un relais local fiable. Un calendrier partagé ne remplace pas une personne capable de vérifier le logement.',
    [section('responsabilites', 'Commencez par répartir les responsabilités', [
      'Notez qui publie les annonces, répond aux voyageurs, valide les prix et contrôle les dépenses. Définissez aussi qui intervient pour les clés, le ménage et une panne. Si deux personnes pensent que l’autre traite une demande, le voyageur attend et vous reprenez la gestion en urgence.',
      'Préparez une procédure courte pour les cas récurrents : arrivée tardive, équipement défectueux, logement mal préparé ou demande de départ prolongé. Pour chaque situation, indiquez le responsable, le contact de remplacement et le délai d’escalade vers vous.',
    ], { table: { caption: 'Une répartition à adapter à votre logement', headers: ['Mission', 'Gestion digitale', 'Intervention locale'], rows: [['Prix et disponibilités', 'Suivi des tarifs et du calendrier', 'Signaler les travaux ou indisponibilités'], ['Messages voyageurs', 'Informations, consignes et suivi', 'Confirmer la situation réelle du logement'], ['Ménage et clés', 'Coordonner horaires et informations', 'Préparer, contrôler et donner accès'], ['Panne matérielle', 'Informer et demander une validation', 'Diagnostiquer et intervenir']] } }),
    section('acces', 'Gardez des accès adaptés et la maîtrise de votre annonce', [
      'Utilisez les fonctions de délégation disponibles sur chaque plateforme et attribuez les droits nécessaires à la mission. Airbnb permet différents niveaux d’accès au co-hôte. Vérifiez les permissions avant de confier une tâche : pouvoir lire un calendrier et pouvoir modifier une annonce ne sont pas la même chose.',
      'Précisez qui reçoit les versements, qui détient les accès aux outils et comment vous récupérez les informations à la fin de la collaboration. Préservez vos moyens de récupération de compte et évitez de partager des identifiants personnels lorsque des accès individuels sont disponibles.',
    ], { sources: ['cohostPermissions'] }),
    section('relais', 'Organisez votre relais local avant la première réservation', [
      'Une personne doit pouvoir constater l’état du logement, vérifier la préparation et traiter les besoins matériels. Demandez comment elle confirme un ménage terminé et comment un remplacement est organisé si elle est indisponible. Les consignes d’accès doivent rester à jour et être protégées.',
      'Dressez une liste d’équipements avec les informations utiles : Wi-Fi, chauffe-eau, climatisation et dispositifs d’accès. Définissez un seuil de dépense autorisé, les justificatifs attendus et les cas où votre accord est obligatoire. Cette organisation protège votre budget autant que l’expérience du voyageur.',
    ]),
    section('suivi', 'Demandez un suivi qui vous aide à décider', [
      'Chaque mois, rapprochez les nuits disponibles, les nuits réservées, les recettes et les dépenses. Distinguez une date occupée par un voyageur d’une date bloquée pour votre famille ou des travaux. Un rapport utile explique aussi les annulations et les actions entreprises.',
      'Ajoutez les incidents, les avis reçus et les équipements à remplacer. Vous devez pouvoir comprendre une variation du résultat : moins de nuits vendues, tarif différent ou dépense exceptionnelle. Demandez des comptes rendus réguliers plutôt que de découvrir les problèmes quand ils deviennent urgents.',
    ], { links: [link(profitability, 'Suivre le résultat réel de votre location'), link(platforms, 'Organiser plusieurs plateformes')] }),
    section('demarrer', 'Les informations à préparer pour déléguer', [
      'Réunissez l’adresse, la capacité, les photos, les annonces existantes et vos dates personnelles. Décrivez les tâches que vous gérez déjà et celles qui vous prennent le plus de temps. Précisez si vous disposez d’un prestataire pour le ménage et les clés.',
      'Faites ensuite définir le périmètre, les honoraires, les dépenses exclues et les conditions de sortie. Une période de mise en place doit permettre de vérifier les accès et les procédures avant de promettre aux voyageurs un fonctionnement que personne n’a encore testé.',
    ], { links: [link(pillar, 'Préparer votre projet de location au Maroc')] })],
    [{ question: 'Puis-je garder mon prestataire de ménage ?', answer: 'Oui, cette répartition peut être prévue dans la mission. Définissez comment les horaires, les consignes et les confirmations de préparation sont transmis.' }, { question: 'Un co-hôte peut-il tout modifier sur Airbnb ?', answer: 'Cela dépend des permissions accordées. Vérifiez les droits du compte et leur adéquation avec la mission convenue.' }, { question: 'COOHOSTY intervient-il physiquement dans tout le Maroc ?', answer: 'La gestion digitale est proposée dans tout le Maroc. La gestion physique complète est proposée à Meknès ; ailleurs, l’organisation des interventions locales doit être définie séparément.' }],
    [pillar, profitability, platforms, 'cohosting-ou-conciergerie-airbnb-maroc']),

  post(profitability,
    'Rentabilité d’une location courte durée au Maroc : calculez votre résultat',
    'Rentabilité location courte durée Maroc : méthode de calcul',
    'Évaluez votre location courte durée au Maroc avec les nuits disponibles, le prix obtenu et les coûts réels. Exemple de calcul et comparaison des scénarios.',
    'Rentabilité',
    'Vous souhaitez savoir ce que votre logement peut vous rapporter. Une estimation sérieuse commence par votre calendrier et vos dépenses, puis teste plusieurs hypothèses. Elle ne transforme pas le meilleur mois d’une annonce voisine en revenu promis pour votre appartement.',
    'Comparez un résultat après dépenses sur une période cohérente. Un taux d’occupation élevé peut masquer un tarif trop bas ou des changements de voyageurs coûteux.',
    [section('recettes', 'Distinguez le chiffre d’affaires du résultat', [
      'Les recettes de nuitées se calculent à partir des nuits vendues et du prix obtenu. Les montants affichés dans une annonce ne décrivent pas forcément vos encaissements : remises, annulations et frais peuvent modifier le décompte. Rapprochez les réservations des relevés de versement.',
      'Retirez ensuite les frais de plateforme, les honoraires éventuels et les dépenses d’exploitation. Gardez séparés les impôts, le financement et les dépenses exceptionnelles lorsque vous présentez un résultat intermédiaire. Le mot « net » doit toujours préciser ce qui a réellement été déduit.',
    ], { links: [link(costs, 'Construire votre liste de dépenses')] }),
    section('exemple', 'Un exemple fictif pour comprendre le calcul', [
      'Supposons 20 nuits réservées à un tarif moyen de 600 MAD : les recettes de nuitées sont de 12 000 MAD. Si les dépenses retenues pour l’exemple totalisent 3 500 MAD, le résultat intermédiaire est de 8 500 MAD. Ces montants servent uniquement à expliquer l’arithmétique ; ils ne décrivent aucun marché ni logement géré.',
      'Ce résultat n’est pas un rendement net annuel. L’exemple n’intègre ni fiscalité, ni financement, ni investissement initial et ne fournit aucun taux standard de frais. Remplacez chaque hypothèse par vos devis, vos relevés et les charges propres au logement avant de prendre une décision.',
    ], { table: { caption: 'Simulation pédagogique, pas une prévision de revenus', headers: ['Poste', 'Hypothèse fictive'], rows: [['Nuits vendues', '20'], ['Tarif moyen obtenu', '600 MAD'], ['Recettes de nuitées', '12 000 MAD'], ['Dépenses retenues dans cet exemple', '3 500 MAD'], ['Résultat intermédiaire avant postes exclus', '8 500 MAD']] } }),
    section('occupation', 'Définissez vos nuits réellement disponibles', [
      'Le taux d’occupation rapporte les nuits réservées aux nuits disponibles à la location. Si vous retirez des dates pour votre usage personnel, conservez cette information dans votre tableau. Comparer deux logements ouverts un nombre de nuits différent sans le préciser est trompeur.',
      'Suivez également les recettes par nuit disponible. Une baisse de l’occupation accompagnée d’un meilleur tarif peut produire un résultat différent d’une baisse subie. Analysez les recettes et les coûts ensemble au lieu de poursuivre un pourcentage isolé.',
    ]),
    section('annee', 'Testez plusieurs scénarios sur une année', [
      'Construisez un tableau par mois et prévoyez des périodes plus faibles. Un scénario prudent doit pouvoir absorber moins de réservations ou une intervention coûteuse. Un scénario favorable reste une hypothèse, même lorsqu’il s’appuie sur une période où vous avez déjà obtenu de bons résultats.',
      'Pour comparer avec la longue durée, prenez une même période annuelle et les mêmes charges de propriétaire. Ajoutez les coûts spécifiques à chaque modèle et le temps de suivi. Évitez de comparer le chiffre d’affaires brut de courte durée à un loyer déjà diminué de charges.',
    ], { links: [link('location-courte-ou-longue-duree-maroc', 'Comparer courte et longue durée'), link(pricing, 'Construire vos hypothèses de prix')] }),
    section('verifier', 'Les documents utiles pour une estimation', [
      'Préparez les relevés de réservations si le logement est déjà proposé, les factures récurrentes et les devis de ménage, entretien ou gestion. Notez les travaux prévus et les dates indisponibles. L’emplacement, les équipements et l’état du logement doivent accompagner les chiffres.',
      'Si vous débutez, indiquez clairement ce qui provient d’un devis et ce qui reste une hypothèse. Faites préciser les obligations et leur traitement fiscal par les professionnels compétents. Une estimation commerciale ne garantit ni la demande future ni le revenu encaissé.',
    ], { links: [link(pillar, 'Comprendre l’ensemble du projet'), link('fiscalite-taxes-airbnb-maroc', 'Préparer vos questions fiscales')] })],
    [{ question: 'Quel taux d’occupation utiliser ?', answer: 'Utilisez vos données ou des hypothèses explicitement justifiées, en distinguant les nuits disponibles des dates bloquées. Il n’existe pas de taux universel pour tous les biens au Maroc.' }, { question: 'Le revenu brut suffit-il à juger le projet ?', answer: 'Non. Les frais, les dépenses, la fiscalité et, selon votre situation, le financement doivent être étudiés séparément.' }, { question: 'Les chiffres de l’exemple sont-ils des résultats COOHOSTY ?', answer: 'Non. Ils constituent une simulation pédagogique destinée à expliquer le calcul et ne représentent aucun résultat constaté.' }],
    [pillar, costs, pricing, 'location-courte-ou-longue-duree-maroc']),

  post('location-courte-ou-longue-duree-maroc',
    'Location courte ou longue durée au Maroc : laquelle choisir ?',
    'Location courte ou longue durée au Maroc : comparatif',
    'Comparez courte et longue durée au Maroc : recettes annuelles, dépenses, disponibilité du logement et temps de gestion pour choisir selon votre objectif.',
    'Comparatifs',
    'Vous pouvez louer votre logement pour des séjours temporaires ou rechercher un occupant dans la durée. Pour choisir, comparez un budget annuel et une organisation concrète. Le modèle qui produit le plus de recettes brutes n’est pas nécessairement celui qui correspond à votre disponibilité ou à votre besoin de stabilité.',
    'Le choix dépend du résultat après dépenses, de vos périodes d’usage personnel et du travail que vous souhaitez déléguer. Aucune formule ne rend un modèle systématiquement gagnant.',
    [section('objectif', 'Partez de ce que vous attendez de votre logement', [
      'Si vous souhaitez conserver des dates pour votre famille, la souplesse du calendrier compte dans votre décision. Si vous cherchez une organisation plus stable, examinez les obligations du bail, la sélection du locataire et le suivi à prévoir. Ne vous limitez pas à une estimation de revenu.',
      'Notez également la distance qui vous sépare du logement et votre capacité à gérer les imprévus. Les séjours courts demandent une organisation des changements de voyageurs ; la longue durée exige elle aussi une gestion contractuelle et matérielle, même si elle fonctionne différemment.',
    ]),
    section('comparer', 'Comparez les deux modèles sur douze mois', [
      'Pour la courte durée, additionnez des hypothèses mensuelles de nuits vendues et de prix obtenus. Pour la longue durée, partez du loyer envisagé et des périodes éventuelles de vacance. Utilisez la même période et explicitez les charges retenues dans chaque colonne.',
      'Retirez les coûts spécifiques : frais de commercialisation, ménage, linge, équipements, gestion et entretien selon le modèle. Faites examiner le traitement fiscal et les règles du contrat par les professionnels compétents. Une comparaison doit rendre ses exclusions visibles.',
    ], { links: [link(profitability, 'Évaluer la rentabilité de la courte durée'), link(costs, 'Lister les coûts d’exploitation')] }),
    section('criteres', 'Un tableau pour structurer votre décision', [
      'Les critères ci-dessous décrivent des questions à examiner, pas des avantages automatiques. Un logement mal adapté à son usage peut rencontrer des difficultés dans les deux modèles. Vérifiez les équipements, l’emplacement et les règles applicables avant de calculer votre budget.',
      'Attribuez ensuite une importance à chaque critère selon votre projet. Vous pourrez comparer deux scénarios complets plutôt qu’une nuitée affichée et un loyer mensuel isolé. Gardez une marge pour les dépenses exceptionnelles et les délais entre occupants.',
    ], { table: { caption: 'Les questions à poser pour chaque modèle', headers: ['Critère', 'Courte durée', 'Longue durée'], rows: [['Recettes', 'Prix obtenu et nuits réellement vendues', 'Loyer, vacance et encaissement'], ['Organisation', 'Réservations et changements de voyageurs', 'Bail, entrée, suivi et sortie'], ['Usage personnel', 'Dates bloquées avant réservation', 'Compatibilité à vérifier avec le bail'], ['Budget', 'Plateformes, ménage et équipement', 'Charges et frais selon le contrat']] } }),
    section('risques', 'Préparez les situations moins favorables', [
      'Testez une baisse de demande pour les séjours courts et une période sans occupant pour la longue durée. Ajoutez une dépense de remplacement d’équipement dans les deux scénarios. Le but est de savoir si votre budget reste acceptable lorsque tout ne se passe pas comme prévu.',
      'Si vous envisagez un changement de modèle, examinez les engagements en cours avant de modifier le calendrier ou le contrat. Les réservations acceptées et les droits de l’occupant doivent être traités selon les règles applicables à votre situation.',
    ]),
    section('choisir', 'Décidez avec des hypothèses vérifiables', [
      'Réunissez des comparables réellement proches de votre bien, des devis et votre calendrier personnel. Séparez les chiffres observés des hypothèses. Vous pourrez ensuite discuter du projet avec un gestionnaire en lui demandant les mêmes informations pour chaque scénario.',
      'Votre décision doit aussi tenir compte de votre tolérance au suivi quotidien et de votre organisation locale. Déléguer des tâches digitales peut alléger la courte durée, mais ne supprime pas les besoins de préparation et d’intervention dans le logement.',
    ], { links: [link(distance, 'Organiser une location à distance'), link(pillar, 'Le guide du propriétaire au Maroc')] })],
    [{ question: 'La courte durée est-elle toujours plus rentable ?', answer: 'Non. Comparez le résultat annuel après dépenses et examinez les hypothèses de disponibilité, de demande et de coûts.' }, { question: 'Peut-on comparer une nuitée à un loyer mensuel ?', answer: 'Pas directement. Il faut estimer les nuits réellement vendues et les frais pour comparer des résultats sur une même période.' }, { question: 'Quel modèle choisir si je vis à l’étranger ?', answer: 'La distance n’impose pas un modèle. Définissez votre besoin de stabilité, vos dates personnelles et les responsabilités locales puis digitales.' }],
    [pillar, profitability, costs, distance]),

  post(costs,
    'Quels sont les coûts d’une location courte durée au Maroc ?',
    'Coûts location courte durée Maroc : préparez votre budget',
    'Plateformes, ménage, linge, gestion et entretien : construisez le budget de votre location courte durée au Maroc et identifiez les dépenses souvent oubliées.',
    'Budget propriétaire',
    'Avant d’ouvrir votre calendrier, vous devez savoir quelles dépenses reviennent chaque mois et lesquelles dépendent des séjours. Cette liste vous aide à examiner les devis et à suivre vos encaissements sans confondre les frais payés par les voyageurs avec votre coût réel.',
    'Un budget utile distingue mise en place, charges fixes, coûts par séjour et dépenses exceptionnelles. Pour chaque ligne, indiquez le responsable du paiement et le justificatif attendu.',
    [section('mise-en-place', 'Préparez le budget de lancement', [
      'Le logement doit être prêt pour l’usage annoncé : couchages, linge, équipements, accès et informations pratiques. Faites la différence entre un achat nécessaire et un choix décoratif. Une photo attirante ne compense pas un équipement indispensable absent ou mal décrit.',
      'Prévoyez aussi la préparation de l’annonce et les vérifications administratives adaptées au logement. Gardez les factures et une liste d’équipements pour suivre les remplacements. Les dépenses de lancement doivent rester distinctes des charges d’exploitation mensuelles.',
    ], { links: [link('creer-annonce-airbnb-maroc', 'Préparer votre annonce')] }),
    section('recurrent', 'Identifiez les charges fixes et les coûts par séjour', [
      'Internet, certaines charges du logement et des abonnements peuvent continuer même sans réservation. Le ménage, le linge et les consommables varient plutôt avec le nombre de changements de voyageurs. Classez les dépenses selon leur fonctionnement réel dans votre bien.',
      'Deux calendriers comportant le même nombre de nuits vendues peuvent avoir des coûts différents si l’un accueille de nombreux séjours courts. Pour évaluer une promotion ou une durée minimale de séjour, intégrez ces dépenses au calcul.',
    ], { table: { caption: 'Une grille à compléter avec vos devis', headers: ['Type de coût', 'Exemples à vérifier', 'Donnée à relever'], rows: [['Lancement', 'Équipement, linge et préparation', 'Facture et durée d’usage prévue'], ['Fixe', 'Internet, abonnements, charges', 'Montant et périodicité'], ['Par séjour', 'Ménage et consommables', 'Coût par changement de voyageurs'], ['Exceptionnel', 'Panne ou remplacement', 'Budget et autorisation']] } }),
    section('plateformes', 'Séparez frais de plateforme et honoraires de gestion', [
      'Les frais d’une plateforme ne rémunèrent pas votre gestionnaire. Examinez les conditions de votre compte et les décomptes réellement appliqués, puis demandez une facture ou une explication distincte pour les honoraires de gestion. Évitez de compter deux fois un poste déjà déduit du versement.',
      'Pour le gestionnaire, demandez l’assiette de calcul, les prestations incluses et le traitement des annulations, remboursements ou frais de ménage. Un pourcentage sans base de calcul ne permet pas de comparer deux offres.',
    ], { links: [link('commission-airbnb-maroc', 'Comprendre les frais Airbnb'), link('prix-conciergerie-airbnb-maroc', 'Lire et comparer les devis de gestion')] }),
    section('menage', 'Vérifiez ce que couvrent le ménage et le linge', [
      'Demandez si le devis inclut la préparation des lits, le lavage, les consommables et un contrôle du logement. Précisez les conditions d’une intervention supplémentaire après un incident ou un séjour particulièrement salissant. Les coûts doivent correspondre aux tâches attendues.',
      'Les frais de ménage facturés au voyageur peuvent contribuer au budget mais ne prouvent pas que toutes les dépenses sont couvertes. Comparez le montant encaissé et les frais réellement supportés, avec le traitement prévu par la plateforme et le gestionnaire.',
    ]),
    section('suivi', 'Contrôlez votre budget tous les mois', [
      'Rapprochez chaque dépense de son justificatif et indiquez le séjour ou l’équipement concerné lorsque c’est possible. Signalez les achats ponctuels plutôt que de les masquer dans un coût moyen. Vous pourrez comprendre pourquoi un mois réservé produit un résultat plus faible.',
      'Faites déterminer les obligations fiscales et les assurances adaptées à votre activité. Pour votre tableau, gardez visibles les postes encore à confirmer. Une estimation qui ignore une dépense inconnue doit l’indiquer, pas présenter un résultat comme définitivement net.',
    ], { links: [link(profitability, 'Calculer un résultat après dépenses'), link('fiscalite-taxes-airbnb-maroc', 'Préparer les questions fiscales')] })],
    [{ question: 'Les frais de ménage couvrent-ils forcément le coût du prestataire ?', answer: 'Non. Comparez les sommes réellement encaissées aux coûts du ménage, du linge, des consommables et des contrôles.' }, { question: 'Une commission de gestion inclut-elle tous les frais ?', answer: 'Cela dépend du contrat. Demandez la liste des inclusions, exclusions et dépenses nécessitant votre accord.' }, { question: 'Comment comparer deux devis ?', answer: 'Utilisez un même scénario de séjours et une même base de recettes, puis comparez le coût total et les responsabilités.' }],
    [pillar, profitability, 'prix-conciergerie-airbnb-maroc', pricing]),

  post(pricing,
    'Comment fixer le prix de votre location courte durée au Maroc ?',
    'Prix location courte durée Maroc : ajuster votre tarif',
    'Fixez vos tarifs avec des logements comparables, vos coûts et la demande observée. Une méthode pour adapter le prix de votre location courte durée au Maroc.',
    'Tarification',
    'Votre prix doit tenir compte du logement, des dates et des voyageurs que vous pouvez réellement accueillir. Copier le tarif le plus élevé d’une annonce voisine donne un chiffre, mais pas une stratégie. Voici comment construire une base puis ajuster vos tarifs avec vos réservations.',
    'Le bon tarif s’évalue avec les nuits vendues, le revenu et les coûts. Le prix affiché par un concurrent ne prouve pas qu’il obtient ce montant.',
    [section('comparables', 'Choisissez des comparables vraiment proches de votre bien', [
      'Comparez la capacité, les couchages, l’accès, les équipements et le niveau de présentation. Un logement situé dans votre ville mais disposant d’un parking, d’un extérieur ou d’une autre capacité peut répondre à un besoin différent. Limitez les comparaisons générales qui gomment ces écarts.',
      'Consultez des dates et des durées de séjour identiques, puis examinez le prix total présenté au voyageur. Les frais et les conditions influencent la comparaison. Un tarif de nuitée isolé ne raconte pas le coût complet ni la demande réellement obtenue.',
    ]),
    section('couts', 'Intégrez vos coûts à vos décisions', [
      'Déterminez ce que coûte un séjour selon sa durée : ménage, consommables et frais éventuels ne varient pas tous par nuit. Une réduction pour remplir une seule nuit peut entraîner un changement de voyageurs qui rend l’opération moins intéressante.',
      'Votre prix minimal de travail doit découler de votre budget et de vos contraintes, pas d’un seuil universel trouvé en ligne. Faites apparaître les coûts encore inconnus. Révisez ensuite ce cadre lorsque vos factures et vos premiers séjours apportent de nouvelles informations.',
    ], { links: [link(costs, 'Établir votre budget de séjour')] }),
    section('demande', 'Adaptez les dates en fonction de signaux vérifiables', [
      'Observez le rythme des réservations et les délais avant l’arrivée. Identifiez les dates qui se vendent rapidement et celles qui restent libres. Un événement peut modifier la demande, mais vérifiez sa date et son lien avec votre logement avant d’en tirer une hausse de tarif.',
      'Gardez une trace des ajustements : dates concernées, ancien tarif, nouveau tarif et résultat observé. Lorsque plusieurs paramètres changent en même temps, l’interprétation devient plus difficile. Vous cherchez à apprendre de vos données, pas à rendre le calendrier constamment différent.',
    ]),
    section('conditions', 'Revoyez les conditions de séjour avec les prix', [
      'Les durées minimales, les jours d’arrivée autorisés et les dates bloquées peuvent limiter les réservations même si le tarif est adapté. Vérifiez ces paramètres avant d’attribuer une période vide au seul niveau de prix. Vos contraintes opérationnelles doivent rester respectées.',
      'Sur plusieurs plateformes, assurez-vous que les disponibilités et les conditions restent cohérentes. Le voyageur doit retrouver une offre compréhensible. Une différence de tarif peut être liée à des frais ou conditions différents ; elle doit être suivie dans votre décompte.',
    ], { links: [link(platforms, 'Coordonner Airbnb, Booking.com et Vrbo')] }),
    section('mesurer', 'Évaluez le résultat, pas seulement le taux d’occupation', [
      'Comparez le tarif réellement obtenu, les nuits disponibles, les nuits vendues et les dépenses sur la même période. Un calendrier rempli n’est pas un objectif suffisant si le revenu ne couvre pas correctement les coûts. Inversement, quelques nuits non vendues ne rendent pas automatiquement une stratégie mauvaise.',
      'Définissez à l’avance vos limites de prix et vos périodes personnelles avec la personne chargée des ajustements. Demandez un suivi expliquant les décisions importantes. Vous pourrez déléguer la tarification tout en gardant une visibilité sur la façon dont votre bien est commercialisé.',
    ], { links: [link(profitability, 'Mesurer votre résultat'), link(distance, 'Déléguer la gestion à distance')] })],
    [{ question: 'Dois-je appliquer le même prix tous les jours ?', answer: 'Ce choix dépend de vos dates, de votre budget et de la demande observée. Testez une organisation compréhensible et mesurez les résultats.' }, { question: 'Le tarif affiché par une autre annonce est-il une recette constatée ?', answer: 'Non. Il ne prouve ni la réservation ni le prix finalement obtenu. Utilisez les comparaisons comme des hypothèses à vérifier.' }, { question: 'Baisser le prix garantit-il une réservation ?', answer: 'Non. La disponibilité, les conditions, la présentation, les équipements et la demande peuvent aussi influencer la décision.' }],
    [pillar, profitability, costs, platforms]),

  post(platforms,
    'Airbnb, Booking.com ou Vrbo : quelles plateformes pour votre logement ?',
    'Airbnb, Booking.com ou Vrbo : comparatif propriétaire',
    'Comparez Airbnb, Booking.com et Vrbo côté propriétaire : frais à vérifier, calendrier, messages et organisation pour votre location courte durée au Maroc.',
    'Comparatifs',
    'Votre logement peut être présenté sur plusieurs plateformes. Pour choisir, partez de votre organisation et des conditions réellement proposées à votre compte. Multiplier les annonces sans coordonner les calendriers risque surtout de multiplier les problèmes à résoudre.',
    'Choisissez des canaux que vous pouvez suivre correctement. Les frais et les outils doivent être vérifiés dans les conditions de votre compte, pas déduits d’un pourcentage supposé universel.',
    [section('criteres', 'Comparez les mêmes questions pour chaque plateforme', [
      'Avant de publier, examinez les conditions d’inscription, les frais, les paiements, les annulations et les règles relatives à votre logement. Demandez qui traite une réclamation et quelles informations le voyageur reçoit avant son arrivée. Ces éléments doivent entrer dans votre choix.',
      'Ne concluez pas qu’une plateforme est la meilleure pour tout le Maroc sans données de votre bien. Vous pouvez commencer avec un canal, observer les réservations puis décider si un autre apporte une valeur compatible avec votre organisation.',
    ], { table: { caption: 'Grille de comparaison à compléter avec vos conditions de compte', headers: ['Point à vérifier', 'Airbnb', 'Booking.com', 'Vrbo'], rows: [['Frais et base de calcul', 'Conditions du compte', 'Contrat partenaire', 'Conditions du compte'], ['Paiement et annulation', 'Paramètres de l’annonce', 'Paramètres de l’établissement', 'Paramètres de l’annonce'], ['Calendrier', 'Connexions et contrôles', 'Outils disponibles pour le bien', 'Connexions et contrôles'], ['Responsabilités', 'Accès et missions délégués', 'Utilisateurs et missions délégués', 'Accès et missions délégués']] } }),
    section('annonce', 'Gardez une description cohérente de votre logement', [
      'La capacité, les couchages, les équipements et les règles doivent correspondre à la réalité sur chaque canal. Un changement dans le logement doit être répercuté sur toutes les annonces concernées. Conservez une fiche de référence pour éviter les versions contradictoires.',
      'Adaptez les champs et la présentation aux outils de la plateforme sans ajouter de services indisponibles. La clarté des consignes compte davantage qu’une promesse excessive. Vérifiez aussi les prix totaux, les frais et les conditions présentés au voyageur.',
    ], { links: [link('creer-annonce-airbnb-maroc', 'Préparer une annonce fidèle au logement')] }),
    section('calendrier', 'Vérifiez les connexions avant d’ouvrir plusieurs calendriers', [
      'Les outils d’import ou de connexion de calendrier demandent une configuration et des contrôles. Vrbo documente notamment l’importation des réservations et dates bloquées d’un calendrier externe. Vérifiez les conditions actuelles de chaque plateforme et de l’outil que vous utilisez.',
      'Ne considérez pas une connexion comme la garantie d’une mise à jour instantanée. Contrôlez les dates bloquées, les annulations et les séjours modifiés. Prévoyez une procédure pour interrompre la vente si vous constatez un problème de disponibilité.',
    ], { sources: ['vrboCalendar', 'airbnbCalendar'] }),
    section('messages', 'Suivez les messages dans leur contexte de réservation', [
      'Une confirmation de séjour doit être rapprochée de la bonne plateforme, du bon logement et des bons horaires. Vous devez savoir où répondre, où retrouver les conditions et qui transmet les informations au prestataire local. Les échanges importants doivent rester accessibles.',
      'Préparez des consignes d’arrivée précises et révisables. Un message automatisé ne doit pas transmettre un code périmé ou annoncer une remise de clés que personne n’assure. Organisez aussi la reprise manuelle lorsqu’une demande sort du cas habituel.',
    ]),
    section('resultat', 'Mesurez l’utilité de chaque canal', [
      'Pour chaque plateforme, suivez les séjours obtenus, les annulations, les frais réellement appliqués et le travail nécessaire. Comparez un résultat après dépenses plutôt que le seul nombre de réservations. Un canal supplémentaire peut être utile sans devenir le principal.',
      'Lorsqu’un gestionnaire coordonne les plateformes, définissez les accès, le calendrier de référence et les validations de prix. Vous devez pouvoir comprendre les changements et récupérer les informations en fin de mission.',
    ], { links: [link(distance, 'Organiser la gestion à distance'), link(profitability, 'Comparer les recettes et les coûts')] })],
    [{ question: 'Faut-il être sur les trois plateformes ?', answer: 'Non. Commencez avec une organisation maîtrisée puis examinez l’intérêt d’un autre canal pour votre logement.' }, { question: 'Une connexion de calendrier évite-t-elle tous les conflits ?', answer: 'Elle demande des contrôles et une procédure en cas d’anomalie. Vérifiez les délais et les limites des outils utilisés.' }, { question: 'Existe-t-il un tarif de commission identique pour tous les comptes ?', answer: 'Ne partez pas de cette hypothèse. Consultez les conditions et les décomptes réellement appliqués à votre compte.' }],
    [pillar, distance, pricing, 'commission-airbnb-maroc']),

  post('gestion-location-courte-duree-maroc',
    'Comment gérer votre location courte durée au Maroc ?',
    'Gestion location courte durée Maroc : méthode propriétaire',
    'Organisez votre location courte durée au Maroc, de l’annonce au départ des voyageurs : réservations, ménage, accès, incidents et suivi des dépenses.',
    'Gestion quotidienne',
    'La gestion ne commence pas avec le premier message d’un voyageur. Elle commence par une organisation qui relie votre annonce, votre calendrier et la préparation du logement. Voici les étapes à mettre en place pour suivre les séjours sans improviser chaque arrivée.',
    'Chaque réservation doit déclencher une suite de tâches clairement attribuées. La gestion digitale et la préparation locale doivent partager les mêmes informations.',
    [section('preparation', 'Vérifiez le logement et ses informations', [
      'Contrôlez les équipements, les accès et les consignes avant de publier. Faites confirmer les démarches applicables à votre logement et examinez les règles de l’immeuble. Une réservation acceptée doit correspondre à un hébergement réellement prêt et disponible.',
      'Créez une fiche de référence : capacité, couchages, équipements, horaires, règles et contacts utiles. Elle vous servira pour l’annonce et les messages. Mettez-la à jour lorsqu’un équipement ou un dispositif d’accès change.',
    ], { links: [link(pillar, 'Préparer le projet de location'), link('creer-annonce-airbnb-maroc', 'Créer votre annonce')] }),
    section('reservation', 'À chaque réservation, contrôlez les dates et les besoins', [
      'Vérifiez les dates, les voyageurs annoncés et les conditions du séjour. Coordonnez ensuite le calendrier et informez la personne chargée de préparer le logement. Les informations doivent être disponibles avant le changement de voyageurs, pas seulement quelques minutes avant l’arrivée.',
      'Documentez les demandes particulières et ce qui a été accepté. Une arrivée plus tôt peut nécessiter une modification de préparation. Ne promettez pas un service supplémentaire avant d’avoir confirmé qui le réalise et à quelles conditions.',
    ], { links: [link(platforms, 'Coordonner plusieurs plateformes')] }),
    section('arrivee', 'Préparez l’arrivée et vérifiez le ménage', [
      'Transmettez une adresse et un parcours d’accès compréhensibles. Confirmez la solution de remise des clés ou d’accès prévue. Précisez comment le voyageur obtient de l’aide lorsqu’il n’arrive pas à entrer, y compris si l’intervenant habituel est absent.',
      'Une préparation confirmée doit couvrir le linge, les équipements essentiels et les éventuels problèmes signalés au départ précédent. Définissez une checklist adaptée au logement et une manière de confirmer son exécution. La qualité attendue doit être claire pour le prestataire local.',
    ]),
    section('incident', 'Traitez les incidents avec une procédure simple', [
      'Classez la demande : information manquante, problème d’accès, panne ou situation nécessitant une intervention immédiate. Identifiez le contact compétent et gardez une trace de ce qui a été signalé, décidé et réalisé. Une réponse rapide doit aussi être exacte.',
      'Fixez les limites de dépense et les cas où votre accord est requis. Après l’intervention, contrôlez que l’information a été transmise au voyageur et mise à jour dans les consignes si nécessaire. Une solution ponctuelle peut révéler un équipement à remplacer.',
    ]),
    section('depart', 'Reliez le départ au séjour suivant et au suivi mensuel', [
      'Confirmez les modalités de départ et l’état du logement selon la procédure convenue. Transmettez les besoins de préparation au prochain intervenant. Suivez les remarques des voyageurs pour corriger les problèmes récurrents plutôt que répéter la même réponse.',
      'En fin de mois, rapprochez réservations, recettes et dépenses. Listez les interventions et les décisions à prendre. Si vous déléguez, demandez un compte rendu qui permet de comprendre les résultats et les responsabilités.',
    ], { links: [link(distance, 'Déléguer lorsque vous êtes à distance'), link(costs, 'Suivre les dépenses d’exploitation')] })],
    [{ question: 'Quelles tâches peuvent être gérées en ligne ?', answer: 'Les annonces, tarifs, messages, réservations et calendriers peuvent être suivis à distance selon les accès et la mission. Le logement nécessite aussi une organisation locale.' }, { question: 'Que préparer avant la première arrivée ?', answer: 'Vérifiez la disponibilité, les équipements, les consignes, les démarches applicables et les responsables des clés et du ménage.' }, { question: 'Comment limiter les imprévus ?', answer: 'Préparez une checklist, un contact de remplacement et des règles pour les dépenses et incidents. Vous pouvez améliorer ces procédures avec les situations rencontrées.' }],
    [pillar, distance, platforms, costs]),
];

export const ownerClusterPillarSlug = pillar;

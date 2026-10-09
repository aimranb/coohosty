import type { BlogPost } from './blog';

const dates = { published: '2026-10-09', modified: '2026-10-09' };
const cohostGuide = { label: 'Airbnb : organiser le travail avec un co-hôte', href: 'https://www.airbnb.fr/help/article/1549' };

export const conciergerieBlogPosts: BlogPost[] = [
  {
    ...dates,
    slug: 'conciergerie-airbnb-maroc',
    title: 'Conciergerie Airbnb au Maroc : services, fonctionnement et budget',
    seoTitle: 'Conciergerie Airbnb Maroc : services et budget',
    description: 'Comprenez les services d’une conciergerie Airbnb au Maroc, les frais à comparer et les responsabilités à définir avant de confier votre logement.',
    category: 'Gestion locative',
    intro: 'Vous possédez un appartement au Maroc et souhaitez accueillir des voyageurs sans organiser seul chaque séjour ? Une conciergerie Airbnb peut prendre en charge une partie du travail, de l’annonce à la coordination de l’accueil. Mais le mot « conciergerie » ne décrit pas un périmètre identique chez tous les prestataires. Ce guide vous aide à distinguer les services utiles, les coûts et les décisions qui restent entre vos mains.',
    takeaway: 'Choisissez une organisation adaptée à votre logement et à votre disponibilité. Comparez les prestations réellement incluses, le revenu après charges et la qualité du suivi, plutôt qu’une promesse de remplissage.',
    sections: [
      {
        id: 'definition', title: 'Qu’est-ce qu’une conciergerie Airbnb ?',
        paragraphs: ['Une conciergerie de location courte durée accompagne le propriétaire dans la préparation du logement et le déroulement des séjours. Selon l’accord, elle intervient sur l’annonce, le calendrier, les échanges avec les voyageurs ou les opérations sur place. Elle peut travailler comme co-hôte sur Airbnb, mais ce rôle sur la plateforme et le contrat de prestation sont deux éléments distincts.', 'Une prestation de conciergerie privée ou de luxe peut aussi concerner des courses, des réservations ou des demandes personnelles. Pour votre location, partez des besoins concrets : accueillir, nettoyer, entretenir et suivre l’activité. Un intitulé commercial ne suffit pas à savoir qui fera chaque tâche.'],
        links: [cohostGuide, { label: 'Comprendre Airbnb au Maroc avant de se lancer', href: '/fr/blog/airbnb-maroc-definition' }],
      },
      {
        id: 'services', title: 'Quels services demander pour votre logement ?',
        paragraphs: ['Commencez par le parcours d’une réservation : un voyageur découvre l’annonce, pose une question, réserve, arrive, utilise le logement et repart. Identifiez les moments où vous avez besoin d’aide. Une réponse rapide ne remplace pas une intervention locale lorsque la serrure bloque ou que le logement n’est pas prêt.', 'Demandez une liste écrite des prestations, de leur fréquence et des éventuelles exclusions. La photographie, le remplacement du linge, les achats de consommables ou les réparations peuvent relever de devis séparés. Faites également préciser qui contrôle le résultat après le ménage.'],
        table: { headers: ['Étape', 'Prestations à préciser', 'Point de contrôle'], rows: [['Avant publication', 'Photos, description, équipements, règles', 'Une annonce fidèle au logement'], ['Avant le séjour', 'Messages, calendrier, instructions', 'Une arrivée préparée et des dates fiables'], ['Entre deux séjours', 'Ménage, linge, contrôle du logement', 'Un responsable et une preuve de passage'], ['Pendant le séjour', 'Assistance et coordination des incidents', 'Des horaires et un circuit d’escalade'], ['Chaque mois', 'Compte rendu, dépenses, suivi des résultats', 'Des montants rapprochés des versements']], caption: 'Exemples de tâches à négocier : leur présence dans ce tableau ne signifie pas qu’elles sont incluses dans toutes les offres.' },
        links: [{ label: 'Découvrir l’accompagnement COHOST', href: '/fr/services/cohost' }],
      },
      {
        id: 'fonctionnement', title: 'Comment démarrer une gestion avec une conciergerie ?',
        paragraphs: ['Préparez une visite du logement, un inventaire, les consignes d’accès et vos dates personnelles. Définissez vos objectifs : limiter le temps passé, mieux organiser les séjours ou clarifier le suivi financier. Fixez ensuite qui peut modifier les prix, ouvrir des dates et engager une dépense.', 'Avant le premier séjour, testez le parcours complet : message d’arrivée, accès, Wi-Fi, eau chaude et contact en cas de problème. Accordez-vous sur le format du compte rendu et les conditions de fin de mission. Les recommandations Airbnb pour les co-hôtes insistent notamment sur la répartition des responsabilités et l’accord concernant les dépenses.'],
        links: [cohostGuide, { label: 'Préparer une annonce Airbnb au Maroc', href: '/fr/blog/creer-annonce-airbnb-maroc' }],
      },
      {
        id: 'budget', title: 'Combien coûte une conciergerie Airbnb au Maroc ?',
        paragraphs: ['Le prix dépend du logement, de son emplacement, des opérations confiées et du modèle de facturation. Un devis peut prévoir une commission, un forfait ou des frais par intervention. Demandez toujours la base de calcul : montant des réservations, somme après frais de plateforme, inclusion ou exclusion du ménage et traitement des remboursements.', 'La facture de conciergerie et les frais de service Airbnb ne correspondent pas à la même prestation. Comparez un budget complet incluant ménage, linge, consommables, maintenance et charges du logement. Les tarifs COOHOSTY sont sur devis : une simulation doit partir de votre situation, sans transformer une hypothèse de revenus en garantie.'],
        sources: ['fees', 'payout'],
        links: [{ label: 'Distinguer les commissions et frais Airbnb', href: '/fr/blog/commission-airbnb-maroc' }],
      },
      {
        id: 'gestion-locale', title: 'Pourquoi l’organisation locale compte autant que la ville ?',
        paragraphs: ['À Casablanca comme à Marrakech, un prestataire doit pouvoir expliquer comment il intervient dans votre quartier. Demandez qui remet les clés, qui contrôle le ménage et qui se déplace lorsqu’un équipement tombe en panne. La présence d’une ville sur une brochure ne prouve pas à elle seule cette capacité.', 'Si vous vivez à l’étranger, ajoutez un suivi des interventions et un seuil d’autorisation pour les achats. Si vous utilisez régulièrement le logement, prévoyez un calendrier qui protège vos dates personnelles. Ces règles permettent d’évaluer un service à partir de faits observables.'],
        links: [{ label: 'Conciergerie Airbnb à Casablanca : les points à vérifier', href: '/fr/blog/conciergerie-airbnb-casablanca' }, { label: 'Conciergerie Airbnb à Marrakech : organiser la gestion', href: '/fr/blog/conciergerie-airbnb-marrakech' }],
      },
      {
        id: 'choisir', title: 'Quels points vérifier avant de confier les clés ?',
        paragraphs: ['Demandez un exemple de compte rendu, un devis détaillé et les modalités d’accès à votre annonce. Vérifiez comment seront récupérés les clés, les documents et les informations à la fin de la mission. Une relation claire doit permettre de comprendre les résultats et de poser des questions sur les dépenses.', 'Le recours à une conciergerie ne suffit pas à déterminer la situation administrative ou fiscale de votre logement. Identifiez les démarches à confirmer auprès des services compétents et précisez qui vous aide à les organiser. Pour choisir votre niveau d’accompagnement, vous pouvez commencer par un audit de l’annonce, puis définir les opérations à déléguer.'],
        links: [{ label: 'Comparer les sociétés de conciergerie', href: '/fr/blog/choisir-societe-conciergerie-maroc' }, { label: 'Faire auditer votre annonce', href: '/fr/services/audit' }, { label: 'Préparer les questions fiscales de votre location', href: '/fr/blog/fiscalite-taxes-airbnb-maroc' }],
      },
    ],
    faq: [
      { question: 'Une conciergerie gère-t-elle forcément le ménage ?', answer: 'Cela dépend du contrat. Demandez si elle réalise le ménage, le coordonne ou le laisse à votre charge, et comment sont facturés le linge et les contrôles.' },
      { question: 'Puis-je garder des dates pour mon usage personnel ?', answer: 'Oui, si cette organisation est prévue avec le prestataire. Bloquez les dates à l’avance et définissez qui peut modifier le calendrier.' },
      { question: 'Conciergerie et co-hôte Airbnb désignent-ils la même chose ?', answer: 'Une conciergerie fournit des services convenus par contrat. Le rôle de co-hôte correspond à une collaboration et à des accès sur Airbnb. Les deux peuvent se combiner, mais leur périmètre doit être précisé séparément.' },
      { question: 'Une conciergerie garantit-elle un revenu mensuel ?', answer: 'Une estimation dépend des hypothèses retenues et ne constitue pas une garantie. Si une offre comporte une garantie contractuelle, examinez précisément ses conditions, exclusions et contreparties.' },
    ],
    related: ['choisir-societe-conciergerie-maroc', 'conciergerie-ou-gestion-autonome-airbnb-maroc', 'conciergerie-airbnb-casablanca'],
  },
  {
    ...dates,
    slug: 'choisir-societe-conciergerie-maroc',
    title: 'Comment choisir une société de conciergerie au Maroc ?',
    seoTitle: 'Choisir une société de conciergerie au Maroc',
    description: 'Comparez les sociétés de conciergerie au Maroc : devis, présence locale, contrat, dépenses et suivi. Une checklist pratique pour les propriétaires.',
    category: 'Conseils propriétaires',
    intro: 'Deux sociétés de conciergerie peuvent annoncer une gestion complète et proposer des services très différents. Pour choisir un partenaire au Maroc, vous avez besoin d’une méthode de comparaison adaptée à votre logement. Voici les questions à poser pendant le premier échange, les documents à demander et les points à clarifier avant de signer.',
    takeaway: 'Comparez plusieurs offres sur le même périmètre. Retenez un partenaire qui explique ses opérations, ses coûts et ses responsabilités avec des exemples vérifiables.',
    sections: [
      {
        id: 'besoins', title: 'Décrire vos besoins avant de demander un devis',
        paragraphs: ['Notez l’adresse du bien, sa capacité, ses équipements, les contraintes d’accès et la fréquence à laquelle vous voulez l’utiliser. Indiquez si une annonce existe déjà, si quelqu’un assure le ménage et si vous disposez d’un contact local. Ces informations permettent d’éviter un devis générique qui laisse de côté les difficultés réelles.', 'Classez ensuite les tâches en trois groupes : celles que vous gardez, celles que vous souhaitez déléguer et celles qui demandent une décision partagée. Par exemple, vous pouvez conserver le suivi des dépenses tout en confiant les messages et les arrivées. Votre besoin doit guider le choix de la formule.'],
        links: [{ label: 'Les services d’une conciergerie Airbnb au Maroc', href: '/fr/blog/conciergerie-airbnb-maroc' }],
      },
      {
        id: 'presence', title: 'Vérifier l’organisation dans votre quartier',
        paragraphs: ['Demandez qui interviendra sur place, comment sont organisés les remplacements et quelles plages horaires sont couvertes. Posez une situation concrète : un voyageur arrive tard et ne parvient pas à ouvrir la porte. Vous devez comprendre le chemin entre son message, la réponse et une éventuelle intervention.', 'Demandez également comment le prestataire contrôle un logement après le départ. Un exemple anonymisé de checklist ou de compte rendu est plus utile qu’une formule comme « qualité premium ». Pour des références clients, privilégiez des échanges autorisés par les personnes concernées et des logements comparables au vôtre.'],
        bullets: ['Qui possède un double des clés et comment est-il conservé ?', 'Qui remplace un intervenant absent ?', 'Qui vérifie le ménage avant l’arrivée suivante ?', 'Comment les incidents sont-ils signalés au propriétaire ?'],
      },
      {
        id: 'devis', title: 'Comparer les devis ligne par ligne',
        paragraphs: ['Faites chiffrer les mêmes prestations chez chaque société. Une commission plus basse peut s’accompagner de frais de lancement, d’interventions facturées séparément ou d’un minimum mensuel. À l’inverse, un tarif plus élevé peut inclure des opérations dont vous avez réellement besoin.', 'Pour une rémunération proportionnelle, demandez une simulation de facture sur une même réservation fictive. Faites préciser le traitement du ménage, des frais de plateforme, des remises et des remboursements. Vérifiez également les taxes figurant sur le devis et les pièces justificatives remises pour les dépenses.'],
        table: { headers: ['Point à comparer', 'Question à poser'], rows: [['Mise en place', 'Photos, inventaire et préparation sont-ils inclus ?'], ['Rémunération', 'Quel taux ou forfait, appliqué à quelle base ?'], ['Opérations', 'Quels frais pour ménage, linge et déplacements ?'], ['Maintenance', 'Quel budget nécessite mon accord préalable ?'], ['Suivi', 'Quelles données et justificatifs recevrai-je ?'], ['Fin du contrat', 'Quel préavis et quels frais éventuels ?']], caption: 'Utilisez les mêmes questions pour chaque offre afin de comparer un périmètre équivalent.' },
        sources: ['fees'],
        links: [{ label: 'Comprendre les frais de la plateforme Airbnb', href: '/fr/blog/commission-airbnb-maroc' }],
      },
      {
        id: 'contrat', title: 'Clarifier les responsabilités dans le contrat',
        paragraphs: ['Faites préciser le périmètre de la mission, la durée, les modalités de résiliation et la restitution des clés. Ajoutez les règles concernant vos dates personnelles, les achats, les interventions urgentes et les décisions sur le calendrier. Pour les formalités liées aux voyageurs, identifiez exactement le rôle de chaque partie.', 'Vérifiez les accès accordés sur la plateforme et le suivi des paiements. Ne transmettez pas votre mot de passe comme seule méthode de collaboration : discutez des accès adaptés au travail convenu. Si un partage de versements Airbnb est proposé, contrôlez son éligibilité et sa configuration dans vos comptes ; Airbnb prévoit des conditions et des limitations régionales.'],
        links: [cohostGuide, { label: 'Airbnb : fonctionnement et conditions des versements de co-hôte', href: 'https://www.airbnb.fr/help/article/3389' }, { label: 'Organiser les formalités d’accueil au Maroc', href: '/fr/blog/fiche-de-police-airbnb-maroc' }],
      },
      {
        id: 'indicateurs', title: 'Demander un suivi qui permet de décider',
        paragraphs: ['Le nombre de nuits réservées n’explique pas à lui seul la performance. Demandez un suivi des dates disponibles, des recettes, des frais et du revenu après charges suivies. Les nuits bloquées pour votre usage doivent être distinguées des nuits proposées à la réservation.', 'Définissez une fréquence de bilan et des critères opérationnels : incidents, qualité des informations transmises, dépenses documentées et points à améliorer. Une estimation initiale doit présenter ses hypothèses. Un revenu passé sur un autre logement ne garantit pas le même résultat pour le vôtre.'],
        links: [{ label: 'Découvrir le suivi et l’optimisation de l’annonce', href: '/fr/services/optimize' }],
      },
      {
        id: 'decision', title: 'Préparer une décision et un démarrage progressif',
        paragraphs: ['Après les échanges, rédigez une comparaison sur une page : opérations incluses, coût complet, présence locale et modalités de suivi. Relevez les réponses encore vagues et demandez qu’elles soient clarifiées par écrit. Une offre lisible permet d’anticiper une collaboration ; elle ne remplace pas la vérification du prestataire.', 'Pour démarrer, validez l’inventaire, les accès et les premières dates ouvertes. Prévoyez un bilan après les premiers séjours pour ajuster les consignes. COOHOSTY propose un accompagnement sur devis : exposez votre situation et demandez le périmètre précis adapté à votre logement.'],
        links: [{ label: 'Présenter votre projet à COOHOSTY', href: '/fr#contact' }, { label: 'Comparer délégation et gestion autonome', href: '/fr/blog/conciergerie-ou-gestion-autonome-airbnb-maroc' }],
      },
    ],
    faq: [
      { question: 'Faut-il choisir la conciergerie la moins chère ?', answer: 'Comparez d’abord les prestations et le coût complet. Une différence de tarif peut refléter des opérations incluses ou des frais supplémentaires importants pour votre logement.' },
      { question: 'Quels documents demander avant de signer ?', answer: 'Demandez un devis détaillé, le contrat, les informations d’identification du prestataire et un exemple anonymisé de suivi. Clarifiez les justificatifs utiles à votre situation et les modalités de facturation.' },
      { question: 'Peut-on changer de conciergerie ?', answer: 'Les possibilités dépendent du contrat. Avant de vous engager, vérifiez le préavis, les réservations en cours, les éventuels frais et la récupération des accès, clés et documents.' },
      { question: 'Comment évaluer une conciergerie à distance ?', answer: 'Demandez un interlocuteur identifié, un suivi des opérations et des dépenses, et des procédures d’intervention précises. Une visite préparatoire par une personne de confiance peut compléter ces vérifications.' },
    ],
    related: ['conciergerie-airbnb-maroc', 'conciergerie-ou-gestion-autonome-airbnb-maroc', 'conciergerie-airbnb-marrakech'],
  },
  {
    ...dates,
    slug: 'conciergerie-ou-gestion-autonome-airbnb-maroc',
    title: 'Conciergerie Airbnb ou gestion autonome au Maroc : comment choisir ?',
    seoTitle: 'Airbnb Maroc : conciergerie ou gestion autonome ?',
    description: 'Temps, coûts, proximité et revenu après charges : comparez conciergerie Airbnb et gestion autonome au Maroc avec une méthode et un exemple chiffré.',
    category: 'Organisation & budget',
    intro: 'Gérer vous-même votre location Airbnb au Maroc vous donne une grande autonomie, mais demande du temps et une organisation fiable. Déléguer à une conciergerie peut répondre à certaines contraintes, avec un coût et un suivi à prévoir. Pour décider, comparez votre disponibilité, les besoins sur place et le revenu après charges plutôt que les seules recettes des réservations.',
    takeaway: 'Le bon choix dépend de votre logement et de votre capacité à tenir les opérations dans la durée. Évaluez aussi une solution partagée, où vous gardez certaines décisions et déléguez les tâches les plus difficiles à assurer.',
    sections: [
      {
        id: 'temps', title: 'Mesurer le travail derrière chaque séjour',
        paragraphs: ['Une réservation entraîne des messages, une préparation, une arrivée, un départ et une remise en état. À ces opérations s’ajoutent les mises à jour de l’annonce, les achats et les incidents. Pour mesurer votre disponibilité, listez les tâches réellement effectuées sur plusieurs séjours plutôt que d’estimer uniquement le temps de remise des clés.', 'Si vous travaillez à plein temps ou vivez loin du logement, identifiez les périodes pendant lesquelles vous ne pouvez pas répondre ou vous déplacer. Une personne de secours doit connaître le bien, les accès et les limites de son intervention. Sans cette organisation, une tâche simple peut devenir difficile au mauvais moment.'],
        bullets: ['Temps consacré aux messages et aux changements de réservation.', 'Coordination du ménage, du linge et des contrôles.', 'Déplacements, achats et maintenance.', 'Suivi des dépenses, des versements et du calendrier.'],
      },
      {
        id: 'comparaison', title: 'Comparer les deux modes de gestion',
        paragraphs: ['La gestion autonome convient lorsque vous pouvez assurer les opérations ou coordonner un réseau local fiable. Elle vous laisse choisir vos méthodes, mais vous demande de les documenter pour les absences. Une conciergerie peut reprendre certaines tâches, à condition que sa prestation soit précisément définie.', 'Dans les deux cas, le propriétaire doit suivre les dépenses et comprendre les décisions prises. La délégation demande donc un temps de contrôle : lire les bilans, donner les accords nécessaires et ajuster les objectifs. Comparez une organisation complète avec une autre organisation complète.'],
        table: { headers: ['Critère', 'Gestion autonome', 'Conciergerie'], rows: [['Messages voyageurs', 'Vous répondez ou organisez un relais', 'Selon horaires et mission convenus'], ['Interventions locales', 'Votre présence ou vos prestataires', 'Capacité locale à vérifier'], ['Coûts de gestion', 'Dépenses directes et votre temps', 'Honoraires et dépenses selon contrat'], ['Décisions', 'Vous définissez les réglages', 'Règles de délégation à écrire'], ['Suivi', 'Vous réunissez les informations', 'Bilan à demander et à contrôler']], caption: 'Une comparaison des responsabilités : aucune formule ne garantit une occupation ou un revenu.' },
        links: [{ label: 'Comprendre le périmètre d’une conciergerie Airbnb', href: '/fr/blog/conciergerie-airbnb-maroc' }],
      },
      {
        id: 'calcul', title: 'Raisonner en revenu après charges : un exemple en dirhams',
        paragraphs: ['Prenons une hypothèse pédagogique pour un mois : 10 000 MAD de recettes, 1 200 MAD de frais de plateforme et 2 000 MAD de dépenses de fonctionnement identiques dans les deux options. Une prestation de gestion fictive coûte 1 500 MAD. Ces montants ne sont ni un tarif COOHOSTY, ni une prévision, ni un barème Airbnb.', 'Dans cet exemple, le solde est de 6 800 MAD en gestion autonome et de 5 300 MAD avec la prestation. Il reste à déduire les autres charges de votre situation, notamment celles du bien et la fiscalité applicable. Le calcul ne valorise pas votre temps : il sert à rendre visible le coût de la délégation à recettes égales.'],
        table: { headers: ['Hypothèse mensuelle', 'Autonome', 'Avec prestation fictive'], rows: [['Recettes', '10 000 MAD', '10 000 MAD'], ['Frais de plateforme supposés', '−1 200 MAD', '−1 200 MAD'], ['Fonctionnement supposé', '−2 000 MAD', '−2 000 MAD'], ['Prestation de gestion supposée', '0 MAD', '−1 500 MAD'], ['Solde avant autres charges et impôts', '6 800 MAD', '5 300 MAD']], caption: 'Exemple fictif à recettes égales. Remplacez chaque montant par vos données et le devis réel ; le coût de votre temps est exclu.' },
        sources: ['fees', 'payout'],
        links: [{ label: 'Comprendre le versement Airbnb et les commissions', href: '/fr/blog/commission-airbnb-maroc' }],
      },
      {
        id: 'scenarios', title: 'Tester plusieurs scénarios avant de décider',
        paragraphs: ['Refaites votre budget avec moins de nuits réservées, une dépense imprévue et davantage de rotations. Ces variations permettent de voir comment les frais fixes, les interventions et la rémunération du prestataire affectent votre solde. Elles doivent rester des hypothèses explicites.', 'Si une société annonce une hausse de revenus, demandez sa méthode de calcul, les dates disponibles retenues et les coûts supplémentaires associés. Des recettes plus élevées peuvent nécessiter davantage de ménage ou d’entretien. La comparaison utile porte sur le résultat après dépenses et la qualité d’exploitation.'],
        links: [{ label: 'Faire analyser votre annonce et ses points d’amélioration', href: '/fr/services/audit' }],
      },
      {
        id: 'partage', title: 'Envisager une gestion partagée',
        paragraphs: ['Vous pouvez conserver certains volets et déléguer les autres. Un propriétaire proche du logement peut gérer les interventions et demander un accompagnement sur les prix. Un propriétaire à l’étranger peut garder le contrôle du budget tout en confiant les échanges et l’organisation locale.', 'Écrivez les frontières entre les rôles : qui répond, qui valide une dépense et qui contrôle le calendrier. Évitez de confier la même tâche à deux personnes sans coordination. Les conseils Airbnb pour les co-hôtes recommandent notamment une répartition claire des responsabilités et des échanges réguliers.'],
        links: [cohostGuide, { label: 'Découvrir l’accompagnement à l’optimisation', href: '/fr/services/optimize' }, { label: 'Découvrir l’accompagnement COHOST', href: '/fr/services/cohost' }],
      },
      {
        id: 'decision', title: 'Choisir à partir de votre situation réelle',
        paragraphs: ['Si vous pouvez être présent, disposez de relais fiables et souhaitez apprendre la gestion, l’autonomie peut être cohérente. Si vos absences ou votre disponibilité rendent l’exploitation fragile, examinez une délégation sur les tâches concernées. Dans les deux cas, les démarches du logement doivent être vérifiées indépendamment du mode de gestion.', 'Avant de vous engager, réunissez votre budget, votre calendrier personnel et les tâches à couvrir. Demandez un devis au périmètre clair, puis comparez-le à votre organisation actuelle. Un bilan après les premiers séjours permettra d’ajuster les consignes sans perdre de vue vos objectifs.'],
        links: [{ label: 'La checklist pour choisir une société de conciergerie', href: '/fr/blog/choisir-societe-conciergerie-maroc' }, { label: 'Discuter de votre projet avec COOHOSTY', href: '/fr#contact' }],
      },
    ],
    faq: [
      { question: 'La gestion autonome coûte-t-elle moins cher ?', answer: 'Elle évite des honoraires de gestion, mais conserve les dépenses d’exploitation et mobilise votre temps. Faites un calcul complet adapté au logement et aux tâches que vous devrez financer.' },
      { question: 'Une conciergerie augmente-t-elle forcément les revenus ?', answer: 'Non. Une organisation mieux adaptée peut aider votre exploitation, mais les résultats dépendent du logement, des disponibilités, des coûts et de la demande. Une estimation ne garantit pas un résultat.' },
      { question: 'Puis-je déléguer uniquement une partie de la gestion ?', answer: 'C’est possible si le prestataire propose ce périmètre. Écrivez précisément les tâches de chacun et la façon dont seront prises les décisions communes.' },
      { question: 'Que prévoir si je gère depuis l’étranger ?', answer: 'Prévoyez un contact local fiable, une procédure d’accès, un relais pour les incidents et un suivi des dépenses. Vérifiez aussi qui réalise et contrôle le ménage entre les séjours.' },
    ],
    related: ['conciergerie-airbnb-maroc', 'choisir-societe-conciergerie-maroc', 'creer-annonce-airbnb-maroc'],
  },
];

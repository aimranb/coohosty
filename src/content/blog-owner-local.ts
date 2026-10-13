import type { BlogPost, BlogSection } from './blog';

const dates = { published: '2026-10-13', modified: '2026-10-13' };
const link = (slug: string, label: string) => ({ label, href: `/fr/blog/${slug}` });
const s = (id: string, title: string, paragraphs: string[], extra: Partial<BlogSection> = {}): BlogSection => ({ id, title, paragraphs, ...extra });
const localScope = s('coohosty', 'Votre gestion digitale avec COOHOSTY', [
  'Nous accompagnons les propriétaires dans la gestion digitale de leurs locations courte durée dans tout le Maroc. Les annonces, les tarifs, les messages et les calendriers peuvent entrer dans la mission définie avec vous. Présentez-nous votre logement et les tâches que vous souhaitez déléguer.',
  'La gestion physique complète est proposée à Meknès. À Casablanca et Marrakech comme dans les autres villes, le ménage, les clés et les interventions nécessitent une organisation locale prévue séparément. Notre offre digitale ne constitue pas une promesse d’équipes physiques dans votre quartier.',
], { links: [{ label: 'Analyser mon bien', href: '/fr#estimate' }] });
function guide(slug: string, title: string, seoTitle: string, description: string, category: string, intro: string, takeaway: string, sections: BlogSection[], faq: BlogPost['faq'], related: string[]): BlogPost {
  return { ...dates, slug, title, seoTitle, description, category, intro, takeaway, sections, faq, related, status: 'published' };
}

export const ownerLocalPosts: BlogPost[] = [
  guide('location-courte-duree-casablanca',
    'Location courte durée à Casablanca : évaluer votre bien et organiser sa gestion',
    'Location courte durée Casablanca : rentabilité et gestion',
    'Préparez votre location courte durée à Casablanca : quartier, accès, équipements, coûts et gestion digitale. Une méthode pour évaluer votre propre logement.',
    'Guides locaux',
    'Votre appartement à Casablanca doit être évalué à partir de son quartier, de son accès et de ses équipements. Une moyenne de ville ne suffit pas à construire votre budget. Ce guide vous aide à réunir les informations utiles avant de publier ou de déléguer votre annonce.',
    'Comparez votre logement à des biens réellement proches et définissez qui intervient sur place. COOHOSTY propose un accompagnement digital à Casablanca, avec une organisation locale à prévoir séparément.',
    [s('quartier', 'Décrivez le quartier à partir de votre adresse réelle', [
      'Maârif, Gauthier, Racine ou Aïn Diab ne constituent pas des catégories de revenu. Pour votre adresse, vérifiez le trajet vers les lieux que vos voyageurs souhaitent rejoindre, les accès et les services pratiques. N’annoncez pas une proximité sans expliquer ce qu’elle signifie concrètement.',
      'Les indications de quartier doivent être exactes dans l’annonce et les consignes. Prenez en compte l’accès à l’immeuble, l’étage, l’ascenseur s’il existe et les possibilités de stationnement réellement disponibles. Une place « dans le quartier » n’équivaut pas à une place réservée.',
    ]),
    s('usage', 'Choisissez les équipements selon les séjours que vous observez', [
      'Si votre logement accueille des voyageurs qui travaillent, vérifiez la connexion Internet et la possibilité d’utiliser un espace confortable. Pour des séjours familiaux, décrivez les couchages, les équipements utiles et les limites du logement. Ces besoins doivent être confirmés par votre propre demande, pas présumés pour toute la ville.',
      'Contrôlez la réalité de chaque équipement annoncé et indiquez les contraintes qui peuvent influencer le choix. Une description précise réduit les questions répétées et les attentes déçues. Mettez à jour les photos lorsque vous modifiez l’aménagement.',
    ], { links: [link('creer-annonce-airbnb-maroc', 'Présenter correctement votre logement')] }),
    s('budget', 'Évaluez votre budget avec vos dates et vos devis', [
      'Notez vos périodes d’usage personnel et construisez les hypothèses de réservation sur les nuits réellement disponibles. Utilisez des comparables proches en capacité, équipements et emplacement. Un prix affiché sur une autre annonce ne prouve pas qu’il est obtenu.',
      'Ajoutez les charges, le ménage, le linge, l’entretien et les frais de commercialisation ou de gestion. Testez plusieurs scénarios sur l’année et gardez visibles les postes inconnus. Nous ne publions pas de taux d’occupation ou de revenu moyen de Casablanca sans source vérifiable.',
    ], { links: [link('rentabilite-location-courte-duree-maroc', 'Construire une estimation de rentabilité'), link('prix-location-courte-duree-maroc', 'Définir vos hypothèses de tarif')] }),
    s('local', 'Préparez l’accès et les interventions dans la résidence', [
      'Examinez les règles et les contraintes de votre immeuble avant d’organiser les arrivées. Déterminez qui remet les clés ou vérifie le dispositif d’accès, et comment le voyageur obtient de l’aide. Un changement de code doit être répercuté dans les consignes.',
      'Prévoyez un intervenant local pour le ménage et les besoins matériels, avec un contact de remplacement. La gestion des annonces à distance doit lui transmettre les dates et les informations utiles. Séparez les responsabilités digitales des tâches physiques dans votre contrat.',
    ], { links: [link('gerer-location-courte-duree-distance-maroc', 'Organiser votre relais local'), link('conciergerie-airbnb-casablanca', 'Comparer les services et alternatives à Casablanca')] }),
    localScope],
    [{ question: 'Quel revenu attendre d’un appartement à Casablanca ?', answer: 'Il dépend de votre adresse, de votre logement, des nuits disponibles et des coûts. Construisez des hypothèses explicites ; aucune moyenne non sourcée ne remplace l’étude du bien.' }, { question: 'COOHOSTY assure-t-il le ménage à Casablanca ?', answer: 'L’offre nationale concerne la gestion digitale. Les interventions physiques à Casablanca nécessitent une organisation locale définie séparément ; la gestion physique complète est proposée à Meknès.' }, { question: 'Dois-je indiquer le parking dans mon annonce ?', answer: 'Décrivez uniquement la solution réellement disponible et ses conditions, en distinguant une place réservée du stationnement dans les environs.' }],
    ['location-courte-duree-maroc', 'gerer-location-courte-duree-distance-maroc', 'conciergerie-airbnb-casablanca', 'rentabilite-location-courte-duree-maroc']),

  guide('location-courte-duree-marrakech',
    'Location courte durée à Marrakech : comment optimiser votre organisation et vos revenus ?',
    'Location courte durée Marrakech : tarifs et gestion',
    'Évaluez votre location courte durée à Marrakech selon le quartier et le logement : présentation, tarifs, coûts et relais local pour améliorer votre gestion.',
    'Guides locaux',
    'Un appartement à Guéliz, un riad dans la médina et une villa dans la Palmeraie ne se comparent pas avec le même budget ni les mêmes consignes d’arrivée. Pour améliorer vos revenus à Marrakech, commencez par les caractéristiques de votre logement et les dépenses qu’il entraîne.',
    'L’amélioration repose sur une annonce exacte, un tarif suivi et une organisation locale adaptée. Un quartier connu ne garantit ni réservation ni rentabilité.',
    [s('quartiers', 'Étudiez votre type de logement et son quartier', [
      'Pour un appartement, vérifiez les accès de la résidence, les équipements et les contraintes de voisinage. Pour un riad, préparez un parcours d’arrivée précis et décrivez les caractéristiques réelles du bâtiment. Pour une villa, intégrez les espaces extérieurs et les équipements concernés dans le budget.',
      'Les guides de quartiers existants permettent d’approfondir ces questions. Utilisez-les comme une grille de préparation, puis vérifiez chaque information pour votre adresse. Ils ne constituent pas un classement de rentabilité entre Guéliz, Hivernage, médina et Palmeraie.',
    ], { links: [link('location-courte-duree-gueliz-marrakech', 'Préparer un logement à Guéliz'), link('location-courte-duree-hivernage-marrakech', 'Examiner les besoins à l’Hivernage'), link('location-courte-duree-medina-marrakech', 'Organiser un logement dans la médina'), link('location-courte-duree-palmeraie-marrakech', 'Préparer une villa dans la Palmeraie')] }),
    s('presentation', 'Faites correspondre votre annonce à l’expérience réelle', [
      'Montrez les pièces, les couchages, les équipements et les espaces extérieurs que les voyageurs utiliseront. Décrivez les éventuelles marches, les conditions d’accès ou les limitations des équipements. Des photos attirantes doivent rester fidèles au logement proposé.',
      'Relisez les questions récurrentes reçues avant réservation. Elles peuvent révéler une information manquante dans l’annonce ou les consignes. Corrigez ces points avant d’ajouter de nouvelles promesses ou de modifier les prix.',
    ]),
    s('tarification', 'Ajustez les tarifs avec des comparables et vos réservations', [
      'Comparez les mêmes dates et une capacité similaire. Les équipements, les frais de séjour et les conditions doivent entrer dans votre analyse. Pour un événement ou une période particulière, vérifiez les dates avant d’adapter votre calendrier.',
      'Observez vos délais de réservation et les dates encore libres. Ajustez les hypothèses puis suivez le résultat après dépenses. Sans données sourcées, nous ne retenons pas de taux d’occupation supposé valable pour toute Marrakech.',
    ], { links: [link('prix-location-courte-duree-maroc', 'Construire une méthode de tarification'), link('rentabilite-location-courte-duree-maroc', 'Suivre les recettes après dépenses')] }),
    s('interventions', 'Anticipez les besoins matériels du logement', [
      'Listez les équipements nécessitant un entretien et définissez un responsable local. Si votre bien comporte une piscine, un jardin ou une climatisation, les tâches et les coûts correspondants doivent être documentés lorsqu’ils existent. Un logement plus grand peut demander une préparation plus longue.',
      'Organisez les changements de voyageurs en tenant compte des accès et des déplacements réels. Prévoyez les urgences et les dépenses qui nécessitent votre validation. La gestion digitale transmet les informations ; elle ne réalise pas les interventions à distance.',
    ], { links: [link('couts-location-courte-duree-maroc', 'Prévoir les dépenses du logement'), link('conciergerie-airbnb-marrakech', 'Comparer les solutions de gestion à Marrakech')] }),
    localScope],
    [{ question: 'Quel quartier est le plus rentable à Marrakech ?', answer: 'Nous ne pouvons pas établir un classement sans données comparables et datées. Le budget doit tenir compte du type de bien, des accès, des équipements et des nuits disponibles.' }, { question: 'Comment préparer une annonce pour un riad ?', answer: 'Décrivez le bâtiment et les équipements réels, montrez les espaces utilisés et expliquez précisément le parcours d’arrivée et les contraintes d’accès.' }, { question: 'COOHOSTY envoie-t-il des équipes à Marrakech ?', answer: 'Notre accompagnement national est digital. Les interventions à Marrakech nécessitent un relais local défini séparément ; la gestion physique complète est proposée à Meknès.' }],
    ['location-courte-duree-maroc', 'prix-location-courte-duree-maroc', 'gerer-location-courte-duree-distance-maroc', 'conciergerie-airbnb-marrakech']),

  guide('prix-conciergerie-airbnb-maroc',
    'Prix d’une conciergerie Airbnb au Maroc : comment comparer les devis ?',
    'Prix conciergerie Airbnb Maroc : frais et commissions',
    'Combien coûte une conciergerie Airbnb au Maroc ? Comparez l’assiette de commission, les services inclus et les frais de ménage ou d’intervention.',
    'Honoraires de gestion',
    'Deux offres affichant une commission peuvent produire deux factures différentes. Pour comprendre le prix d’une conciergerie Airbnb au Maroc, examinez le périmètre et la base de calcul avant de comparer les pourcentages. Ce guide vous aide à demander un devis lisible, sans inventer de tarif moyen national.',
    'Comparez le coût total pour un même scénario de réservations et exigez une définition écrite des inclusions, exclusions et responsabilités.',
    [s('modeles', 'Commission, forfait ou intervention : identifiez le modèle', [
      'Un gestionnaire peut proposer un montant fixe, un pourcentage ou une facturation par tâche. Il peut également combiner ces modèles. Demandez quelles dépenses peuvent exister même lorsque le logement n’est pas réservé et ce qui déclenche une facture supplémentaire.',
      'Une commission de gestion ne remplace pas les frais de la plateforme, les charges du logement ou les coûts des prestataires. Le bon devis permet de retrouver chaque poste et de comprendre qui le paie. Nous ne présentons pas une fourchette de marché sans enquête et sources vérifiables.',
    ]),
    s('assiette', 'Demandez sur quel montant la commission est calculée', [
      'Faites préciser le traitement des nuitées, frais de ménage, remises, annulations et remboursements. Demandez si la base est le montant réservé, encaissé ou un autre montant défini au contrat. Comparez ensuite deux devis avec exactement les mêmes hypothèses.',
      'Exemple purement pédagogique : 20 % d’une base de 10 000 MAD donnent 2 000 MAD ; 20 % d’une base de 9 000 MAD donnent 1 800 MAD. Cet exemple ne décrit ni un tarif de marché ni une offre particulière. Il montre pourquoi l’assiette compte autant que le taux.',
    ]),
    s('inclusions', 'Vérifiez les tâches incluses et les frais supplémentaires', [
      'Les messages, les tarifs et le calendrier constituent des tâches digitales. Le ménage, le linge, les clés et la maintenance demandent une organisation physique. Une offre peut les réaliser, les coordonner ou les laisser à votre charge : les trois situations ne produisent pas le même budget.',
      'Demandez un exemple de décompte et un cas d’intervention imprévue. Précisez le déplacement, les fournitures, les horaires concernés et le seuil de dépense autorisé. Les exclusions doivent être compréhensibles avant le premier séjour.',
    ], { table: { caption: 'Les informations à demander sur chaque devis', headers: ['Poste', 'Question à poser'], rows: [['Honoraires', 'Quelle assiette et quel déclencheur de facturation ?'], ['Ménage et linge', 'Réalisation, coordination ou prestataire séparé ?'], ['Maintenance', 'Qui intervient et qui autorise les achats ?'], ['Calendrier et tarifs', 'Quels accès et quelles validations ?'], ['Fin de mission', 'Quel préavis et quelle transmission des informations ?']] } }),
    s('offre', 'Distinguez conciergerie physique et gestion digitale', [
      'Si votre besoin principal concerne les annonces, les messages et les prix, une mission digitale peut être étudiée avec votre organisation locale actuelle. Si vous souhaitez déléguer les interventions, vérifiez d’abord la disponibilité du service dans votre ville et votre quartier.',
      'COOHOSTY propose un accompagnement digital dans tout le Maroc et une gestion physique complète à Meknès. Le prix retenu doit correspondre au devis et au contrat de votre logement. Hors Meknès, ne supposez pas que les honoraires incluent l’envoi d’équipes physiques.',
    ], { links: [link('cohosting-ou-conciergerie-airbnb-maroc', 'Comparer les périmètres de gestion'), { label: 'Analyser mon bien', href: '/fr#estimate' }] }),
    s('comparer', 'Le prix doit être rapproché du travail qui vous reste', [
      'Une offre peut sembler moins chère parce qu’elle exclut des missions que vous devrez gérer. Évaluez le temps de suivi, les responsabilités et la qualité du compte rendu attendu. Comparez aussi les modalités de sortie et la conservation de vos accès.',
      'Gardez séparées l’estimation de revenu et la rémunération du prestataire. Un pourcentage n’indique pas une performance future et ne garantit pas les réservations. Demandez des hypothèses explicites pour vos recettes et une grille claire pour vos dépenses.',
    ], { links: [link('commission-airbnb-maroc', 'Comprendre les frais de plateforme Airbnb'), link('rentabilite-location-courte-duree-maroc', 'Évaluer le résultat après dépenses')] })],
    [{ question: 'Combien coûte une conciergerie Airbnb au Maroc ?', answer: 'Le montant dépend de la mission, du logement et de la facturation. Comparez des devis détaillés plutôt qu’une moyenne nationale non vérifiée.' }, { question: 'Une commission inclut-elle le ménage ?', answer: 'Pas automatiquement. Faites préciser sa réalisation, sa coordination, le linge et les frais supplémentaires dans le devis.' }, { question: 'Commission Airbnb et commission de gestion sont-elles identiques ?', answer: 'Non. Les frais de plateforme et les honoraires du gestionnaire correspondent à des postes différents, à examiner séparément.' }],
    ['conciergerie-airbnb-maroc', 'couts-location-courte-duree-maroc', 'cohosting-ou-conciergerie-airbnb-maroc', 'choisir-societe-conciergerie-maroc']),

  guide('cohosting-ou-conciergerie-airbnb-maroc',
    'Co-hosting ou conciergerie Airbnb au Maroc : que pouvez-vous déléguer ?',
    'Co-hosting ou conciergerie Airbnb Maroc : différences',
    'Comparez co-hosting et conciergerie Airbnb au Maroc : accès, tâches digitales, présence physique et responsabilités pour choisir selon votre logement.',
    'Comparatifs',
    'Vous souhaitez déléguer votre location, mais les offres utilisent des mots différents. Un co-hôte peut gérer une annonce, une conciergerie peut proposer des interventions locales et les missions peuvent se recouper. Pour choisir, demandez ce qui sera réellement fait pour votre logement.',
    'Comparez les responsabilités et la présence physique, pas seulement le nom de l’offre. Le co-hosting ne signifie pas automatiquement une mission exclusivement à distance.',
    [s('definition', 'Les mots ne remplacent pas un périmètre de mission', [
      'Le co-hôte désigne notamment une collaboration avec des accès sur Airbnb. Les permissions déterminent ce qu’il peut faire dans la plateforme. L’organisation de ses autres missions relève de ce qui est convenu avec le propriétaire.',
      'Une conciergerie propose des services définis au contrat, qui peuvent associer gestion digitale et tâches locales. Demandez si elle réalise le ménage, le coordonne ou vous laisse choisir les prestataires. Deux offres portant le même nom peuvent avoir des responsabilités très différentes.',
    ], { sources: ['cohostPermissions'] }),
    s('taches', 'Séparez les tâches digitales et les besoins sur place', [
      'Les prix, les messages, le calendrier et la présentation des annonces peuvent être suivis en ligne. La préparation matérielle du logement, le contrôle du ménage et les pannes nécessitent une présence locale. Une bonne organisation relie les deux sans confondre leurs moyens.',
      'La remise des clés peut dépendre d’un intervenant ou d’un dispositif d’accès, mais il faut toujours prévoir un secours en cas de problème. Une consigne envoyée ne garantit pas que le voyageur entre effectivement dans le logement.',
    ], { table: { caption: 'Le périmètre doit être écrit, quelle que soit l’appellation', headers: ['Besoin', 'À confirmer dans la mission'], rows: [['Annonce et tarifs', 'Qui modifie, qui valide et avec quels accès ?'], ['Messages et réservations', 'Qui répond et transmet les demandes locales ?'], ['Ménage et clés', 'Qui réalise la tâche dans cette ville ?'], ['Maintenance', 'Qui intervient, paie et approuve les dépenses ?'], ['Suivi', 'Quels comptes rendus et justificatifs ?']] } }),
    s('choix', 'Choisissez selon votre organisation actuelle', [
      'Si vous disposez déjà d’un prestataire local fiable, vous pouvez examiner une délégation des tâches digitales. Si vous n’avez personne sur place, commencez par résoudre cette question avant d’ouvrir plusieurs plateformes. Une organisation partielle peut être efficace si ses limites sont connues.',
      'Votre distance, vos dates personnelles et votre disponibilité influencent aussi le choix. Décrivez les difficultés concrètes rencontrées : répondre le soir, modifier les prix, confirmer un ménage ou gérer un équipement. La proposition doit répondre à ces difficultés.',
    ], { links: [link('gerer-location-courte-duree-distance-maroc', 'Préparer une gestion à distance')] }),
    s('contrat', 'Conservez une visibilité sur les comptes et les dépenses', [
      'Définissez les accès aux annonces, les versements, le seuil d’achat autorisé et les conditions de fin de collaboration. Demandez un exemple de rapport. Vous devez pouvoir comprendre les résultats et récupérer les informations nécessaires si vous reprenez la gestion.',
      'Les honoraires doivent correspondre au périmètre réellement prévu. Comparez le coût total avec les prestations qui restent à votre charge. Un contrat de gestion ne remplace pas la vérification des obligations propres à votre logement.',
    ], { links: [link('prix-conciergerie-airbnb-maroc', 'Comparer les prix et les commissions'), link('choisir-societe-conciergerie-maroc', 'Les questions à poser avant de choisir')] }),
    localScope],
    [{ question: 'Un co-hôte travaille-t-il toujours à distance ?', answer: 'Non. Ses missions peuvent inclure des tâches locales selon l’accord. Les accès à la plateforme et les services effectivement fournis doivent être distingués.' }, { question: 'Puis-je associer un gestionnaire digital à un prestataire de ménage ?', answer: 'Oui, si les responsabilités et la transmission des informations sont définies. Prévoyez aussi un contact local de remplacement.' }, { question: 'Quel est le périmètre de COOHOSTY ?', answer: 'La gestion digitale est proposée dans tout le Maroc. La gestion physique complète est proposée à Meknès ; ailleurs, l’organisation des interventions locales est définie séparément.' }],
    ['conciergerie-airbnb-maroc', 'gerer-location-courte-duree-distance-maroc', 'prix-conciergerie-airbnb-maroc', 'conciergerie-ou-gestion-autonome-airbnb-maroc']),

  guide('conciergerie-airbnb-meknes',
    'Conciergerie Airbnb à Meknès : organiser la gestion de votre logement',
    'Conciergerie Airbnb Meknès : gestion courte durée',
    'À Meknès, préparez la gestion physique et digitale de votre location courte durée : annonce, calendrier, ménage, clés et suivi avec COOHOSTY.',
    'Guides locaux',
    'Vous possédez un logement à Meknès et souhaitez déléguer sa gestion courte durée ? C’est la ville où COOHOSTY propose une gestion physique complète, en complément de l’accompagnement digital. La première étape consiste à définir les besoins de votre bien et le périmètre de la mission.',
    'À Meknès, la gestion physique peut être étudiée avec la gestion des annonces et réservations. Les interventions, honoraires et dépenses sont définis pour votre logement dans le devis et le contrat.',
    [s('logement', 'Préparez votre logement avant de déléguer', [
      'Réunissez l’adresse, les photos, la capacité, les équipements et les règles de l’immeuble. Identifiez les éléments à vérifier avant une première arrivée : accès, linge, informations pratiques et éventuels travaux. La mission doit partir de l’état réel du logement.',
      'Précisez vos dates personnelles et les contraintes d’usage. Si votre annonce existe déjà, partagez son lien et les difficultés rencontrées. Les questions d’exploitation et les démarches administratives doivent être confirmées pour votre situation.',
    ], { links: [link('location-courte-duree-maroc', 'Préparer votre projet au Maroc')] }),
    s('physique', 'Définissez les interventions physiques à Meknès', [
      'Le ménage, le linge, les contrôles du logement et l’organisation des arrivées demandent des procédures précises. Le devis doit indiquer les missions incluses, les horaires ou conditions concernés et ce qui peut entraîner une dépense supplémentaire.',
      'Pour l’entretien et les incidents, définissez les autorisations d’achat et les informations que vous recevez. Une gestion physique complète ne signifie pas que chaque réparation ou remplacement est inclus dans les honoraires. Faites détailler les exclusions et les responsabilités.',
    ]),
    s('digital', 'Reliez l’annonce, les prix et le calendrier', [
      'La gestion digitale prépare la présentation du bien, suit les messages et les réservations et coordonne les disponibilités. Les informations utiles doivent parvenir à la personne qui organise le séjour sur place. Une modification d’horaire doit être transmise aux intervenants concernés.',
      'Pour Airbnb, Booking.com ou Vrbo, vérifiez les outils et les accès utilisés. Un logement présent sur plusieurs plateformes nécessite un calendrier suivi et des conditions cohérentes. Vous pouvez discuter du nombre de canaux adaptés à votre organisation.',
    ], { links: [link('airbnb-booking-vrbo-location-courte-duree', 'Choisir et coordonner les plateformes'), link('prix-location-courte-duree-maroc', 'Préparer la tarification')] }),
    s('budget', 'Demandez un devis adapté à votre bien', [
      'Comparez les tâches digitales et physiques, les honoraires et les coûts des prestations. Demandez la base de calcul d’une éventuelle commission et le traitement du ménage, du linge et des interventions. La proposition retenue doit vous permettre de comprendre le décompte.',
      'Nous ne promettons pas un taux d’occupation ou un revenu mensuel identique pour tous les logements de Meknès. Votre disponibilité, les équipements, le prix obtenu et les dépenses doivent entrer dans l’estimation. Les projections restent des hypothèses explicites.',
    ], { links: [link('prix-conciergerie-airbnb-maroc', 'Comprendre le prix d’une mission'), link('rentabilite-location-courte-duree-maroc', 'Évaluer le résultat du logement')] }),
    s('projet-meknes', 'Présentez-nous votre logement à Meknès', [
      'Dites-nous où se situe le bien, s’il est prêt à accueillir et les tâches que vous souhaitez déléguer. Indiquez les prestataires avec lesquels vous travaillez déjà et les périodes où vous utilisez le logement. Nous pourrons étudier une organisation adaptée.',
      'La gestion digitale nationale et la gestion physique à Meknès sont deux périmètres distincts. Pour votre bien à Meknès, les services réellement retenus, les conditions de suivi et les dépenses complémentaires seront précisés dans la proposition.',
    ], { links: [{ label: 'Analyser mon logement à Meknès', href: '/fr#estimate' }] })],
    [{ question: 'COOHOSTY propose-t-il une gestion physique à Meknès ?', answer: 'Oui. La gestion physique complète est proposée à Meknès, avec un périmètre et des conditions définis pour votre logement au devis et au contrat.' }, { question: 'Peut-on gérer un logement présent sur Booking.com ?', answer: 'La mission digitale peut prévoir la gestion des plateformes selon les accès et les outils disponibles. Définissez ensemble les canaux et les tâches concernés.' }, { question: 'Les réparations sont-elles automatiquement incluses ?', answer: 'Non. Faites préciser les interventions, les achats, les autorisations et les dépenses complémentaires dans la proposition.' }],
    ['location-courte-duree-maroc', 'conciergerie-airbnb-maroc', 'prix-conciergerie-airbnb-maroc', 'cohosting-ou-conciergerie-airbnb-maroc']),
];

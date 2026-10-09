import type { Locale } from '@/config/site';

export const marrakechServicePath = '/services/conciergerie-marrakech';
export const marrakechServiceModified = '2026-10-09';

type CityServiceContent = {
  title: string; seoTitle: string; description: string; intro: string;
  back: string; cta: string; included: string; offersTitle: string; offersIntro: string;
  localTitle: string; sections: { title: string; paragraphs: string[] }[];
  faqTitle: string; faq: { question: string; answer: string }[];
  guidesTitle: string; guideLabels: string[]; linkLabel: string; home: string; services: string;
};

export const marrakechServiceContent: Record<Locale, CityServiceContent> = {
  fr: {
    title: 'Conciergerie Airbnb à Marrakech',
    seoTitle: 'Conciergerie Airbnb Marrakech | COOHOSTY',
    description: 'Conciergerie Airbnb à Marrakech : annonce, tarifs, voyageurs et entretien. Retrouvez les services COOHOSTY et demandez un accompagnement sur devis.',
    intro: 'Vous souhaitez confier la gestion de votre appartement, villa ou riad à Marrakech ? COOHOSTY vous accompagne dans la préparation de votre annonce, le suivi des réservations et l’organisation des séjours. Retrouvez les mêmes services que notre offre COHOST, avec un projet défini autour de votre logement et de vos besoins à Marrakech.',
    back: 'Retour aux services', cta: 'Parlons de votre logement à Marrakech', included: 'Les services de conciergerie pour votre logement',
    offersTitle: 'Les mêmes offres, adaptées à votre projet à Marrakech',
    offersIntro: 'Choisissez le niveau d’accompagnement qui vous convient : analyser votre annonce, travailler ses performances ou déléguer la gestion. Les prestations et leur organisation sont précisées dans votre devis.',
    localTitle: 'Une gestion pensée pour votre logement à Marrakech',
    sections: [
      { title: 'Appartement, villa ou riad : partir des besoins du bien', paragraphs: ['Un appartement à Guéliz, un logement à l’Hivernage, un riad dans la médina ou une villa vers la Palmeraie présentent des besoins différents. Avant de définir la mission, précisez les accès, les équipements, les espaces partagés et les interventions nécessaires. Le quartier et la configuration du logement permettent de préparer une organisation réaliste.', 'Pour un riad, décrivez notamment les escaliers et l’accès depuis le point de dépose. Pour une villa, indiquez les extérieurs et les équipements qui demandent un entretien spécifique. Pour un appartement, documentez les règles de l’immeuble et les modalités de remise des clés.'] },
      { title: 'Préparer chaque arrivée et chaque départ', paragraphs: ['La conciergerie de location courte durée doit couvrir le parcours du voyageur : instructions d’arrivée, échanges pendant le séjour et préparation du logement suivant. Définissez qui coordonne le ménage, le linge et les contrôles. Identifiez également le contact à joindre lorsqu’un équipement ou un accès pose problème.', 'Si vous vivez loin de Marrakech, convenez d’un suivi des interventions et d’un seuil d’autorisation pour les dépenses. Si vous utilisez le logement vous-même, bloquez vos dates personnelles à l’avance. Les disponibilités et les responsabilités doivent rester lisibles pour chacun.'] },
      { title: 'Suivre les tarifs, les dépenses et les résultats', paragraphs: ['Le calendrier, le prix et les conditions de séjour doivent tenir compte de votre logement et des dates réellement proposées. L’objectif est de suivre les décisions avec des informations compréhensibles : nuits disponibles, réservations, recettes et dépenses. Une estimation de revenus repose sur des hypothèses et ne garantit pas un résultat.', 'Nos tarifs sont sur devis. Précisez le périmètre souhaité pour distinguer les honoraires de gestion, les frais de plateforme et les dépenses d’exploitation. Les formalités applicables au logement et à l’accueil des voyageurs doivent être confirmées indépendamment de la prestation de conciergerie.'] },
    ],
    faqTitle: 'Questions sur la conciergerie à Marrakech',
    faq: [
      { question: 'Quels logements peuvent faire l’objet d’un projet de conciergerie à Marrakech ?', answer: 'Vous pouvez présenter un appartement, une villa ou un riad. La configuration, les accès et les besoins du logement sont étudiés pour définir le périmètre et l’organisation de la mission.' },
      { question: 'Retrouve-t-on les mêmes services que dans l’offre COHOST ?', answer: 'Oui, cette page reprend les services de notre offre COHOST. Le devis précise les prestations retenues, les conditions d’intervention et les éventuels frais complémentaires pour votre logement à Marrakech.' },
      { question: 'Combien coûte la gestion Airbnb à Marrakech ?', answer: 'Les offres COOHOSTY sont sur devis. Le coût dépend des prestations confiées et des besoins du logement. Demandez une proposition détaillée pour comparer les honoraires et les dépenses d’exploitation.' },
      { question: 'Puis-je utiliser mon logement pendant l’année ?', answer: 'Vos dates personnelles peuvent être prévues dans l’organisation convenue. Communiquez-les à l’avance pour les bloquer dans le calendrier et éviter de les proposer à la réservation.' },
    ],
    guidesTitle: 'Préparer votre projet de location à Marrakech',
    guideLabels: ['Guide de la conciergerie Airbnb à Marrakech', 'Choisir une société de conciergerie au Maroc', 'Organiser les formalités d’accueil des voyageurs'],
    linkLabel: 'Conciergerie Airbnb à Marrakech', home: 'Accueil', services: 'Services',
  },
  en: {
    title: 'Airbnb property management in Marrakech',
    seoTitle: 'Airbnb Management Marrakech | COOHOSTY',
    description: 'Airbnb management in Marrakech: listings, pricing, guest communication and property care. Explore COOHOSTY services and request a tailored quote.',
    intro: 'Looking for help managing your apartment, villa or riad in Marrakech? COOHOSTY supports listing preparation, reservation management and the organisation of guest stays. Explore the same services as our COHOST offer, with a scope agreed around your property and your needs in Marrakech.',
    back: 'Back to services', cta: 'Discuss your Marrakech property', included: 'Property management services for your home',
    offersTitle: 'The same offers for your Marrakech project',
    offersIntro: 'Choose the support you need: analyse your listing, work on its performance or delegate management. Your quote sets out the services and how they will be organised.',
    localTitle: 'Management planned around your Marrakech property',
    sections: [
      { title: 'Apartments, villas and riads have different needs', paragraphs: ['An apartment in Gueliz or Hivernage, a riad in the medina and a villa around the Palmeraie have different practical requirements. Before agreeing the scope, describe access, amenities, shared spaces and maintenance needs. The neighbourhood and property layout help shape a realistic operating plan.', 'For a riad, explain stairs and the route from the vehicle drop-off point. For a villa, identify outdoor areas and equipment requiring specific care. For an apartment, document building rules and key handover arrangements.'] },
      { title: 'Prepare arrivals, departures and the next stay', paragraphs: ['Short-term rental management needs to cover the guest journey: arrival instructions, messages during the stay and preparing the home for the next booking. Agree who coordinates cleaning, linen and checks, and identify the contact for access or equipment problems.', 'If you live away from Marrakech, agree how interventions will be reported and which expenses need your approval. If you use the property yourself, block your personal dates in advance. Availability and responsibilities should be clear to everyone involved.'] },
      { title: 'Keep track of pricing, expenses and results', paragraphs: ['Your calendar, prices and stay conditions need to reflect the home and the dates actually offered. Follow decisions using clear information: available nights, bookings, receipts and expenses. Revenue estimates depend on assumptions and do not guarantee a result.', 'COOHOSTY prices are provided on request. Define the scope so that management fees, platform fees and operating costs remain distinct. Requirements applying to the property and guest reception need to be confirmed separately from the management service.'] },
    ],
    faqTitle: 'Questions about management in Marrakech',
    faq: [
      { question: 'Which Marrakech properties can I discuss with you?', answer: 'You can present an apartment, villa or riad. Its layout, access and practical needs are reviewed to define the service scope and organisation.' },
      { question: 'Are these the same services as the COHOST offer?', answer: 'Yes, this page presents the services in our COHOST offer. Your quote specifies the agreed services, intervention arrangements and any additional expenses for your Marrakech property.' },
      { question: 'How much does Airbnb management in Marrakech cost?', answer: 'COOHOSTY offers are quoted individually. The price depends on the services delegated and the needs of the property. Request an itemised proposal separating fees from operating costs.' },
      { question: 'Can I still use my property myself?', answer: 'Personal dates can be included in the agreed organisation. Share them in advance so they can be blocked in the calendar before being offered to guests.' },
    ],
    guidesTitle: 'Prepare your Marrakech rental project',
    guideLabels: ['Marrakech Airbnb management guide (French)', 'Choosing a management company in Morocco (French)', 'Organising guest reception formalities (French)'],
    linkLabel: 'Airbnb management in Marrakech', home: 'Home', services: 'Services',
  },
  ar: {
    title: 'إدارة وتأجير سكن Airbnb في مراكش',
    seoTitle: 'إدارة سكن Airbnb في مراكش | COOHOSTY',
    description: 'إدارة سكن Airbnb في مراكش: الإعلان والأسعار والتواصل مع الضيوف والعناية بالعقار. اكتشف خدمات COOHOSTY واطلب عرضاً مناسباً لاحتياجاتك.',
    intro: 'هل تريد المساعدة في إدارة شقتك أو فيلتك أو رياضك في مراكش؟ تواكبك COOHOSTY في تجهيز الإعلان ومتابعة الحجوزات وتنظيم إقامات الضيوف. تجد هنا الخدمات نفسها الواردة في عرض COHOST، مع تحديد المهام حسب احتياجات عقارك ومشروعك في مراكش.',
    back: 'العودة إلى الخدمات', cta: 'لنتحدث عن عقارك في مراكش', included: 'خدمات إدارة الإيجار القصير لعقارك',
    offersTitle: 'العروض نفسها لمشروعك في مراكش',
    offersIntro: 'اختر المساعدة التي تحتاجها: تحليل الإعلان أو العمل على أدائه أو تفويض الإدارة. يوضح عرض السعر الخدمات المختارة وطريقة تنظيمها.',
    localTitle: 'إدارة تراعي خصوصيات عقارك في مراكش',
    sections: [
      { title: 'لكل شقة أو فيلا أو رياض احتياجاته', paragraphs: ['تختلف احتياجات شقة في جليز أو الحي الشتوي عن رياض في المدينة القديمة أو فيلا قرب النخيل. قبل تحديد المهام، وضّح طريقة الوصول والتجهيزات والمساحات المشتركة وأعمال الصيانة المطلوبة. يساعد موقع العقار وتوزيع مساحاته على إعداد تنظيم عملي.', 'بالنسبة إلى الرياض، وضّح السلالم والمسار من نقطة نزول السيارة. وبالنسبة إلى الفيلا، حدد المساحات الخارجية والتجهيزات التي تحتاج إلى عناية خاصة. أما الشقة فتحتاج إلى توثيق قواعد العمارة وطريقة تسليم المفاتيح.'] },
      { title: 'تجهيز الوصول والمغادرة والإقامة التالية', paragraphs: ['تشمل إدارة الإيجار القصير تعليمات الوصول والتواصل أثناء الإقامة وتجهيز السكن للحجز التالي. اتفق على الشخص الذي ينسق التنظيف والبياضات وفحص العقار، وحدد جهة الاتصال عند حدوث مشكلة في الدخول أو أحد التجهيزات.', 'إذا كنت تقيم خارج مراكش، اتفق على متابعة التدخلات والمصاريف التي تتطلب موافقتك. وإذا كنت تستخدم العقار بنفسك، احجز تواريخك الشخصية مسبقاً. ينبغي أن تكون التواريخ والمسؤوليات واضحة لجميع الأطراف.'] },
      { title: 'متابعة الأسعار والمصاريف والنتائج', paragraphs: ['ينبغي أن تراعي الأسعار وشروط الإقامة والتقويم خصائص السكن والتواريخ المعروضة فعلياً. تابع الليالي المتاحة والحجوزات والمداخيل والمصاريف لفهم القرارات المتخذة. تعتمد تقديرات المداخيل على فرضيات ولا تضمن نتيجة محددة.', 'تُحدد أسعار COOHOSTY حسب عرض مخصص. وضّح نطاق الخدمة للفصل بين أتعاب الإدارة ورسوم المنصة ومصاريف التشغيل. ويجب التأكد بشكل مستقل من الإجراءات المطبقة على العقار واستقبال الضيوف.'] },
    ],
    faqTitle: 'أسئلة حول إدارة السكن في مراكش',
    faq: [
      { question: 'ما العقارات التي يمكن عرضها لمشروع إدارة في مراكش؟', answer: 'يمكنك عرض شقة أو فيلا أو رياض. تتم دراسة توزيع المساحات وطريقة الوصول واحتياجات العقار لتحديد المهام وتنظيمها.' },
      { question: 'هل الخدمات هي نفسها الواردة في عرض COHOST؟', answer: 'نعم، تعرض هذه الصفحة خدمات COHOST. يوضح عرض السعر الخدمات المتفق عليها وشروط التدخل وأي مصاريف إضافية تخص عقارك في مراكش.' },
      { question: 'كم تكلف إدارة سكن Airbnb في مراكش؟', answer: 'تُحدد أسعار COOHOSTY حسب الخدمات المطلوبة واحتياجات العقار. اطلب عرضاً مفصلاً يميز بين أتعاب الإدارة ومصاريف التشغيل.' },
      { question: 'هل يمكنني استخدام عقاري خلال السنة؟', answer: 'يمكن إدراج تواريخ استعمالك الشخصي ضمن التنظيم المتفق عليه. أبلغ بها مسبقاً لحجبها في التقويم قبل عرضها للحجز.' },
    ],
    guidesTitle: 'الاستعداد لمشروع الإيجار في مراكش',
    guideLabels: ['دليل إدارة Airbnb في مراكش بالفرنسية', 'اختيار شركة إدارة في المغرب بالفرنسية', 'تنظيم إجراءات استقبال الضيوف بالفرنسية'],
    linkLabel: 'إدارة سكن Airbnb في مراكش', home: 'الرئيسية', services: 'الخدمات',
  },
};

/**
 * Legal notice, privacy and cookies, in the four site languages.
 *
 * Written against what this site actually does: it is a static site that sets
 * no cookies of its own, stores nothing in the browser, and keeps no database.
 * The only personal data that moves is what someone types into the booking
 * form, which leaves as a WhatsApp message or an e-mail. Keep these texts in
 * step with the code — if the site ever gains a cookie, this file changes too.
 *
 * Spanish is the authoritative version; the others say so.
 */
import type { Lang } from './index';

type Block = { h: string; p: string; list?: string[] };
type Section = { n: string; head: string; blocks: Block[] };
export type LegalCopy = {
  title: string;
  description: string;
  h1a: string;
  h1em: string;
  lede: string;
  updatedLabel: string;
  prevails: string;
  pending: string;
  idHead: string;
  idRows: { k: string; v: string }[];
  s1: Section;
  s2: Section;
  s3: Section;
  contactHead: string;
  contactText: string;
};

const es: LegalCopy = {
  title: 'Aviso legal, privacidad y cookies | Crush',
  description:
    'Aviso legal, política de privacidad y política de cookies de Crush, Av. de Niza 12, Playa de San Juan, Alicante.',
  h1a: 'Lo',
  h1em: 'legal.',
  lede:
    'Aviso legal, privacidad y cookies. Está escrito en corto y en claro, porque esta web hace pocas cosas con tus datos y conviene que se entienda cuáles.',
  updatedLabel: 'Última revisión',
  prevails: '',
  pending: '[pendiente de completar]',
  idHead: 'Titular',
  idRows: [
    { k: 'Denominación', v: '' },
    { k: 'NIF', v: '' },
    { k: 'Domicilio', v: '' },
    { k: 'Email', v: '' },
    { k: 'Teléfono', v: '' },
    { k: 'Sitio web', v: '' },
    { k: 'Alojamiento', v: '' },
  ],
  s1: {
    n: '01',
    head: 'Aviso legal',
    blocks: [
      {
        h: 'Quiénes somos',
        p: 'Los datos identificativos del titular de este sitio son los de la tabla anterior, conforme al artículo 10 de la Ley 34/2002 de servicios de la sociedad de la información y de comercio electrónico (LSSI-CE).',
      },
      {
        h: 'Para qué sirve esta web',
        p: 'Es una web informativa: presenta el local, su carta, su música y su agenda, y permite solicitar una reserva. No se vende nada a través de ella ni se procesan pagos.',
      },
      {
        h: 'Uso del sitio',
        p: 'Al navegar aceptas usar la web de buena fe y no realizar acciones que puedan dañarla o impedir su funcionamiento normal. Los precios, horarios y contenidos de la carta son informativos y pueden cambiar sin previo aviso; los del local prevalecen.',
      },
      {
        h: 'Propiedad intelectual',
        p: 'Los textos, fotografías, marcas, logotipos y el diseño de este sitio pertenecen al titular o se usan con autorización. No pueden reproducirse ni distribuirse sin permiso escrito, salvo el uso privado y las citas legalmente permitidas.',
      },
      {
        h: 'Enlaces a terceros',
        p: 'El sitio enlaza a servicios externos (Instagram, TikTok, Facebook, Tripadvisor, Google Maps y WhatsApp). El titular no controla esos servicios ni responde de sus contenidos ni de sus políticas de privacidad.',
      },
      {
        h: 'Responsabilidad',
        p: 'Se procura que la información esté actualizada y sea correcta, pero no se garantiza que esté libre de errores. El titular no responde de los daños derivados del uso del sitio ni de interrupciones del servicio ajenas a su control.',
      },
      {
        h: 'Ley aplicable',
        p: 'Esta relación se rige por la legislación española. Para cualquier controversia serán competentes los juzgados y tribunales que correspondan según la normativa aplicable.',
      },
    ],
  },
  s2: {
    n: '02',
    head: 'Política de privacidad',
    blocks: [
      {
        h: 'Responsable del tratamiento',
        p: 'El titular indicado arriba. Puedes escribirle a la dirección de correo de la tabla para cualquier cuestión relacionada con tus datos.',
      },
      {
        h: 'Qué datos se recogen',
        p: 'Solo los que escribes tú en el formulario de reserva. Ningún campo se rellena solo y no se crean perfiles.',
        list: [
          'Día y hora y número de personas (obligatorios para poder reservar)',
          'Nombre, teléfono y correo electrónico, si los facilitas',
          'El mensaje libre que quieras añadir',
        ],
      },
      {
        h: 'Para qué se usan',
        p: 'Únicamente para responder a tu solicitud y gestionar la reserva o el evento que pides. No se usan para publicidad ni se ceden a terceros con fines comerciales.',
      },
      {
        h: 'Base legal',
        p: 'Tu consentimiento al enviar el formulario y la aplicación de medidas precontractuales a petición tuya (artículo 6.1.a y 6.1.b del Reglamento (UE) 2016/679).',
      },
      {
        h: 'Cómo viajan tus datos',
        p: 'Esta web es estática y no tiene base de datos: al enviar el formulario, los datos no se guardan en el servidor. Se abre WhatsApp con el mensaje ya escrito, o tu gestor de correo, y eres tú quien lo envía. A partir de ahí, la conversación queda donde la mantengas: en WhatsApp o en el correo del local.',
      },
      {
        h: 'Quién más puede verlos',
        p: 'Los proveedores necesarios para que exista la comunicación:',
        list: [
          'Vercel Inc., que aloja el sitio (no recibe el contenido del formulario)',
          'WhatsApp Ireland Ltd. / Meta, si eliges enviar la solicitud por WhatsApp',
          'El proveedor de correo del local, si eliges el email',
        ],
      },
      {
        h: 'Cuánto tiempo se conservan',
        p: 'El tiempo necesario para atender tu solicitud y, después, el que exijan las obligaciones legales aplicables. Puedes pedir que se borre la conversación cuando quieras.',
      },
      {
        h: 'Tus derechos',
        p: 'Puedes ejercer los derechos de acceso, rectificación, supresión, oposición, limitación del tratamiento y portabilidad escribiendo al correo del titular e indicando cuál ejerces. También puedes retirar tu consentimiento en cualquier momento, sin que ello afecte a lo hecho antes.',
      },
      {
        h: 'Reclamaciones',
        p: 'Si crees que tus datos no se han tratado correctamente, puedes reclamar ante la Agencia Española de Protección de Datos (www.aepd.es).',
      },
      {
        h: 'Menores',
        p: 'Este sitio no está dirigido a menores de 14 años y no se recogen conscientemente sus datos.',
      },
    ],
  },
  s3: {
    n: '03',
    head: 'Política de cookies',
    blocks: [
      {
        h: 'Esta web no usa cookies propias',
        p: 'No se instala ninguna cookie propia, ni de sesión ni de seguimiento, y tampoco se guarda nada en el almacenamiento local del navegador. Por eso no verás un banner de cookies: no hay nada que consentir.',
      },
      {
        h: 'Tipografías y vídeos',
        p: 'Las tipografías y los vídeos se sirven desde el propio dominio, no desde servicios externos. Al cargar la web no se hace ninguna petición a terceros.',
      },
      {
        h: 'El mapa de la página de reservas',
        p: 'La página de reserva incluye un mapa de Google incrustado. Al cargarlo, Google puede instalar cookies propias suyas y recibir tu dirección IP, según su propia política de privacidad. Es el único elemento de terceros que carga la web, y solo en esa página.',
      },
      {
        h: 'Analítica',
        p: 'Si en algún momento se activa la analítica, será una herramienta sin cookies que mide visitas de forma agregada y anónima, sin identificar a nadie ni seguir a los visitantes entre sitios. Aun así se indicará aquí cuando esté en marcha.',
      },
      {
        h: 'Cómo controlarlo',
        p: 'Puedes bloquear o borrar cookies desde la configuración de tu navegador. Hacerlo no afecta al funcionamiento de esta web, salvo que el mapa incrustado deje de mostrarse.',
      },
    ],
  },
  contactHead: 'Dudas',
  contactText:
    'Cualquier pregunta sobre estos textos o sobre tus datos, escríbenos y te respondemos.',
};

const en: LegalCopy = {
  title: 'Legal notice, privacy and cookies | Crush',
  description:
    'Legal notice, privacy policy and cookie policy for Crush, Av. de Niza 12, Playa de San Juan, Alicante.',
  h1a: 'The',
  h1em: 'legal bit.',
  lede:
    'Legal notice, privacy and cookies. Written short and plain, because this site does very little with your data and it is worth knowing exactly what.',
  updatedLabel: 'Last reviewed',
  prevails:
    'This is a translation for convenience. The Spanish version is the legally binding one.',
  pending: '[to be completed]',
  idHead: 'Who runs this site',
  idRows: [
    { k: 'Registered name', v: '' },
    { k: 'Tax ID (NIF)', v: '' },
    { k: 'Address', v: '' },
    { k: 'Email', v: '' },
    { k: 'Phone', v: '' },
    { k: 'Website', v: '' },
    { k: 'Hosting', v: '' },
  ],
  s1: {
    n: '01',
    head: 'Legal notice',
    blocks: [
      {
        h: 'Who we are',
        p: 'The details in the table above identify the owner of this site, as required by article 10 of Spanish Law 34/2002 on information society services and electronic commerce (LSSI-CE).',
      },
      {
        h: 'What this site is for',
        p: 'It is an informational site: it presents the venue, its menu, its music and its agenda, and lets you request a table. Nothing is sold through it and no payments are processed.',
      },
      {
        h: 'Using the site',
        p: 'By browsing you agree to use the site in good faith and not to do anything that could damage it or disrupt its normal operation. Prices, hours and menu content are informational and may change without notice; the venue’s own are the ones that count.',
      },
      {
        h: 'Intellectual property',
        p: 'The texts, photographs, trade marks, logos and design of this site belong to the owner or are used with permission. They may not be reproduced or distributed without written consent, beyond private use and legally permitted quotation.',
      },
      {
        h: 'Links to third parties',
        p: 'The site links to external services (Instagram, TikTok, Facebook, Tripadvisor, Google Maps and WhatsApp). The owner does not control those services and is not responsible for their content or their privacy policies.',
      },
      {
        h: 'Liability',
        p: 'Information is kept up to date and accurate as far as possible, but is not guaranteed to be error-free. The owner is not liable for damages arising from use of the site or for service interruptions outside their control.',
      },
      {
        h: 'Applicable law',
        p: 'This relationship is governed by Spanish law. Any dispute will be heard by the courts that have jurisdiction under the applicable rules.',
      },
    ],
  },
  s2: {
    n: '02',
    head: 'Privacy policy',
    blocks: [
      {
        h: 'Data controller',
        p: 'The owner named above. Write to the email address in the table with anything concerning your data.',
      },
      {
        h: 'What is collected',
        p: 'Only what you type into the booking form. No field fills itself and no profiles are built.',
        list: [
          'Day, time and how many of you (required to hold a table)',
          'Name, phone and email, if you choose to give them',
          'Whatever else you write in the message field',
        ],
      },
      {
        h: 'What it is used for',
        p: 'Only to answer your request and arrange the table or event you asked about. Never for advertising, and never sold or passed on for commercial purposes.',
      },
      {
        h: 'Legal basis',
        p: 'Your consent when you submit the form, and steps taken at your request before entering into a contract (articles 6.1.a and 6.1.b of Regulation (EU) 2016/679).',
      },
      {
        h: 'How your data travels',
        p: 'This is a static site with no database: submitting the form stores nothing on the server. It opens WhatsApp with the message already written, or your email client, and you are the one who sends it. From there the conversation lives wherever you keep it — in WhatsApp, or in the venue’s inbox.',
      },
      {
        h: 'Who else can see it',
        p: 'Only the providers needed for the message to reach the venue:',
        list: [
          'Vercel Inc., which hosts the site (it never receives the form content)',
          'WhatsApp Ireland Ltd. / Meta, if you send the request via WhatsApp',
          'The venue’s email provider, if you use email',
        ],
      },
      {
        h: 'How long it is kept',
        p: 'As long as needed to deal with your request, and afterwards for as long as any legal obligation requires. You can ask for the conversation to be deleted at any time.',
      },
      {
        h: 'Your rights',
        p: 'You can exercise your rights of access, rectification, erasure, objection, restriction of processing and portability by writing to the owner’s email and saying which one you are exercising. You may also withdraw consent at any time, without affecting anything done beforehand.',
      },
      {
        h: 'Complaints',
        p: 'If you believe your data has not been handled properly, you can complain to the Spanish Data Protection Agency (www.aepd.es).',
      },
      {
        h: 'Children',
        p: 'This site is not aimed at children under 14 and does not knowingly collect their data.',
      },
    ],
  },
  s3: {
    n: '03',
    head: 'Cookie policy',
    blocks: [
      {
        h: 'This site sets no cookies of its own',
        p: 'No first-party cookies at all, neither session nor tracking, and nothing is written to your browser’s local storage. That is why there is no cookie banner: there is nothing to consent to.',
      },
      {
        h: 'Fonts and video',
        p: 'Fonts and video are served from this domain, not from external services. Loading the site makes no third-party requests.',
      },
      {
        h: 'The map on the booking page',
        p: 'The booking page embeds a Google map. Loading it lets Google set its own cookies and receive your IP address, under Google’s own privacy policy. It is the only third-party element the site loads, and only on that page.',
      },
      {
        h: 'Analytics',
        p: 'If analytics is ever switched on, it will be a cookieless tool that counts visits in aggregate and anonymously, without identifying anyone or following visitors between sites. Even so, it will be noted here once it is running.',
      },
      {
        h: 'How to control it',
        p: 'You can block or delete cookies from your browser settings. Doing so does not affect this site, except that the embedded map may stop showing.',
      },
    ],
  },
  contactHead: 'Questions',
  contactText: 'Anything about these texts or about your data — write to us and we will answer.',
};

const fr: LegalCopy = {
  title: 'Mentions légales, confidentialité et cookies | Crush',
  description:
    'Mentions légales, politique de confidentialité et politique de cookies de Crush, Av. de Niza 12, Playa de San Juan, Alicante.',
  h1a: 'Le côté',
  h1em: 'légal.',
  lede:
    'Mentions légales, confidentialité et cookies. Écrit court et clair, parce que ce site fait très peu de choses avec vos données et qu’il vaut mieux savoir lesquelles.',
  updatedLabel: 'Dernière révision',
  prevails: 'Traduction fournie pour votre confort. La version espagnole fait foi.',
  pending: '[à compléter]',
  idHead: 'Éditeur du site',
  idRows: [
    { k: 'Dénomination', v: '' },
    { k: 'Numéro fiscal (NIF)', v: '' },
    { k: 'Adresse', v: '' },
    { k: 'E-mail', v: '' },
    { k: 'Téléphone', v: '' },
    { k: 'Site web', v: '' },
    { k: 'Hébergement', v: '' },
  ],
  s1: {
    n: '01',
    head: 'Mentions légales',
    blocks: [
      {
        h: 'Qui nous sommes',
        p: 'Les informations du tableau ci-dessus identifient l’éditeur de ce site, conformément à l’article 10 de la loi espagnole 34/2002 sur les services de la société de l’information et le commerce électronique (LSSI-CE).',
      },
      {
        h: 'À quoi sert ce site',
        p: 'C’est un site d’information : il présente le lieu, sa carte, sa musique et son agenda, et permet de demander une table. Rien n’y est vendu et aucun paiement n’y est traité.',
      },
      {
        h: 'Utilisation du site',
        p: 'En naviguant, vous acceptez d’utiliser le site de bonne foi et de ne rien faire qui puisse l’endommager ou perturber son fonctionnement. Les prix, horaires et contenus de la carte sont indicatifs et peuvent changer sans préavis ; ceux du lieu font foi.',
      },
      {
        h: 'Propriété intellectuelle',
        p: 'Les textes, photographies, marques, logos et le design de ce site appartiennent à l’éditeur ou sont utilisés avec autorisation. Ils ne peuvent être reproduits ni distribués sans accord écrit, hors usage privé et citations légalement admises.',
      },
      {
        h: 'Liens vers des tiers',
        p: 'Le site renvoie vers des services externes (Instagram, TikTok, Facebook, Tripadvisor, Google Maps et WhatsApp). L’éditeur ne contrôle pas ces services et n’est pas responsable de leurs contenus ni de leurs politiques de confidentialité.',
      },
      {
        h: 'Responsabilité',
        p: 'Les informations sont tenues à jour et exactes dans la mesure du possible, sans garantie d’absence d’erreur. L’éditeur n’est pas responsable des dommages liés à l’usage du site ni des interruptions indépendantes de sa volonté.',
      },
      {
        h: 'Droit applicable',
        p: 'Cette relation est régie par le droit espagnol. Tout litige relèvera des juridictions compétentes selon la réglementation applicable.',
      },
    ],
  },
  s2: {
    n: '02',
    head: 'Politique de confidentialité',
    blocks: [
      {
        h: 'Responsable du traitement',
        p: 'L’éditeur indiqué ci-dessus. Écrivez à l’adresse e-mail du tableau pour toute question concernant vos données.',
      },
      {
        h: 'Données collectées',
        p: 'Uniquement ce que vous saisissez dans le formulaire de réservation. Aucun champ ne se remplit tout seul et aucun profil n’est constitué.',
        list: [
          'Jour, heure et nombre de personnes (nécessaires pour réserver)',
          'Nom, téléphone et e-mail, si vous les indiquez',
          'Le message libre que vous souhaitez ajouter',
        ],
      },
      {
        h: 'Finalité',
        p: 'Uniquement répondre à votre demande et organiser la table ou l’événement demandé. Jamais de publicité, jamais de cession à des tiers à des fins commerciales.',
      },
      {
        h: 'Base légale',
        p: 'Votre consentement lors de l’envoi du formulaire et les mesures précontractuelles prises à votre demande (articles 6.1.a et 6.1.b du Règlement (UE) 2016/679).',
      },
      {
        h: 'Le trajet de vos données',
        p: 'Ce site est statique et n’a pas de base de données : l’envoi du formulaire n’enregistre rien sur le serveur. WhatsApp s’ouvre avec le message déjà rédigé, ou votre messagerie, et c’est vous qui l’envoyez. Ensuite, la conversation reste là où vous la gardez : dans WhatsApp ou dans la boîte du lieu.',
      },
      {
        h: 'Qui d’autre y a accès',
        p: 'Seulement les prestataires nécessaires à l’acheminement du message :',
        list: [
          'Vercel Inc., qui héberge le site (ne reçoit jamais le contenu du formulaire)',
          'WhatsApp Ireland Ltd. / Meta, si vous envoyez la demande par WhatsApp',
          'Le fournisseur de messagerie du lieu, si vous passez par e-mail',
        ],
      },
      {
        h: 'Durée de conservation',
        p: 'Le temps nécessaire pour traiter votre demande, puis le temps qu’imposent les obligations légales applicables. Vous pouvez demander la suppression de la conversation à tout moment.',
      },
      {
        h: 'Vos droits',
        p: 'Vous pouvez exercer vos droits d’accès, de rectification, d’effacement, d’opposition, de limitation du traitement et de portabilité en écrivant à l’e-mail de l’éditeur en précisant lequel. Vous pouvez aussi retirer votre consentement à tout moment, sans effet sur ce qui a été fait auparavant.',
      },
      {
        h: 'Réclamations',
        p: 'Si vous estimez que vos données ont été mal traitées, vous pouvez saisir l’Agence espagnole de protection des données (www.aepd.es).',
      },
      {
        h: 'Mineurs',
        p: 'Ce site ne s’adresse pas aux moins de 14 ans et ne collecte pas sciemment leurs données.',
      },
    ],
  },
  s3: {
    n: '03',
    head: 'Politique de cookies',
    blocks: [
      {
        h: 'Ce site ne dépose aucun cookie propre',
        p: 'Aucun cookie propriétaire, ni de session ni de suivi, et rien n’est écrit dans le stockage local de votre navigateur. C’est pourquoi il n’y a pas de bandeau : il n’y a rien à accepter.',
      },
      {
        h: 'Polices et vidéos',
        p: 'Les polices et les vidéos sont servies depuis ce domaine, pas depuis des services externes. Le chargement du site ne déclenche aucune requête vers un tiers.',
      },
      {
        h: 'La carte de la page de réservation',
        p: 'La page de réservation intègre une carte Google. En la chargeant, Google peut déposer ses propres cookies et recevoir votre adresse IP, selon sa politique de confidentialité. C’est le seul élément tiers chargé par le site, et uniquement sur cette page.',
      },
      {
        h: 'Statistiques',
        p: 'Si des statistiques sont un jour activées, ce sera un outil sans cookies qui compte les visites de façon agrégée et anonyme, sans identifier personne ni suivre les visiteurs d’un site à l’autre. Ce sera néanmoins indiqué ici.',
      },
      {
        h: 'Comment le contrôler',
        p: 'Vous pouvez bloquer ou supprimer les cookies depuis les réglages de votre navigateur. Cela n’affecte pas ce site, sauf que la carte intégrée peut ne plus s’afficher.',
      },
    ],
  },
  contactHead: 'Des questions',
  contactText:
    'Pour toute question sur ces textes ou sur vos données, écrivez-nous et nous vous répondrons.',
};

const ru: LegalCopy = {
  title: 'Правовая информация, конфиденциальность и cookies | Crush',
  description:
    'Правовая информация, политика конфиденциальности и политика cookies заведения Crush, Av. de Niza 12, Playa de San Juan, Аликанте.',
  h1a: 'Правовая',
  h1em: 'сторона.',
  lede:
    'Правовая информация, конфиденциальность и cookies. Коротко и по делу: этот сайт делает с вашими данными очень мало, и стоит знать, что именно.',
  updatedLabel: 'Последняя проверка',
  prevails: 'Перевод для удобства. Юридическую силу имеет испанская версия.',
  pending: '[будет дополнено]',
  idHead: 'Владелец сайта',
  idRows: [
    { k: 'Наименование', v: '' },
    { k: 'Налоговый номер (NIF)', v: '' },
    { k: 'Адрес', v: '' },
    { k: 'Email', v: '' },
    { k: 'Телефон', v: '' },
    { k: 'Сайт', v: '' },
    { k: 'Хостинг', v: '' },
  ],
  s1: {
    n: '01',
    head: 'Правовая информация',
    blocks: [
      {
        h: 'Кто мы',
        p: 'Данные в таблице выше идентифицируют владельца сайта в соответствии со статьёй 10 испанского закона 34/2002 об услугах информационного общества и электронной торговле (LSSI-CE).',
      },
      {
        h: 'Для чего этот сайт',
        p: 'Это информационный сайт: он представляет заведение, его меню, музыку и афишу и позволяет отправить запрос на бронь. Здесь ничего не продаётся и не обрабатываются платежи.',
      },
      {
        h: 'Использование сайта',
        p: 'Пользуясь сайтом, вы соглашаетесь делать это добросовестно и не совершать действий, способных повредить ему или нарушить его работу. Цены, часы работы и содержание меню носят информационный характер и могут меняться без предупреждения; действуют те, что в заведении.',
      },
      {
        h: 'Интеллектуальная собственность',
        p: 'Тексты, фотографии, товарные знаки, логотипы и дизайн сайта принадлежат владельцу или используются с разрешения. Их нельзя воспроизводить и распространять без письменного согласия, кроме частного использования и цитирования в рамках закона.',
      },
      {
        h: 'Ссылки на сторонние сервисы',
        p: 'Сайт ссылается на внешние сервисы (Instagram, TikTok, Facebook, Tripadvisor, Google Maps и WhatsApp). Владелец не контролирует их и не отвечает за их содержание и политику конфиденциальности.',
      },
      {
        h: 'Ответственность',
        p: 'Информация поддерживается в актуальном и точном виде, насколько это возможно, но отсутствие ошибок не гарантируется. Владелец не несёт ответственности за ущерб от использования сайта и за перебои, находящиеся вне его контроля.',
      },
      {
        h: 'Применимое право',
        p: 'К этим отношениям применяется испанское право. Споры рассматриваются судами, компетентными согласно применимым нормам.',
      },
    ],
  },
  s2: {
    n: '02',
    head: 'Политика конфиденциальности',
    blocks: [
      {
        h: 'Оператор данных',
        p: 'Владелец, указанный выше. По любым вопросам о ваших данных пишите на адрес электронной почты из таблицы.',
      },
      {
        h: 'Какие данные собираются',
        p: 'Только то, что вы сами вводите в форму брони. Ни одно поле не заполняется автоматически, профили не создаются.',
        list: [
          'День, время и число гостей (нужны, чтобы забронировать)',
          'Имя, телефон и email, если вы их укажете',
          'Свободный текст, который вы захотите добавить',
        ],
      },
      {
        h: 'Для чего они используются',
        p: 'Только чтобы ответить на ваш запрос и организовать столик или событие. Никакой рекламы и никакой передачи третьим лицам в коммерческих целях.',
      },
      {
        h: 'Правовое основание',
        p: 'Ваше согласие при отправке формы и меры, предшествующие договору, принимаемые по вашей просьбе (статьи 6.1.a и 6.1.b Регламента (ЕС) 2016/679).',
      },
      {
        h: 'Как движутся ваши данные',
        p: 'Это статический сайт без базы данных: отправка формы ничего не сохраняет на сервере. Открывается WhatsApp с уже написанным сообщением или ваша почта, и отправляете его вы. Дальше переписка остаётся там, где вы её храните: в WhatsApp или в почте заведения.',
      },
      {
        h: 'Кто ещё их видит',
        p: 'Только те поставщики услуг, без которых сообщение не дойдёт:',
        list: [
          'Vercel Inc., который размещает сайт (содержимое формы к нему не попадает)',
          'WhatsApp Ireland Ltd. / Meta, если вы отправляете запрос через WhatsApp',
          'Почтовый провайдер заведения, если вы пишете на email',
        ],
      },
      {
        h: 'Срок хранения',
        p: 'Столько, сколько нужно для ответа на ваш запрос, и затем столько, сколько требуют применимые правовые обязанности. Вы в любой момент можете попросить удалить переписку.',
      },
      {
        h: 'Ваши права',
        p: 'Вы можете реализовать права на доступ, исправление, удаление, возражение, ограничение обработки и переносимость, написав на email владельца и указав, какое именно право реализуете. Согласие можно отозвать в любой момент — это не затронет того, что было сделано ранее.',
      },
      {
        h: 'Жалобы',
        p: 'Если вы считаете, что с вашими данными обошлись неправильно, вы можете обратиться в Испанское агентство по защите данных (www.aepd.es).',
      },
      {
        h: 'Несовершеннолетние',
        p: 'Сайт не предназначен для лиц младше 14 лет, и их данные сознательно не собираются.',
      },
    ],
  },
  s3: {
    n: '03',
    head: 'Политика cookies',
    blocks: [
      {
        h: 'Сайт не ставит собственных cookies',
        p: 'Ни сессионных, ни отслеживающих, и ничего не записывается в локальное хранилище браузера. Поэтому здесь нет баннера о cookies: соглашаться не с чем.',
      },
      {
        h: 'Шрифты и видео',
        p: 'Шрифты и видео отдаются с этого же домена, а не из внешних сервисов. При загрузке сайта запросов к третьим сторонам не происходит.',
      },
      {
        h: 'Карта на странице брони',
        p: 'На странице брони встроена карта Google. При её загрузке Google может установить свои cookies и получить ваш IP-адрес — согласно собственной политике Google. Это единственный сторонний элемент на сайте, и только на этой странице.',
      },
      {
        h: 'Аналитика',
        p: 'Если аналитику когда-нибудь включат, это будет инструмент без cookies, считающий визиты обобщённо и анонимно, без идентификации людей и слежки между сайтами. Об этом всё равно будет сказано здесь.',
      },
      {
        h: 'Как этим управлять',
        p: 'Блокировать и удалять cookies можно в настройках браузера. На работу сайта это не влияет — разве что встроенная карта перестанет показываться.',
      },
    ],
  },
  contactHead: 'Вопросы',
  contactText: 'Любой вопрос об этих текстах или о ваших данных — напишите нам, и мы ответим.',
};

export const legalCopy: Record<Lang, LegalCopy> = { en, es, fr, ru };

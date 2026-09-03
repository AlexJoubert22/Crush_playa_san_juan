/**
 * Site-wide facts. Every value here comes from crushculture.es (official) or
 * the brand's public listings. Change here, and every page updates.
 */
export const site = {
  name: 'Crush',
  legalName: 'Crush Café Tropical',
  strap: ['Food', 'Drinks', 'Beats'],
  claim: 'Electronic music & tropical vibes',
  description:
    'Crush is an all-day social venue on Playa de San Juan, Alicante: specialty coffee, brunch and açaí by day, tropical cocktails and resident DJs by night. Food, drinks & beats from 09:00.',
  url: 'https://www.crushculture.es',
  address: {
    street: 'Av. de Niza, 12',
    area: 'Playa de San Juan',
    city: 'Alicante',
    postal: '03540',
    country: 'Spain',
  },
  geo: { lat: 38.37, lng: -0.41 },
  maps: 'https://maps.app.goo.gl/bnUgte6h1vCWqHkF7',
  mapEmbed:
    'https://www.google.com/maps?q=Crush%2C%20Av.%20de%20Niza%2012%2C%2003540%20Alicante&z=16&output=embed',
  phone: '+34 649 26 59 00',
  phoneHref: 'tel:+34649265900',
  email: 'info@crushculture.es',
  instagram: 'https://www.instagram.com/crushplayasanjuan/',
  instagramHandle: '@crushplayasanjuan',
  facebook: 'https://www.facebook.com/crushplayadesanjuan/',
  tiktok: 'https://www.tiktok.com/@crushplayasanjuan',
  /** Digits only, for wa.me links. */
  whatsapp: '34649265900',
  tripadvisor:
    'https://www.tripadvisor.com/Restaurant_Review-g1064230-d32995806-Reviews-Crush-Alicante_Costa_Blanca_Province_of_Alicante_Valencian_Community.html',
  hours: [
    { days: 'Monday – Thursday', open: '09:00', close: '20:00' },
    { days: 'Friday – Sunday', open: '09:00', close: '23:00' },
  ],
  hoursNote: 'Extended hours during events.',
  timezone: 'Europe/Madrid',
  /** closing hour per weekday, Sunday = 0 */
  closeByDay: [23, 20, 20, 20, 20, 23, 23],
  openHour: 9,
};

/** Canonical (English) paths. `key` looks the label up in the dictionary. */
export const nav = [
  { path: '/menu', key: 'menu' },
  { path: '/sound', key: 'sound' },
  { path: '/events', key: 'events' },
  { path: '/story', key: 'story' },
  { path: '/book', key: 'book' },
] as const;

/**
 * Cookieless analytics. Set PUBLIC_ANALYTICS_DOMAIN (and optionally
 * PUBLIC_ANALYTICS_SRC for a self-hosted Plausible/Umami) and the script is
 * added; leave it empty and no third-party script is loaded at all.
 */
export const analytics = {
  domain: import.meta.env.PUBLIC_ANALYTICS_DOMAIN ?? '',
  src: import.meta.env.PUBLIC_ANALYTICS_SRC ?? 'https://plausible.io/js/script.js',
};

/**
 * Where the agenda comes from. Point `ics` at a public Google Calendar iCal
 * address and the site bakes those events in at build time; leave it empty and
 * the recurring Cadenza / OPUS rules in events.source.json are used instead.
 * See README for how to publish the calendar and what to write in an event.
 */
export const calendarFeed = {
  ics: import.meta.env.PUBLIC_CRUSH_ICS ?? '',
  /** How far ahead recurring entries are expanded, in days. */
  horizonDays: 150,
};

export const sessions = {
  cadenza: { name: 'Cadenza', time: '10:00 – 16:00' },
  opus: { name: 'OPUS', time: '21:00 – 02:00' },
};

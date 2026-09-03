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

/** `match` is the pathname that lights the link up. Anchors leave it empty. */
export const nav = [
  { href: '/menu', label: 'Menu', match: '/menu' },
  { href: '/sound', label: 'The Sound', match: '/sound' },
  { href: '/sound#agenda', label: 'Events', match: '' },
  { href: '/story', label: 'Story', match: '/story' },
  { href: '/visit', label: 'Contact', match: '/visit' },
];

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
  cadenza: {
    name: 'Cadenza',
    when: 'Saturday & Sunday',
    time: '10:00 – 16:00',
    artist: 'Resident DJs',
    genre: 'Daytime sessions',
    blurb:
      'The daytime session. High-energy brunch: organic and progressive house with the coffee, bowls on the table and the sea across the road.',
  },
  opus: {
    name: 'OPUS',
    when: 'Second Saturday of the month',
    time: '21:00 – 02:00',
    artist: 'Many DJs',
    genre: 'Progressive house',
    blurb:
      'The night session. The lights go down, several residents share the booth and the terrace runs until two in the morning.',
  },
};

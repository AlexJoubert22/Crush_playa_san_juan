/**
 * Legal identification, required by Spain's LSSI-CE (art. 10) and the RGPD.
 *
 * The two empty fields below are the only ones this project cannot know: the
 * owner has to supply them before the site goes live on the real domain. The
 * build prints a warning while they are blank, and the page shows an obvious
 * placeholder rather than a made-up number.
 */
export const legal = {
  /** Registered name. A company's razón social, or the owner's full name if a sole trader. */
  companyName: '',
  /** NIF / CIF. */
  taxId: '',
  /** Only if the business is registered as a company. Leave empty otherwise. */
  registry: '',
  /** Where the site is hosted, for the LSSI notice. */
  host: {
    name: 'Vercel Inc.',
    address: '340 S Lemon Ave #4133, Walnut, CA 91789, USA',
    url: 'https://vercel.com',
  },
  /** Spain's data protection authority, for the complaint route. */
  dpa: { name: 'Agencia Española de Protección de Datos (AEPD)', url: 'https://www.aepd.es' },
  /** Last review of these texts. */
  updated: '2026-09-03',
};

export const legalReady = Boolean(legal.companyName && legal.taxId);

if (!legalReady) {
  console.warn(
    '\n[crush] Legal notice incomplete: fill companyName and taxId in src/data/legal.ts\n' +
      '        before publishing on the live domain. LSSI-CE art. 10 requires both.\n'
  );
}

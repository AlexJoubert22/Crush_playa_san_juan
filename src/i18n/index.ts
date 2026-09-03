/**
 * Two languages, one set of templates.
 *
 * English lives at the root (`/menu`), Spanish under a prefix (`/es/menu`).
 * Every page is a thin wrapper that renders a shared section component with a
 * `lang` prop, so the markup exists once and only the words change.
 */
export const languages = {
  en: { label: 'English', short: 'EN', htmlLang: 'en-GB', locale: 'en_GB' },
  es: { label: 'Español', short: 'ES', htmlLang: 'es-ES', locale: 'es_ES' },
} as const;

export type Lang = keyof typeof languages;
export const defaultLang: Lang = 'en';
export const langs = Object.keys(languages) as Lang[];

/** Which language a URL is in. */
export function getLang(url: URL): Lang {
  return url.pathname.split('/')[1] === 'es' ? 'es' : 'en';
}

/** Turn a canonical (English) path into the one for this language. */
export function localise(lang: Lang, path: string): string {
  if (lang === defaultLang) return path;
  return path === '/' ? '/es' : `/es${path}`;
}

/** The same page in the other language, keeping hash and query. */
export function otherLangHref(lang: Lang, url: URL): string {
  const target: Lang = lang === 'en' ? 'es' : 'en';
  const bare = lang === 'es' ? url.pathname.replace(/^\/es/, '') || '/' : url.pathname;
  return localise(target, bare) + url.search + url.hash;
}

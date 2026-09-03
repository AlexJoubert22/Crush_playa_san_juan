/**
 * Four languages, one set of templates.
 *
 * English lives at the root (`/menu`); every other language sits under its
 * prefix (`/es/menu`, `/fr/menu`, `/ru/menu`). Every page is a thin wrapper that
 * renders a shared section component with a `lang` prop, so the markup exists
 * once and only the words change.
 */
export const languages = {
  en: { label: 'English', short: 'EN', htmlLang: 'en-GB', locale: 'en_GB' },
  es: { label: 'Español', short: 'ES', htmlLang: 'es-ES', locale: 'es_ES' },
  fr: { label: 'Français', short: 'FR', htmlLang: 'fr-FR', locale: 'fr_FR' },
  ru: { label: 'Русский', short: 'RU', htmlLang: 'ru-RU', locale: 'ru_RU' },
} as const;

export type Lang = keyof typeof languages;
export const defaultLang: Lang = 'en';
export const langs = Object.keys(languages) as Lang[];

const isLang = (s: string): s is Lang => s in languages;

/** Which language a URL is in. */
export function getLang(url: URL): Lang {
  const seg = url.pathname.split('/')[1] ?? '';
  return isLang(seg) && seg !== defaultLang ? seg : defaultLang;
}

/** Turn a canonical (English) path into the one for this language. */
export function localise(lang: Lang, path: string): string {
  if (lang === defaultLang) return path;
  return path === '/' ? `/${lang}` : `/${lang}${path}`;
}

/**
 * Every word on the site, in four languages. One file per language, one shape
 * for all of them (`Copy`, derived from English) so a missing key is a type
 * error rather than a blank on the page.
 */
import type { Lang } from './index';
import { en, type Copy } from './copy.en';
import { es } from './copy.es';
import { fr } from './copy.fr';
import { ru } from './copy.ru';

export type { Copy };

export const copy: Record<Lang, Copy> = { en, es, fr, ru };

export const t = (lang: Lang): Copy => copy[lang];

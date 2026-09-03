/**
 * CRUSH — client runtime
 * One module for the whole site. It (re)initialises on every Astro page load
 * (astro:page-load) and tears down on astro:before-swap, so view transitions
 * never leak ScrollTriggers, observers or timers.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';
import eventsSource from '@/data/events.source.json';
import { site } from '@/data/site';

gsap.registerPlugin(ScrollTrigger, SplitText);

/** Dates follow the page, not the browser. */
const pageLocale = () => (document.documentElement.lang || 'en-GB');

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ------------------------------------------------------------------ state */
let lenis: Lenis | null = null;
const cleanups: Array<() => void> = [];
const splits = new Map<HTMLElement, SplitText>();

function onCleanup(fn: () => void) {
  cleanups.push(fn);
}

/* ------------------------------------------------------------------ lenis */
function initLenis() {
  if (lenis || reduced()) return;
  lenis = new Lenis({ lerp: 0.11, smoothWheel: true, autoRaf: false });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis?.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}

/* ------------------------------------------------------------ text splits */
async function splitLines() {
  await document.fonts.ready;
  document
    .querySelectorAll<HTMLElement>('[data-reveal="lines"]:not(.is-split)')
    .forEach((el) => splitOne(el));
}

function splitOne(el: HTMLElement) {
  // aria: 'none' — the text stays as real text nodes, so no aria-label is needed
  // (and aria-label is prohibited on <p>/<h*> generic roles).
  const split = new SplitText(el, { type: 'lines', linesClass: 'line-inner', aria: 'none' });
  split.lines.forEach((line) => {
    const mask = document.createElement('span');
    mask.className = 'line';
    mask.style.display = 'block';
    line.parentNode?.insertBefore(mask, line);
    mask.appendChild(line);
  });
  splits.set(el, split);
  el.classList.add('is-split');
}

function resplitOnResize() {
  let w = window.innerWidth;
  let raf = 0;
  const handler = () => {
    if (Math.abs(window.innerWidth - w) < 40) return;
    w = window.innerWidth;
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      splits.forEach((split, el) => {
        split.revert();
        el.classList.remove('is-split');
        splitOne(el);
      });
      ScrollTrigger.refresh();
    });
  };
  window.addEventListener('resize', handler);
  onCleanup(() => window.removeEventListener('resize', handler));
}

/* ------------------------------------------------------------- reveals */
/**
 * Uses ScrollTrigger rather than IntersectionObserver on purpose: elements
 * hidden with `clip-path: inset(100% …)` report no intersection in Chromium,
 * so an observer would never reveal them. ScrollTrigger measures layout boxes.
 */
function initReveal() {
  document.querySelectorAll<HTMLElement>('[data-reveal], [data-stagger]').forEach((el) => {
    ScrollTrigger.create({
      trigger: el,
      start: 'top 92%',
      once: true,
      onEnter: () => {
        el.classList.add('is-in');
        // after the last line has risen, drop the masks so glows can breathe
        window.setTimeout(() => el.classList.add('is-done'), 1600);
      },
    });
  });
}

/* ----------------------------------------------------------------- nav */
function initNav() {
  const nav = document.querySelector<HTMLElement>('[data-nav]');
  if (!nav) return;
  const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 40);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
  onCleanup(() => window.removeEventListener('scroll', onScroll));

  const toggle = document.querySelector<HTMLButtonElement>('[data-menu-toggle]');
  const menu = document.querySelector<HTMLElement>('[data-menu]');
  if (!toggle || !menu) return;

  let open = false;
  const setOpen = (v: boolean) => {
    open = v;
    toggle.setAttribute('aria-expanded', String(v));
    toggle.setAttribute('aria-label', v ? 'Close menu' : 'Open menu');
    if (v) {
      menu.hidden = false;
      requestAnimationFrame(() => menu.classList.add('is-open'));
      document.body.style.overflow = 'hidden';
      lenis?.stop();
    } else {
      menu.classList.remove('is-open');
      document.body.style.overflow = '';
      lenis?.start();
      window.setTimeout(() => {
        if (!open) menu.hidden = true;
      }, 700);
    }
  };
  const onToggle = () => setOpen(!open);
  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && open) setOpen(false);
  };
  const onLink = () => setOpen(false);
  toggle.addEventListener('click', onToggle);
  document.addEventListener('keydown', onKey);
  menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', onLink));
  onCleanup(() => {
    toggle.removeEventListener('click', onToggle);
    document.removeEventListener('keydown', onKey);
    document.body.style.overflow = '';
    lenis?.start();
  });
}

/* --------------------------------------------------------- "now" chip */
type Parts = { y: number; m: number; d: number; h: number; min: number; wd: number };

function madridNow(date = new Date()): Parts {
  const f = new Intl.DateTimeFormat('en-GB', {
    timeZone: site.timezone,
    hour12: false,
    weekday: 'short',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
  const p: Record<string, string> = {};
  f.formatToParts(date).forEach((x) => (p[x.type] = x.value));
  return {
    y: +p.year,
    m: +p.month,
    d: +p.day,
    h: +p.hour % 24,
    min: +p.minute,
    wd: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(p.weekday),
  };
}

function statusNow(): { text: string; open: boolean } {
  const { h, min, wd } = madridNow();
  const t = h + min / 60;
  const close = site.closeByDay[wd];
  const weekend = wd === 0 || wd === 6;
  const w = words().status;
  if (t < site.openHour) return { text: w.opensAt, open: false };
  if (t >= close) return { text: w.closed, open: false };
  if (weekend && t >= 10 && t < 16) return { text: w.cadenza, open: true };
  if (t < 12) return { text: w.coffee, open: true };
  if (t < 17) return { text: w.brunch, open: true };
  if (t < 20) return { text: w.sunset, open: true };
  return { text: w.night, open: true };
}

/**
 * Swap a chip's text. The outgoing line lifts and blurs away, the incoming one
 * rises into place, and the pill's width eases between the two so nothing jumps.
 */
function setChip(chip: HTMLElement, text: string, animate = true) {
  const swap = chip.querySelector<HTMLElement>('.chip__swap');
  const cur = chip.querySelector<HTMLElement>('[data-now-text]');
  if (!cur || cur.textContent === text) return;
  if (!swap || !animate || reduced()) {
    if (cur.textContent !== text) cur.textContent = text;
    return;
  }
  // A swap already in flight: drop the stale outgoing line first.
  swap.querySelectorAll('.chip__line.is-leave').forEach((n) => n.remove());

  const from = swap.getBoundingClientRect().width;
  const next = document.createElement('span');
  next.className = 'chip__line is-enter';
  next.setAttribute('data-now-text', '');
  next.textContent = text;
  cur.removeAttribute('data-now-text');
  cur.classList.add('is-leave');
  swap.appendChild(next);

  const to = next.getBoundingClientRect().width;
  swap.style.width = `${from}px`;
  requestAnimationFrame(() => {
    swap.style.width = `${to}px`;
    next.classList.add('is-in');
  });
  window.setTimeout(() => {
    cur.remove();
    swap.style.width = '';
    next.classList.remove('is-enter', 'is-in');
  }, 720);
}

/**
 * Warm one-liners the nav chip cycles through as you scroll. Index 0 is always
 * the live open/closed status, so the useful fact is what greets you at the top.
 */
/** The lines the nav chip walks through on an inner page, in the page's language. */
function chipPool(page: string): string[] {
  if (page === 'home') return []; // the home chip narrates the scrolled hour instead
  return words().chip[page] ?? [];
}

/** Hour boundaries for the home narration; the lines come from the dictionary. */
const NARRATION_EDGES = [10.5, 12, 14, 16, 17.5, 19, 21, 23, 26, 30];

/** What the home chip says at a given (scrolled) hour. */
function narration(h: number): string {
  const lines = words().chip.home ?? [];
  let i = NARRATION_EDGES.findIndex((edge) => h < edge);
  if (i < 0) i = NARRATION_EDGES.length;
  return lines[i] ?? lines[lines.length - 1] ?? '';
}

function initNow() {
  const chips = document.querySelectorAll<HTMLElement>('[data-now]');
  if (!chips.length) return;
  const navChip = document.querySelector<HTMLElement>('[data-now-nav]');
  const page = document.documentElement.dataset.page ?? '';
  const homeNarrates = !!document.querySelector('[data-arc]');
  const pool = chipPool(page);

  let first = true;
  const syncStatus = () => {
    const s = statusNow();
    chips.forEach((c) => {
      c.classList.toggle('chip--live', s.open);
      // The nav chip on a page with its own narration is driven by scroll.
      if (c === navChip && (homeNarrates || pool.length)) return;
      setChip(c, s.text, !first);
    });
    first = false;
  };
  syncStatus();
  const id = window.setInterval(syncStatus, 30_000);
  onCleanup(() => window.clearInterval(id));

  // Inner pages: the nav chip walks the pool as the page scrolls.
  if (!navChip || homeNarrates || !pool.length) return;
  const lines = [statusNow().text, ...pool];
  let last = -1;
  const onScroll = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    const i = Math.min(lines.length - 1, Math.floor(p * lines.length));
    if (i === last) return;
    last = i;
    lines[0] = statusNow().text;
    setChip(navChip, lines[i]);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
  onCleanup(() => window.removeEventListener('scroll', onScroll));
}

/* ------------------------------------------------------------ agenda */
type Session = { id: string; name: string; time: string; artist: string; genre: string };
type AgendaRow = Session & { date: Date; today: boolean };

const WEEKDAY_KEYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
const RECURRING = (eventsSource as any).recurring as Array<any>;
const ONE_OFF = ((eventsSource as any).oneOff || []) as Array<any>;
const SKIP = new Set<string>();
RECURRING.forEach((r) => (r.skipDates || []).forEach((s: string) => SKIP.add(`${r.id}:${s}`)));

const isoOf = (d: Date) => d.toISOString().slice(0, 10);

/** Events baked in from the venue's Google Calendar, if one is connected. */
type FeedSession = { date: string; name: string; time: string; artist: string; genre: string };
let FEED: FeedSession[] | null = null;
function feed(): FeedSession[] {
  if (FEED) return FEED;
  const el = document.getElementById('crush-events');
  try {
    FEED = el ? (JSON.parse(el.textContent || '[]') as FeedSession[]) : [];
  } catch {
    FEED = [];
  }
  return FEED;
}
const slugOf = (name: string) => name.toLowerCase().replace(/[^a-z]/g, '') || 'event';

/** The page's own words for everything this script writes into the DOM. */
type ClientCopy = {
  status: Record<string, string>;
  chip: Record<string, string[]>;
  nowLabel: string;
  closedLabel: string;
};
const FALLBACK_COPY: ClientCopy = {
  status: {
    opensAt: 'Opens at 09:00',
    closed: 'Closed · opens 09:00',
    cadenza: 'Open · Cadenza is on',
    coffee: 'Open · Coffee hours',
    brunch: 'Open · Brunch & bowls',
    sunset: 'Open · Sunset drinks',
    night: 'Open · Night session',
    today: 'Today',
    tonight: 'Tonight',
  },
  chip: {},
  nowLabel: 'Now · Alicante time',
  closedLabel: 'Closed · opens 09:00',
};
let CLIENT_COPY: ClientCopy | null = null;
function words(): ClientCopy {
  if (CLIENT_COPY) return CLIENT_COPY;
  const el = document.getElementById('crush-copy');
  try {
    CLIENT_COPY = el ? { ...FALLBACK_COPY, ...(JSON.parse(el.textContent || '{}') as Partial<ClientCopy>) } : FALLBACK_COPY;
  } catch {
    CLIENT_COPY = FALLBACK_COPY;
  }
  return CLIENT_COPY;
}

/** Localised wording for the built-in Cadenza / OPUS rules. */
type RuleCopy = Record<string, { artist: string; genre: string }>;
let RULE_COPY: RuleCopy | null = null;
function ruleCopy(): RuleCopy {
  if (RULE_COPY) return RULE_COPY;
  const el = document.getElementById('crush-session-copy');
  try {
    RULE_COPY = el ? (JSON.parse(el.textContent || '{}') as RuleCopy) : {};
  } catch {
    RULE_COPY = {};
  }
  return RULE_COPY;
}

/** Every session on one calendar day: the connected calendar wins, rules fill in. */
function sessionsOn(d: Date): Session[] {
  const iso = isoOf(d);
  const connected = feed();
  if (connected.length) {
    return connected
      .filter((e) => e.date === iso)
      .map((e) => ({ id: slugOf(e.name), name: e.name, time: e.time, artist: e.artist, genre: e.genre }));
  }
  const wd = d.getUTCDay();
  const dom = d.getUTCDate();
  const out: Session[] = [];
  for (const r of RECURRING) {
    if (r.active === false) continue;
    if (!r.weekday.includes(WEEKDAY_KEYS[wd])) continue;
    if (r.monthWeek && Math.ceil(dom / 7) !== r.monthWeek) continue;
    if (SKIP.has(`${r.id}:${iso}`)) continue;
    const w = ruleCopy()[r.id];
    out.push({ id: r.id, name: r.name, time: r.time, artist: w?.artist ?? r.artist, genre: w?.genre ?? r.genre });
  }
  for (const o of ONE_OFF) {
    if (o.active === false || o.date !== iso) continue;
    out.push({ id: o.id ?? 'oneoff', name: o.name, time: o.time, artist: o.artist, genre: o.genre });
  }
  return out;
}

function upcoming(count = 6): AgendaRow[] {
  const now = madridNow();
  const start = new Date(Date.UTC(now.y, now.m - 1, now.d));
  const rows: AgendaRow[] = [];
  for (let i = 0; i < 70 && rows.length < count; i++) {
    const d = new Date(start.getTime() + i * 86_400_000);
    for (const s of sessionsOn(d)) {
      // today: hide anything that already finished
      if (i === 0) {
        const m = s.time.match(/[-–]\s*(\d{1,2}):/);
        const end = m ? parseInt(m[1], 10) : 99;
        const endHour = end < 9 ? end + 24 : end;
        if (now.h + now.min / 60 >= endHour) continue;
      }
      rows.push({ ...s, date: d, today: i === 0 });
    }
  }
  return rows.slice(0, count);
}

/** "21:00 - 02:00" → hours on a 09:00→03:00 axis, for the hairline rails. */
function spanOf(time: string): { from: number; to: number } | null {
  const m = time.match(/(\d{1,2}):(\d{2})\s*[-–]\s*(\d{1,2}):(\d{2})/);
  if (!m) return null;
  let from = +m[1] + +m[2] / 60;
  let to = +m[3] + +m[4] / 60;
  if (from < 6) from += 24;
  if (to <= from) to += 24;
  return { from, to };
}

/** A 1px rail showing where a session sits inside the venue's day. */
function railFor(time: string): HTMLElement | null {
  const s = spanOf(time);
  if (!s) return null;
  const AXIS_FROM = 9;
  const AXIS_TO = 27; // 03:00
  const clamp = (v: number) => Math.min(100, Math.max(0, ((v - AXIS_FROM) / (AXIS_TO - AXIS_FROM)) * 100));
  const rail = document.createElement('span');
  rail.className = 'span-rail';
  rail.setAttribute('aria-hidden', 'true');
  const seg = document.createElement('i');
  seg.style.left = `${clamp(s.from).toFixed(2)}%`;
  seg.style.width = `${(clamp(s.to) - clamp(s.from)).toFixed(2)}%`;
  rail.append(seg);
  return rail;
}

function initAgenda() {
  const lists = document.querySelectorAll<HTMLElement>('[data-agenda]');
  const nextBox = document.querySelector<HTMLElement>('[data-next-session]');
  if (!lists.length && !nextBox) return;
  const fmt = new Intl.DateTimeFormat(pageLocale(), { timeZone: 'UTC', weekday: 'short', day: '2-digit', month: 'short' });
  const cell = (cls: string, text: string) => {
    const s = document.createElement('span');
    s.className = cls;
    s.textContent = text;
    return s;
  };

  lists.forEach((list) => {
    const count = Number(list.dataset.agenda || 6);
    const rows = upcoming(count);
    if (!rows.length) return;
    list.replaceChildren(
      ...rows.map((r) => {
        const li = document.createElement('li');
        li.className = `agenda__row${r.today ? ' is-today' : ''}`;
        li.append(
          cell('agenda__date num', r.today ? words().status.today : fmt.format(r.date)),
          cell('agenda__name', r.name),
          cell('agenda__time num', r.time.replace('-', '–')),
          cell('agenda__meta', [r.artist, r.genre].filter(Boolean).join(' · ')),
        );
        const rail = railFor(r.time);
        if (rail) li.append(rail);
        return li;
      }),
    );
    list.classList.add('is-live');
  });

  // The closing band's "next session" line
  if (nextBox) {
    const [next] = upcoming(1);
    if (next) {
      nextBox.replaceChildren(
        cell('next__when num', next.today ? words().status.tonight : fmt.format(next.date)),
        cell('next__name', next.name),
        cell('next__time num', next.time.replace('-', '–')),
        cell('next__meta', [next.artist, next.genre].filter(Boolean).join(' · ')),
      );
      const rail = railFor(next.time);
      if (rail) nextBox.append(rail);
      nextBox.classList.add('is-live');
    }
  }
}

/* ---------------------------------------------------------- calendar */
/**
 * A real month grid for /sound. Days with sessions carry a dot per session
 * type; the current day is ringed. Prev/next walk the months.
 */
function initCalendar() {
  const root = document.querySelector<HTMLElement>('[data-calendar]');
  if (!root) return;
  const grid = root.querySelector<HTMLElement>('[data-cal-grid]');
  const title = root.querySelector<HTMLElement>('[data-cal-title]');
  const prev = root.querySelector<HTMLButtonElement>('[data-cal-prev]');
  const next = root.querySelector<HTMLButtonElement>('[data-cal-next]');
  if (!grid || !title) return;

  const now = madridNow();
  const todayIso = `${now.y}-${String(now.m).padStart(2, '0')}-${String(now.d).padStart(2, '0')}`;
  let view = { y: now.y, m: now.m - 1 }; // m is 0-indexed here

  const monthName = new Intl.DateTimeFormat(pageLocale(), { timeZone: 'UTC', month: 'long', year: 'numeric' });
  const dayName = new Intl.DateTimeFormat(pageLocale(), { timeZone: 'UTC', weekday: 'long', day: 'numeric', month: 'long' });

  const counter = root.querySelector<HTMLElement>('[data-cal-count]');

  const render = () => {
    const first = new Date(Date.UTC(view.y, view.m, 1));
    const days = new Date(Date.UTC(view.y, view.m + 1, 0)).getUTCDate();
    const lead = (first.getUTCDay() + 6) % 7; // week starts Monday
    title.textContent = monthName.format(first);

    let total = 0;
    const cells: HTMLElement[] = [];
    for (let i = 0; i < lead; i++) {
      const li = document.createElement('li');
      li.className = 'cal__cell cal__cell--pad';
      li.setAttribute('aria-hidden', 'true');
      cells.push(li);
    }
    for (let d = 1; d <= days; d++) {
      const date = new Date(Date.UTC(view.y, view.m, d));
      const iso = isoOf(date);
      const list = sessionsOn(date);
      const li = document.createElement('li');
      li.className = 'cal__cell';
      if (iso === todayIso) li.classList.add('is-today');
      if (list.length) li.classList.add('has-event');

      const num = document.createElement('span');
      num.className = 'cal__num num';
      num.textContent = String(d);
      li.append(num);

      if (list.length) {
        total += list.length;
        const dots = document.createElement('span');
        dots.className = 'cal__dots';
        list.forEach((s) => {
          const dot = document.createElement('i');
          dot.className = `cal__dot cal__dot--${s.name.toLowerCase().replace(/[^a-z]/g, '') || 'event'}`;
          dots.append(dot);
        });
        li.append(dots);
        li.title = `${dayName.format(date)} · ${list.map((s) => `${s.name} ${s.time}`).join(' · ')}`;
        li.setAttribute('aria-label', li.title);
      }
      cells.push(li);
    }
    grid.replaceChildren(...cells);
    if (counter) counter.textContent = String(total);
  };

  const step = (delta: number) => {
    const d = new Date(Date.UTC(view.y, view.m + delta, 1));
    view = { y: d.getUTCFullYear(), m: d.getUTCMonth() };
    render();
  };
  const onPrev = () => step(-1);
  const onNext = () => step(1);
  prev?.addEventListener('click', onPrev);
  next?.addEventListener('click', onNext);
  render();
  onCleanup(() => {
    prev?.removeEventListener('click', onPrev);
    next?.removeEventListener('click', onNext);
  });
}

/* ------------------------------------------------------ home: dayline */
function initDayline() {
  const marker = document.querySelector<HTMLElement>('[data-dayline-marker]');
  const time = document.querySelector<HTMLElement>('[data-dayline-time]');
  const label = document.querySelector<HTMLElement>('[data-dayline-label]');
  if (!marker || !time || !label) return;
  const update = () => {
    const { h, min } = madridNow();
    let t = h + min / 60;
    if (t < 3) t += 24; // 00:00–02:59 belongs to the night before
    const inside = t >= 9 && t < 26;
    marker.hidden = !inside;
    if (inside) {
      marker.style.left = `${(((t - 9) / 17) * 100).toFixed(2)}%`;
      time.textContent = `${String(h).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
      label.textContent = words().nowLabel;
    } else {
      label.textContent = words().closedLabel;
    }
  };
  update();
  const id = window.setInterval(update, 60_000);
  onCleanup(() => window.clearInterval(id));
}

/* ------------------------------------------------------- home: sun arc */
/* ------------------------------------------------------- the sky */
/**
 * The home page's background is the sky over one day. It follows the same
 * scrolled `hour` that drives the clock and the chip, so everything that
 * narrates the day agrees. Stops are mixed in OKLab so the in-betweens stay
 * clean — sRGB mixing turns orange-to-plum into mud.
 *
 * The ink can only flip between dark and light, so it flips at the two hours
 * where the sky crosses the middle of its brightness, and the ramps through
 * those crossings are steep (a few dozen pixels of scroll) so the moment where
 * neither ink reads perfectly is transient and hidden under the theme's own
 * crossfade.
 */
const SKY: [number, string][] = [
  [9.0, '#f8efd1'], // dawn — pale warm yellow
  [10.5, '#f8f2dd'],
  [12.5, '#f7f4ee'], // midday — the whitest point
  [15.0, '#f4efe6'], // bone, the day canvas exactly
  [17.0, '#f6dfcc'], // peach — the sunset chapter opens
  [18.5, '#f4cba6'], // apricot
  [20.0, '#e9a677'], // orange
  [20.75, '#c5705a'], // deep orange — last stop that carries dark ink
  [20.9, '#5c2c3c'], // dusk plum — first stop that carries light ink
  [22.0, '#170f1b'],
  [23.0, '#0b090e'], // night — the night canvas exactly
  [28.6, '#0b090e'],
  [29.2, '#1c1a2c'], // pre-dawn indigo
  [29.5, '#4d4866'],
  [29.75, '#b9b3c6'], // first light — dark ink again
  [30.0, '#e9e4e0'],
  [31.0, '#f8efd1'], // dawn again: "tomorrow, again"
  [33.0, '#f8efd1'],
];
/** Where the ink flips. Between these, the sky is dark and the ink is light. */
const NIGHT_INK_FROM = 20.82;
const NIGHT_INK_TO = 29.6;

type Lab = [number, number, number];
const hexToLab = (hex: string): Lab => {
  const n = parseInt(hex.slice(1), 16);
  const lin = (c: number) => {
    const v = c / 255;
    return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  };
  const r = lin(n >> 16), g = lin((n >> 8) & 255), b = lin(n & 255);
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s2 = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s2,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s2,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s2,
  ];
};
const labToCss = ([L, a, bb]: Lab): string => {
  const l = (L + 0.3963377774 * a + 0.2158037573 * bb) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * bb) ** 3;
  const s2 = (L - 0.0894841775 * a - 1.291485548 * bb) ** 3;
  const gam = (c: number) => {
    const v = Math.max(0, Math.min(1, c));
    return Math.round(255 * (v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055));
  };
  return `rgb(${gam(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s2)} ${gam(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s2)} ${gam(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s2)})`;
};
const SKY_LAB = SKY.map(([h, hex]) => [h, hexToLab(hex)] as [number, Lab]);

/** The sky colour at a given scrolled hour, as a CSS rgb() string. */
function skyAt(h: number): string {
  if (h <= SKY_LAB[0][0]) return labToCss(SKY_LAB[0][1]);
  for (let i = 1; i < SKY_LAB.length; i++) {
    const [h1, c1] = SKY_LAB[i];
    if (h <= h1) {
      const [h0, c0] = SKY_LAB[i - 1];
      const t = (h - h0) / (h1 - h0);
      return labToCss([c0[0] + (c1[0] - c0[0]) * t, c0[1] + (c1[1] - c0[1]) * t, c0[2] + (c1[2] - c0[2]) * t]);
    }
  }
  return labToCss(SKY_LAB[SKY_LAB.length - 1][1]);
}

/** Which token set the ink, lines and accents take at a given hour. */
function themeAt(h: number): string {
  if (h >= NIGHT_INK_FROM && h < NIGHT_INK_TO) return 'night';
  if (h >= 17 && h < NIGHT_INK_FROM) return 'sunset';
  return 'day';
}

const THEME_COLOR: Record<string, string> = { day: '#f4efe6', sunset: '#f3e4dd', night: '#0b0910' };

function setTheme(t: string) {
  const html = document.documentElement;
  if (html.dataset.theme === t) return;
  html.dataset.theme = t;
  const meta = document.querySelector<HTMLMetaElement>('meta[data-theme-color]');
  if (meta && !('sky' in html.dataset)) meta.content = THEME_COLOR[t] ?? THEME_COLOR.day;
}

function initHome() {
  const arc = document.querySelector<HTMLElement>('[data-arc]');
  const nav = document.querySelector<HTMLElement>('[data-nav]');
  const clock = document.querySelector<HTMLElement>('[data-clock]');
  if (!arc) {
    nav?.classList.remove('has-arc');
    if (clock) clock.hidden = true;
    return;
  }
  nav?.classList.add('has-arc');
  if (clock) clock.hidden = false;
  const clockText = document.querySelector<HTMLElement>('[data-clock-text]');
  const sun = document.querySelector<HTMLElement>('[data-sun]');
  const bar = document.querySelector<HTMLElement>('[data-progress]');
  const heroClock = document.querySelector<HTMLElement>('[data-hero-clock]');
  const navChip = document.querySelector<HTMLElement>('[data-now-nav]');
  let lastNarration = '';
  if (navChip) {
    setChip(navChip, narration(9), false);
    lastNarration = narration(9);
  }

  // The sky drives the canvas from here on; the theme (ink, lines, accents)
  // follows the same hour, so the two can never disagree.
  const html = document.documentElement;
  const meta = document.querySelector<HTMLMetaElement>('meta[data-theme-color]');
  html.dataset.sky = '';
  let lastSky = '';
  const paintSky = (hour: number) => {
    const css = skyAt(hour);
    if (css !== lastSky) {
      lastSky = css;
      html.style.setProperty('--canvas', css);
      if (meta) meta.content = css;
    }
    setTheme(themeAt(hour));
  };
  onCleanup(() => {
    html.style.removeProperty('--canvas');
    delete html.dataset.sky;
  });

  // Clock: interpolate between [data-hour] anchors (hours may exceed 24 for "next day")
  const anchors = Array.from(document.querySelectorAll<HTMLElement>('[data-hour]'));
  const fmt = (h: number) => {
    const hh = Math.floor(h) % 24;
    const mm = Math.floor((h % 1) * 60);
    return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
  };
  const update = () => {
    if (!anchors.length) return;
    const y = window.scrollY + 1;
    const tops = anchors.map((a) => a.getBoundingClientRect().top + window.scrollY);
    let hour = Number(anchors[0].dataset.hour);
    for (let i = 0; i < anchors.length; i++) {
      const next = anchors[i + 1];
      const h0 = Number(anchors[i].dataset.hour);
      if (!next) {
        if (y >= tops[i]) hour = h0;
        break;
      }
      const h1 = Number(next.dataset.hour);
      if (y >= tops[i] && y < tops[i + 1]) {
        const t = (y - tops[i]) / Math.max(1, tops[i + 1] - tops[i]);
        hour = h0 + (h1 - h0) * t;
        break;
      }
      if (y < tops[0]) hour = Number(anchors[0].dataset.hour);
    }
    paintSky(hour);
    const text = fmt(hour);
    if (clockText) clockText.textContent = text;
    if (heroClock) heroClock.textContent = text;
    const p = Math.min(1, Math.max(0, (hour - 9) / 24));
    if (bar) bar.style.transform = `scaleX(${p})`;
    if (sun) sun.style.transform = `rotate(${p * 360}deg) scale(${hour % 24 >= 20 || hour % 24 < 7 ? 0.7 : 1})`;
    if (navChip) {
      const n = narration(hour);
      if (n !== lastNarration) {
        lastNarration = n;
        setChip(navChip, n);
      }
    }
  };
  update();
  const st = ScrollTrigger.create({ trigger: arc, start: 'top bottom', end: 'bottom top', onUpdate: update });
  onCleanup(() => st.kill());

  // Parallax (depth only, never on text)
  if (!reduced()) {
    document.querySelectorAll<HTMLElement>('[data-parallax]').forEach((el) => {
      const amt = Number(el.dataset.parallax || 10);
      gsap.fromTo(
        el,
        { yPercent: -amt / 2 },
        {
          yPercent: amt / 2,
          ease: 'none',
          scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
        },
      );
    });
  }
}

/* ------------------------------------------------------- menu page */
function initMenuPage() {
  const root = document.querySelector<HTMLElement>('[data-menu-page]');
  if (!root) return;
  const tabs = root.querySelectorAll<HTMLButtonElement>('[data-tab]');
  const setTab = (tab: string, push = true) => {
    root.dataset.tab = tab;
    tabs.forEach((b) => b.setAttribute('aria-selected', String(b.dataset.tab === tab)));
    if (push) history.replaceState(null, '', `#${tab}`);
  };
  /**
   * Switching tab swaps the whole list under the reader, so the page goes back
   * to the top of the menu — landing halfway down a list you have not seen is
   * disorientating. Lenis owns the scroll when it is running.
   */
  const toTop = () => {
    const top = Math.max(0, root.getBoundingClientRect().top + window.scrollY - 96);
    if (lenis) lenis.scrollTo(top, { duration: reduced() ? 0 : 1 });
    else window.scrollTo({ top, behavior: reduced() ? 'auto' : 'smooth' });
  };
  const initial = location.hash.replace('#', '');
  if (initial === 'drinks' || initial === 'food') setTab(initial, false);
  tabs.forEach((b) =>
    b.addEventListener('click', () => {
      const tab = b.dataset.tab!;
      if (root.dataset.tab === tab) return;
      setTab(tab);
      toTop();
    }),
  );

  // active category chip
  const links = root.querySelectorAll<HTMLAnchorElement>('[data-cat-link]');
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const id = (e.target as HTMLElement).id;
        links.forEach((l) => {
          const on = l.getAttribute('href') === `#${id}`;
          l.classList.toggle('is-active', on);
          if (on) l.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
        });
      });
    },
    { rootMargin: '-30% 0px -60% 0px' },
  );
  root.querySelectorAll<HTMLElement>('[data-cat]').forEach((s) => io.observe(s));
  onCleanup(() => io.disconnect());

  // hairline progress across the sticky bar
  const progress = root.querySelector<HTMLElement>('[data-menu-progress]');
  if (progress) {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      progress.style.transform = `scaleX(${p.toFixed(4)})`;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    onCleanup(() => window.removeEventListener('scroll', onScroll));
  }

  // deep link to a category inside a tab
  if (initial && !['drinks', 'food'].includes(initial)) {
    const target = document.getElementById(initial);
    const tab = target?.closest<HTMLElement>('[data-tab-panel]')?.dataset.tabPanel;
    if (tab) setTab(tab, false);
  }
}

/* --------------------------------------------------------- dish dialog */
/**
 * Every menu row opens the same dialog, filled from the row's own data. Native
 * <dialog> handles focus, Escape and inertness; we add the backdrop click, the
 * scroll lock and the content.
 */
function initDishDialog() {
  const dialog = document.querySelector<HTMLDialogElement>('[data-dish-dialog]');
  const rows = document.querySelectorAll<HTMLButtonElement>('[data-dish]');
  if (!dialog || !rows.length) return;

  const q = <T extends HTMLElement>(sel: string) => dialog.querySelector<T>(sel);
  const media = q('[data-dish-media]');
  const img = q<HTMLImageElement>('[data-dish-img]');
  const thumb = q<HTMLImageElement>('[data-dish-thumb]');
  const haze = q<HTMLImageElement>('[data-dish-haze]');
  const kicker = q('[data-dish-kicker]');
  const name = q('[data-dish-name]');
  const price = q('[data-dish-price]');
  const desc = q('[data-dish-desc]');
  const tags = q('[data-dish-tags]');
  const note = q('[data-dish-note]');
  const noteText = q('[data-dish-note-text]');
  const quote = q('[data-dish-quote]');
  const quoteText = q('[data-dish-quote-text]');
  const quoteBy = q('[data-dish-quote-by]');
  const share = q<HTMLAnchorElement>('[data-dish-share]');

  const open = (row: HTMLElement) => {
    const d = row.dataset;
    if (name) name.textContent = d.name ?? '';
    if (price) price.textContent = d.price ?? '';
    if (kicker) kicker.textContent = d.kicker ?? '';
    if (desc) desc.textContent = d.desc ?? '';

    if (media && img) {
      const src = d.img ?? '';
      const small = d.thumb ?? '';
      media.classList.toggle('is-empty', !src);
      media.classList.toggle('has-thumb', !src && !!small);
      if (src) {
        img.src = src;
        img.alt = d.name ?? '';
      } else {
        img.removeAttribute('src');
        img.alt = '';
      }
      for (const el of [thumb, haze]) {
        if (!el) continue;
        el.hidden = !!src || !small;
        if (!src && small) el.src = small;
        else el.removeAttribute('src');
      }
    }

    if (tags) {
      tags.replaceChildren(
        ...(d.tags ?? '')
          .split('|')
          .filter(Boolean)
          .map((t) => {
            const li = document.createElement('li');
            li.textContent = t;
            return li;
          }),
      );
    }

    const hasNote = !!d.note;
    if (note) note.hidden = !hasNote;
    if (noteText) noteText.textContent = d.note ?? '';
    const hasQuote = !!d.quote;
    if (quote) quote.hidden = !hasQuote;
    if (quoteText) quoteText.textContent = d.quote ?? '';
    if (quoteBy) quoteBy.textContent = d.by ?? '';

    if (share) {
      const line = [d.name, d.price].filter(Boolean).join(' — ');
      const text = [d.share, line, location.href].filter(Boolean).join(' ');
      share.href = 'https://wa.me/?text=' + encodeURIComponent(text);
    }

    dialog.showModal();
    document.body.style.overflow = 'hidden';
    lenis?.stop();
  };

  const close = () => dialog.close();

  const onRow = (e: Event) => open(e.currentTarget as HTMLElement);
  rows.forEach((r) => r.addEventListener('click', onRow));

  // Backdrop click: the dialog element itself is the backdrop area
  const onClick = (e: MouseEvent) => {
    if (e.target === dialog) close();
  };
  const onClose = () => {
    document.body.style.overflow = '';
    lenis?.start();
  };
  dialog.addEventListener('click', onClick);
  dialog.addEventListener('close', onClose);
  dialog.querySelectorAll('[data-dish-close]').forEach((b) => b.addEventListener('click', close));

  onCleanup(() => {
    rows.forEach((r) => r.removeEventListener('click', onRow));
    dialog.removeEventListener('click', onClick);
    dialog.removeEventListener('close', onClose);
    if (dialog.open) dialog.close();
    document.body.style.overflow = '';
    lenis?.start();
  });
}

/* ------------------------------------------------------------ reels */
/** Self-hosted, muted reels: play only while on screen, never with reduced motion. */
function initReels() {
  const reels = document.querySelectorAll<HTMLVideoElement>('video[data-reel]');
  if (!reels.length) return;
  if (reduced()) {
    reels.forEach((v) => v.removeAttribute('autoplay'));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        const v = e.target as HTMLVideoElement;
        if (e.isIntersecting) v.play().catch(() => {});
        else v.pause();
      });
    },
    { threshold: 0.2 },
  );
  reels.forEach((v) => io.observe(v));
  onCleanup(() => io.disconnect());
}

/* ------------------------------------------------------- mobile menu: next */
/** The one-line "next session" inside the mobile menu, from the same agenda. */
function initMiniNext() {
  const when = document.querySelector<HTMLElement>('[data-mini-when]');
  const name = document.querySelector<HTMLElement>('[data-mini-name]');
  const time = document.querySelector<HTMLElement>('[data-mini-time]');
  if (!when || !name || !time) return;
  const [next] = upcoming(1);
  if (!next) return;
  const fmt = new Intl.DateTimeFormat(pageLocale(), { timeZone: 'UTC', weekday: 'long', day: 'numeric', month: 'long' });
  when.textContent = next.today ? words().status.today : fmt.format(next.date);
  name.textContent = next.name;
  time.textContent = next.time;
}

/* ------------------------------------------------------- hash landing */
/**
 * Arriving with a hash from another page: the view transition router swaps the
 * document without the browser's native jump, and Lenis owns the scroll anyway,
 * so the landing has to be made by hand — once, after layout has settled.
 */
function initHashLanding() {
  const id = location.hash.slice(1);
  if (!id) return;
  const target = document.getElementById(id);
  if (!target) return;
  // a tab id on the menu page is handled by initMenuPage, not a scroll
  if (id === 'drinks' || id === 'food') return;

  const land = () => {
    const style = getComputedStyle(target);
    const margin = parseFloat(style.scrollMarginTop) || 92;
    const top = Math.max(0, target.getBoundingClientRect().top + window.scrollY - margin);
    if (lenis) lenis.scrollTo(top, { duration: reduced() ? 0 : 1.1 });
    else window.scrollTo({ top, behavior: reduced() ? 'auto' : 'smooth' });
  };
  // images and split lines change the height under us; land after they settle
  const t1 = window.setTimeout(land, 120);
  const t2 = window.setTimeout(land, 700);
  onCleanup(() => {
    window.clearTimeout(t1);
    window.clearTimeout(t2);
  });
}

/* ------------------------------------------------------- language menu */
/** The <details> switch works on its own; this only closes it politely. */
function initLang() {
  const boxes = document.querySelectorAll<HTMLDetailsElement>('[data-lang]');
  if (!boxes.length) return;
  const closeAll = (except?: Element | null) =>
    boxes.forEach((b) => {
      if (b !== except) b.open = false;
    });
  const onClick = (e: MouseEvent) => closeAll((e.target as Element).closest('[data-lang]'));
  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape') closeAll();
  };
  document.addEventListener('click', onClick);
  document.addEventListener('keydown', onKey);
  onCleanup(() => {
    document.removeEventListener('click', onClick);
    document.removeEventListener('keydown', onKey);
    closeAll();
  });
}

/* ------------------------------------------------------- booking form */
/**
 * The booking request. With no endpoint configured it opens WhatsApp with the
 * message already written, which is the fastest free way for a venue to take a
 * table request; e-mail is the fallback when there is no WhatsApp number.
 */
function initForm() {
  const form = document.querySelector<HTMLFormElement>('[data-contact-form]');
  if (!form) return;
  const status = form.querySelector<HTMLElement>('[data-form-status]');
  const d = form.dataset;
  const say = (msg: string) => {
    if (status) status.textContent = msg;
  };

  const compose = (data: Record<string, string>) => {
    const lines = [d.waIntro ?? ''];
    if (data.when) lines.push(`· ${data.when}`);
    if (data.people) lines.push(`· ${d.waFor ?? ''} ${data.people} ${d.waPeople ?? ''}`.trim());
    if (data.name) lines.push(`· ${data.name}`);
    if (data.phone) lines.push(`· ${data.phone}`);
    if (data.message) lines.push('', data.message);
    return lines.filter(Boolean).join('\n');
  };

  const onSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    const data = Object.fromEntries(new FormData(form).entries()) as Record<string, string>;
    const btn = form.querySelector<HTMLButtonElement>('button[type="submit"]');
    if (btn) btn.disabled = true;

    try {
      if (d.endpoint) {
        say(d.msgSending ?? 'Sending…');
        const res = await fetch(d.endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error(String(res.status));
        say(d.msgSent ?? 'Sent.');
        form.reset();
      } else if (d.whatsapp) {
        window.open(`https://wa.me/${d.whatsapp}?text=${encodeURIComponent(compose(data))}`, '_blank', 'noopener');
        say(d.msgSent ?? 'Sent.');
      } else {
        location.href = `mailto:${site.email}?subject=${encodeURIComponent('Crush')}&body=${encodeURIComponent(compose(data))}`;
        say(d.msgOpening ?? 'Opening your email app…');
      }
    } catch {
      say(d.msgFailed ?? `Something went wrong. Write to ${site.email}.`);
    } finally {
      if (btn) btn.disabled = false;
    }
  };
  form.addEventListener('submit', onSubmit);
  onCleanup(() => form.removeEventListener('submit', onSubmit));
}

/* ------------------------------------------------------- lifecycle */
function init() {
  document.documentElement.classList.add('js');
  initLenis();
  initNav();
  initLang();
  initHashLanding();
  initNow();
  initReveal();
  initAgenda();
  initMiniNext();
  initCalendar();
  initDayline();
  initHome();
  initMenuPage();
  initDishDialog();
  initReels();
  initForm();
  splitLines().then(() => {
    resplitOnResize();
    ScrollTrigger.refresh();
  });
  lenis?.resize();
  window.setTimeout(() => ScrollTrigger.refresh(), 600);
}

function teardown() {
  FEED = null;
  RULE_COPY = null;
  CLIENT_COPY = null;
  cleanups.splice(0).forEach((fn) => fn());
  ScrollTrigger.getAll().forEach((t) => t.kill());
  splits.forEach((s) => s.revert());
  splits.clear();
}

document.addEventListener('astro:page-load', init);
document.addEventListener('astro:before-swap', teardown);
document.addEventListener('astro:after-swap', () => document.documentElement.classList.add('js'));

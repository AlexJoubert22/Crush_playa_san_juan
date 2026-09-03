/**
 * A small iCalendar reader, just enough for a venue agenda.
 *
 * It runs at build time (Node), fetches a public Google Calendar .ics feed and
 * flattens it into plain day-by-day sessions the site can render. Supports
 * single events and WEEKLY / MONTHLY recurrence with BYDAY, INTERVAL, COUNT,
 * UNTIL and EXDATE — which is everything Cadenza and OPUS need.
 *
 * Anything it cannot parse is skipped rather than thrown, so a malformed line
 * in the client's calendar can never break a deploy.
 */

export type FeedSession = {
  /** YYYY-MM-DD in the venue's local day */
  date: string;
  name: string;
  /** "HH:MM - HH:MM" */
  time: string;
  artist: string;
  genre: string;
};

type RawEvent = Record<string, { value: string; params: Record<string, string> }>;

const WEEKDAY_CODES = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];

/** Unfold RFC 5545 continuation lines (a leading space continues the line above). */
function unfold(text: string): string[] {
  return text
    .replace(/\r\n/g, '\n')
    .replace(/\n[ \t]/g, '')
    .split('\n')
    .filter(Boolean);
}

function parseLine(line: string) {
  const colon = line.indexOf(':');
  if (colon === -1) return null;
  const left = line.slice(0, colon);
  const value = line.slice(colon + 1);
  const [name, ...paramParts] = left.split(';');
  const params: Record<string, string> = {};
  for (const p of paramParts) {
    const eq = p.indexOf('=');
    if (eq > 0) params[p.slice(0, eq).toUpperCase()] = p.slice(eq + 1).replace(/^"|"$/g, '');
  }
  return { name: name.toUpperCase(), value, params };
}

/** ICS timestamps → a UTC Date. Floating and TZID times are read as wall time. */
function toDate(value: string): Date | null {
  const m = value.match(/^(\d{4})(\d{2})(\d{2})(?:T(\d{2})(\d{2})(\d{2})(Z)?)?$/);
  if (!m) return null;
  const [, y, mo, d, h = '0', mi = '0', s = '0'] = m;
  return new Date(Date.UTC(+y, +mo - 1, +d, +h, +mi, +s));
}

const isoDay = (d: Date) => d.toISOString().slice(0, 10);
const hhmm = (d: Date) =>
  `${String(d.getUTCHours()).padStart(2, '0')}:${String(d.getUTCMinutes()).padStart(2, '0')}`;

/** Pull "Artist: …" / "Genre: …" out of the description, if the client wrote them. */
function readMeta(description: string) {
  const artist = description.match(/artists?\s*:\s*(.+)/i)?.[1]?.trim() ?? '';
  const genre = description.match(/genres?\s*:\s*(.+)/i)?.[1]?.trim() ?? '';
  return { artist, genre };
}

function addMonths(d: Date, n: number) {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + n, d.getUTCDate(), d.getUTCHours(), d.getUTCMinutes()));
}

/** Nth weekday of a month, e.g. "2SA" = second Saturday. Negative counts back. */
function nthWeekdayOfMonth(year: number, month: number, weekday: number, nth: number): Date | null {
  if (nth > 0) {
    const first = new Date(Date.UTC(year, month, 1));
    const shift = (weekday - first.getUTCDay() + 7) % 7;
    const day = 1 + shift + (nth - 1) * 7;
    const d = new Date(Date.UTC(year, month, day));
    return d.getUTCMonth() === month ? d : null;
  }
  const last = new Date(Date.UTC(year, month + 1, 0));
  const shift = (last.getUTCDay() - weekday + 7) % 7;
  const day = last.getUTCDate() - shift + (nth + 1) * 7;
  const d = new Date(Date.UTC(year, month, day));
  return d.getUTCMonth() === month ? d : null;
}

/** Expand one VEVENT into the concrete days it happens on, within the horizon. */
function expand(ev: RawEvent, from: Date, to: Date): FeedSession[] {
  const start = toDate(ev.DTSTART?.value ?? '');
  if (!start) return [];
  const end = toDate(ev.DTEND?.value ?? '') ?? new Date(start.getTime() + 2 * 3600_000);
  const name = (ev.SUMMARY?.value ?? 'Event').replace(/\\,/g, ',').trim();
  const description = (ev.DESCRIPTION?.value ?? '').replace(/\\n/g, '\n').replace(/\\,/g, ',');
  const { artist, genre } = readMeta(description);
  const time = `${hhmm(start)} - ${hhmm(end)}`;
  const make = (day: Date): FeedSession => ({ date: isoDay(day), name, time, artist, genre });

  const skip = new Set(
    (ev.EXDATE?.value ?? '')
      .split(',')
      .map((v) => toDate(v.trim()))
      .filter(Boolean)
      .map((d) => isoDay(d!)),
  );

  const rule = ev.RRULE?.value;
  if (!rule) {
    return start >= from && start <= to && !skip.has(isoDay(start)) ? [make(start)] : [];
  }

  const parts: Record<string, string> = {};
  rule.split(';').forEach((p) => {
    const [k, v] = p.split('=');
    if (k && v) parts[k.toUpperCase()] = v;
  });
  const freq = parts.FREQ?.toUpperCase();
  const interval = Math.max(1, parseInt(parts.INTERVAL ?? '1', 10));
  const count = parts.COUNT ? parseInt(parts.COUNT, 10) : Infinity;
  const until = parts.UNTIL ? toDate(parts.UNTIL) : null;
  const byDay = (parts.BYDAY ?? '').split(',').filter(Boolean);
  const limit = until && until < to ? until : to;

  const out: FeedSession[] = [];
  const push = (day: Date) => {
    if (day < from || day > limit || out.length >= count) return;
    if (skip.has(isoDay(day))) return;
    out.push(make(day));
  };

  if (freq === 'WEEKLY') {
    const days = byDay.length ? byDay.map((c) => WEEKDAY_CODES.indexOf(c.slice(-2))) : [start.getUTCDay()];
    // walk week by week from the first week of the series
    const cursor = new Date(start.getTime());
    cursor.setUTCDate(cursor.getUTCDate() - ((cursor.getUTCDay() + 6) % 7)); // back to Monday
    let week = 0;
    while (cursor <= limit && out.length < count) {
      if (week % interval === 0) {
        for (const wd of days) {
          if (wd < 0) continue;
          const day = new Date(cursor.getTime());
          day.setUTCDate(day.getUTCDate() + ((wd + 6) % 7));
          day.setUTCHours(start.getUTCHours(), start.getUTCMinutes());
          if (day >= start) push(day);
        }
      }
      cursor.setUTCDate(cursor.getUTCDate() + 7);
      week++;
    }
    return out;
  }

  if (freq === 'MONTHLY') {
    let cursor = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), 1));
    let month = 0;
    while (cursor <= limit && out.length < count) {
      if (month % interval === 0) {
        if (byDay.length) {
          for (const code of byDay) {
            const nth = parseInt(code.slice(0, -2) || '1', 10);
            const wd = WEEKDAY_CODES.indexOf(code.slice(-2));
            if (wd < 0) continue;
            const day = nthWeekdayOfMonth(cursor.getUTCFullYear(), cursor.getUTCMonth(), wd, nth);
            if (day) {
              day.setUTCHours(start.getUTCHours(), start.getUTCMinutes());
              if (day >= start) push(day);
            }
          }
        } else {
          const day = new Date(Date.UTC(cursor.getUTCFullYear(), cursor.getUTCMonth(), start.getUTCDate(), start.getUTCHours(), start.getUTCMinutes()));
          if (day.getUTCMonth() === cursor.getUTCMonth() && day >= start) push(day);
        }
      }
      cursor = addMonths(cursor, 1);
      month++;
    }
    return out;
  }

  if (freq === 'DAILY') {
    const day = new Date(start.getTime());
    while (day <= limit && out.length < count) {
      if (day >= start) push(new Date(day.getTime()));
      day.setUTCDate(day.getUTCDate() + interval);
    }
    return out;
  }

  return start >= from && start <= to ? [make(start)] : [];
}

/**
 * Read a public .ics feed and return every session between today and the
 * horizon. Returns an empty array on any failure — the caller falls back to the
 * hard-coded recurring rules, so a network blip never empties the agenda.
 */
export async function loadIcsFeed(url: string, horizonDays = 150): Promise<FeedSession[]> {
  if (!url) return [];
  let text: string;
  try {
    const res = await fetch(url, { headers: { Accept: 'text/calendar' } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    text = await res.text();
  } catch (err) {
    console.warn(`[crush] calendar feed unavailable, using the built-in rules: ${(err as Error).message}`);
    return [];
  }

  const now = new Date();
  const from = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  const to = new Date(from.getTime() + horizonDays * 86_400_000);

  const sessions: FeedSession[] = [];
  let current: RawEvent | null = null;
  for (const line of unfold(text)) {
    if (line === 'BEGIN:VEVENT') {
      current = {};
      continue;
    }
    if (line === 'END:VEVENT') {
      if (current) {
        try {
          sessions.push(...expand(current, from, to));
        } catch {
          /* one bad event must not sink the build */
        }
      }
      current = null;
      continue;
    }
    if (!current) continue;
    const parsed = parseLine(line);
    if (!parsed) continue;
    const key = parsed.name.split(';')[0];
    // EXDATE can repeat; keep them joined
    if (key === 'EXDATE' && current.EXDATE) {
      current.EXDATE.value += `,${parsed.value}`;
      continue;
    }
    current[key] = { value: parsed.value, params: parsed.params };
  }

  sessions.sort((a, b) => (a.date === b.date ? a.time.localeCompare(b.time) : a.date.localeCompare(b.date)));
  return sessions;
}

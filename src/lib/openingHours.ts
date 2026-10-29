export interface OpeningHour {
  id: string;
  den: string;
  hodiny: string;
  poradi: number;
  aktivni: boolean;
}

/** Mimořádný den (svátek, dovolená, zkrácená doba) — přebije běžný rozvrh. */
export interface SpecialDay {
  date: string; // YYYY-MM-DD
  hodiny: string;
  note: string;
}

/** Názvy dnů podle pořadí v týdnu (1 = pondělí … 7 = neděle). */
export const WEEK_DAYS = ['Pondělí', 'Úterý', 'Středa', 'Čtvrtek', 'Pátek', 'Sobota', 'Neděle'] as const;

export const CLOSED = 'Zavřeno';

export interface OpenStatus {
  isOpen: boolean;
  label: string;
  detail: string;
  todayHours: string;
}

export const DEFAULT_OPENING_HOURS: OpeningHour[] = [
  { id: 'OH-1', den: 'Pondělí', hodiny: '8:00 - 16:00', poradi: 1, aktivni: true },
  { id: 'OH-2', den: 'Úterý', hodiny: '8:00 - 16:00', poradi: 2, aktivni: true },
  { id: 'OH-3', den: 'Středa', hodiny: '8:00 - 16:00', poradi: 3, aktivni: true },
  { id: 'OH-4', den: 'Čtvrtek', hodiny: '8:00 - 16:00', poradi: 4, aktivni: true },
  { id: 'OH-5', den: 'Pátek', hodiny: '8:00 - 16:00', poradi: 5, aktivni: true },
  { id: 'OH-6', den: 'Sobota', hodiny: '9:00 - 14:00', poradi: 6, aktivni: true },
  { id: 'OH-7', den: 'Neděle', hodiny: 'Zavřeno', poradi: 7, aktivni: true },
];

const WEEKDAY_TO_INDEX: Record<string, number> = {
  Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6,
};

const DAY_NAME_TO_INDEX: Record<string, number> = {
  nedele: 0, ne: 0, sunday: 0,
  pondeli: 1, po: 1, monday: 1,
  utery: 2, ut: 2, tuesday: 2,
  streda: 3, st: 3, wednesday: 3,
  ctvrtek: 4, ct: 4, thursday: 4,
  patek: 5, pa: 5, friday: 5,
  sobota: 6, so: 6, saturday: 6,
};

const DAY_OPEN_PHRASE = [
  'v neděli',
  'v pondělí',
  'v úterý',
  've středu',
  've čtvrtek',
  'v pátek',
  'v sobotu',
];

function fold(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

function dayIndexFromName(den: string): number | null {
  const key = fold(den).replace(/[^a-z]/g, '');
  if (key in DAY_NAME_TO_INDEX) return DAY_NAME_TO_INDEX[key];
  const first = fold(den).split(/[\s,/–-]+/)[0]?.replace(/[^a-z]/g, '') ?? '';
  return first in DAY_NAME_TO_INDEX ? DAY_NAME_TO_INDEX[first] : null;
}

interface TimeRange {
  start: number;
  end: number;
}

export function isClosed(hodiny: string): boolean {
  return parseRanges(hodiny).length === 0;
}

function parseRanges(hodiny: string): TimeRange[] {
  const raw = hodiny.trim();
  if (!raw || /zavr/i.test(raw) || /closed/i.test(raw) || raw === '-' || raw === '–') {
    return [];
  }

  return raw
    .split(/[,;]/)
    .map((part) => {
      const match = part.match(/(\d{1,2})[:.](\d{2})\s*[-–—]\s*(\d{1,2})[:.](\d{2})/);
      if (!match) return null;
      const start = Number(match[1]) * 60 + Number(match[2]);
      const end = Number(match[3]) * 60 + Number(match[4]);
      if (Number.isNaN(start) || Number.isNaN(end) || end <= start) return null;
      return { start, end };
    })
    .filter((range): range is TimeRange => range !== null);
}

function formatClock(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}:${m.toString().padStart(2, '0')}`;
}

/** Datum v Praze jako YYYY-MM-DD, posunuté o `offsetDays`. */
export function pragueDate(at: Date = new Date(), offsetDays = 0): string {
  const shifted = new Date(at.getTime() + offsetDays * 86_400_000);
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Prague',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(shifted);
}

/** Hodiny platné pro konkrétní den (YYYY-MM-DD) — mimořádný den má přednost. */
export function hoursForDate(hours: OpeningHour[], specials: SpecialDay[], isoDate: string): string {
  const special = specials.find((row) => row.date === isoDate);
  if (special) return special.hodiny;
  const [year, month, day] = isoDate.split('-').map(Number);
  const weekday = new Date(Date.UTC(year, month - 1, day)).getUTCDay();
  return hoursByWeekday(hours)[weekday]?.hodiny ?? CLOSED;
}

/**
 * Časy pro rezervaci v daný den po `step` minutách. Poslední začíná
 * `step` minut před zavřením. Dnes jen časy, které ještě nenastaly.
 */
export function bookingSlots(
  hours: OpeningHour[],
  specials: SpecialDay[],
  isoDate: string,
  step = 30,
  at: Date = new Date(),
): string[] {
  const now = pragueDate(at) === isoDate ? getPragueParts(at).minutes : -1;
  const slots: string[] = [];
  for (const range of parseRanges(hoursForDate(hours, specials, isoDate))) {
    for (let minute = range.start; minute + step <= range.end; minute += step) {
      if (minute > now) slots.push(formatClock(minute).padStart(5, '0'));
    }
  }
  return slots;
}

export function getPragueParts(at: Date = new Date()): { day: number; minutes: number } {
  const weekday = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Europe/Prague',
    weekday: 'short',
  }).format(at);

  const time = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Prague',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).format(at);

  const [hourRaw, minuteRaw] = time.split(':');
  const day = WEEKDAY_TO_INDEX[weekday] ?? at.getDay();
  const minutes = Number(hourRaw) * 60 + Number(minuteRaw);
  return { day, minutes };
}

function hoursByWeekday(hours: OpeningHour[]): Array<OpeningHour | undefined> {
  const byDay: Array<OpeningHour | undefined> = Array.from({ length: 7 });
  for (const row of hours) {
    if (row.aktivni === false) continue;
    const index = dayIndexFromName(row.den);
    if (index === null) continue;
    byDay[index] = row;
  }
  return byDay;
}

export function getOpenStatus(
  hours: OpeningHour[],
  at: Date = new Date(),
  specials: SpecialDay[] = [],
): OpenStatus {
  const schedule = hours.length > 0 ? hours : DEFAULT_OPENING_HOURS;
  const { day, minutes } = getPragueParts(at);
  const byDay = hoursByWeekday(schedule);
  const specialByDate = new Map(specials.map((special) => [special.date, special]));
  // Hodiny pro den posunutý o `offset` — mimořádný den má přednost
  const hoursFor = (offset: number): string | undefined => {
    const special = specialByDate.get(pragueDate(at, offset));
    if (special) return special.hodiny;
    return byDay[(day + offset) % 7]?.hodiny;
  };

  const todayHours = hoursFor(0) ?? CLOSED;
  const ranges = parseRanges(todayHours);

  const current = ranges.find((range) => minutes >= range.start && minutes < range.end);
  if (current) {
    const remaining = current.end - minutes;
    const detail = remaining <= 60
      ? `zavíráme v ${formatClock(current.end)}`
      : `dnes do ${formatClock(current.end)}`;
    return { isOpen: true, label: 'Otevřeno', detail, todayHours };
  }

  const laterToday = ranges.find((range) => minutes < range.start);
  if (laterToday) {
    const until = laterToday.start - minutes;
    const detail = until <= 60
      ? `otevřeme za ${until} min`
      : `otevřeme dnes v ${formatClock(laterToday.start)}`;
    return { isOpen: false, label: 'Zavřeno', detail, todayHours };
  }

  for (let offset = 1; offset <= 7; offset += 1) {
    const nextDay = (day + offset) % 7;
    const nextHours = hoursFor(offset);
    if (!nextHours) continue;
    const nextRanges = parseRanges(nextHours);
    if (nextRanges.length === 0) continue;
    const first = nextRanges[0];
    const detail = offset === 1
      ? `otevřeme zítra v ${formatClock(first.start)}`
      : `otevřeme ${DAY_OPEN_PHRASE[nextDay]} v ${formatClock(first.start)}`;
    return { isOpen: false, label: 'Zavřeno', detail, todayHours };
  }

  return { isOpen: false, label: 'Zavřeno', detail: 'sledujte otevírací dobu', todayHours };
}

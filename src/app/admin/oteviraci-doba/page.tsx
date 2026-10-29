'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { api, Loading, PageHeader, SaveBar, Switch } from '@/components/admin/ui';
import { useToast } from '@/components/admin/AdminShell';
import {
  CLOSED,
  getOpenStatus,
  pragueDate,
  WEEK_DAYS,
  type OpeningHour,
  type SpecialDay,
} from '@/lib/openingHours';

interface Range {
  from: string;
  to: string;
}

interface DayForm {
  day: number;
  open: boolean;
  ranges: Range[];
}

interface SpecialForm {
  key: number;
  date: string;
  open: boolean;
  range: Range;
  note: string;
}

const DEFAULT_RANGE: Range = { from: '08:00', to: '16:00' };

/* '8:00 - 12:00, 13:00 - 16:00' ↔ [{from:'08:00', to:'12:00'}, …] */
function parse(hodiny: string): Range[] {
  return hodiny
    .split(',')
    .map((part) => part.match(/(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})/))
    .filter((match): match is RegExpMatchArray => match !== null)
    .map((match) => ({
      from: `${match[1].padStart(2, '0')}:${match[2]}`,
      to: `${match[3].padStart(2, '0')}:${match[4]}`,
    }));
}

const clock = (value: string) => value.replace(/^0(\d)/, '$1');

function serialize(open: boolean, ranges: Range[]): string {
  if (!open || ranges.length === 0) return CLOSED;
  return ranges.map((range) => `${clock(range.from)} - ${clock(range.to)}`).join(', ');
}

function rangesValid(open: boolean, ranges: Range[]): boolean {
  if (!open) return true;
  return ranges.every((range, index) => {
    const after = index === 0 || range.from >= ranges[index - 1].to;
    return range.from && range.to && range.from < range.to && after;
  });
}

let specialKey = 0;

function toForm(hours: OpeningHour[], specials: SpecialDay[]) {
  const week: DayForm[] = WEEK_DAYS.map((_, index) => {
    const row = hours.find((item) => item.poradi === index + 1);
    const ranges = row ? parse(row.hodiny) : [];
    return { day: index + 1, open: ranges.length > 0, ranges: ranges.length > 0 ? ranges : [DEFAULT_RANGE] };
  });
  const special: SpecialForm[] = specials.map((item) => {
    const ranges = parse(item.hodiny);
    return {
      key: ++specialKey,
      date: item.date,
      open: ranges.length > 0,
      range: ranges[0] ?? DEFAULT_RANGE,
      note: item.note,
    };
  });
  return { week, special };
}

export default function AdminHoursPage() {
  const toast = useToast();
  const [saved, setSaved] = useState<{ week: DayForm[]; special: SpecialForm[] } | null>(null);
  const [week, setWeek] = useState<DayForm[]>([]);
  const [special, setSpecial] = useState<SpecialForm[]>([]);
  const [saving, setSaving] = useState(false);

  const apply = useCallback((hours: OpeningHour[], specials: SpecialDay[]) => {
    const form = toForm(hours, specials);
    setSaved(form);
    setWeek(form.week);
    setSpecial(form.special);
  }, []);

  useEffect(() => {
    api<{ hours: OpeningHour[]; specials: SpecialDay[] }>('/api/oteviraci-doba')
      .then((data) => apply(data.hours, data.specials))
      .catch((error: Error) => toast({ text: error.message, tone: 'error' }));
  }, [apply, toast]);

  const payload = useMemo(() => ({
    week: week.map((row) => ({ day: row.day, hodiny: serialize(row.open, row.ranges) })),
    specials: special
      .filter((row) => row.date)
      .map((row) => ({ date: row.date, hodiny: serialize(row.open, [row.range]), note: row.note.trim() })),
  }), [week, special]);

  const savedPayload = useMemo(() => saved && JSON.stringify({
    week: saved.week.map((row) => ({ day: row.day, hodiny: serialize(row.open, row.ranges) })),
    specials: saved.special.map((row) => ({ date: row.date, hodiny: serialize(row.open, [row.range]), note: row.note.trim() })),
  }), [saved]);

  const dirty = savedPayload !== null && JSON.stringify(payload) !== savedPayload;
  const valid = week.every((row) => rangesValid(row.open, row.ranges))
    && special.every((row) => row.date && rangesValid(row.open, [row.range]));

  // Náhled stavu přesně tak, jak ho uvidí návštěvník v liště nahoře
  const preview = getOpenStatus(
    payload.week.map((row) => ({ id: `OH-${row.day}`, den: WEEK_DAYS[row.day - 1], hodiny: row.hodiny, poradi: row.day, aktivni: true })),
    new Date(),
    payload.specials,
  );

  const updateDay = (day: number, patch: Partial<DayForm>) => {
    setWeek((rows) => rows.map((row) => (row.day === day ? { ...row, ...patch } : row)));
  };

  const updateRange = (day: number, index: number, patch: Partial<Range>) => {
    setWeek((rows) => rows.map((row) => (
      row.day === day
        ? { ...row, ranges: row.ranges.map((range, i) => (i === index ? { ...range, ...patch } : range)) }
        : row
    )));
  };

  const copyMondayToWeekdays = () => {
    const monday = week[0];
    setWeek((rows) => rows.map((row) => (
      row.day >= 2 && row.day <= 5 ? { ...row, open: monday.open, ranges: monday.ranges.map((r) => ({ ...r })) } : row
    )));
  };

  const updateSpecial = (key: number, patch: Partial<SpecialForm>) => {
    setSpecial((rows) => rows.map((row) => (row.key === key ? { ...row, ...patch } : row)));
  };

  const save = async () => {
    if (!valid) {
      toast({ text: 'Zkontrolujte časy: konec musí být po začátku a u mimořádného dne vyplňte datum.', tone: 'error' });
      return;
    }
    setSaving(true);
    try {
      const data = await api<{ hours: OpeningHour[]; specials: SpecialDay[] }>('/api/oteviraci-doba', {
        method: 'PUT',
        json: payload,
      });
      apply(data.hours, data.specials);
      toast({ text: 'Otevírací doba uložena. Na webu platí hned.', tone: 'ok', link: { href: '/kontakty#oteviraci-doba', label: 'Zobrazit' } });
    } catch (error) {
      toast({ text: (error as Error).message, tone: 'error' });
    } finally {
      setSaving(false);
    }
  };

  if (!saved) return <Loading />;

  return (
    <>
      <PageHeader
        title="Otevírací doba"
        description="Změny se ukážou v liště nahoře na webu, na stránce Kontakty, v rezervacích i v chatu."
      />

      <section className="admin-card admin-status mb-6">
        <span className={`admin-dot ${preview.isOpen ? 'is-open' : ''}`} aria-hidden="true" />
        <p className="text-sm text-theme-secondary">
          Návštěvník teď uvidí: <strong className="text-theme">{preview.label}</strong>, {preview.detail}
        </p>
      </section>

      <section className="admin-card mb-6">
        <div className="admin-section-head">
          <h2>Běžný týden</h2>
          <button type="button" className="admin-link-button" onClick={copyMondayToWeekdays}>
            Pondělí zkopírovat na út–pá
          </button>
        </div>

        <ul className="admin-hours">
          {week.map((row) => (
            <li key={row.day} className="admin-hours-row" data-closed={!row.open}>
              <span className="admin-hours-day">{WEEK_DAYS[row.day - 1]}</span>
              <Switch checked={row.open} onChange={(open) => updateDay(row.day, { open })} label={row.open ? 'Otevřeno' : 'Zavřeno'} />
              {row.open && (
                <div className="admin-hours-ranges">
                  {row.ranges.map((range, index) => (
                    <div key={index} className="admin-time-range" data-invalid={!rangesValid(true, row.ranges.slice(0, index + 1))}>
                      {index > 0 && <span className="text-theme-muted text-xs">a</span>}
                      <input
                        type="time"
                        className="form-input"
                        value={range.from}
                        onChange={(event) => updateRange(row.day, index, { from: event.target.value })}
                        aria-label={`${WEEK_DAYS[row.day - 1]} od`}
                      />
                      <span aria-hidden="true">–</span>
                      <input
                        type="time"
                        className="form-input"
                        value={range.to}
                        onChange={(event) => updateRange(row.day, index, { to: event.target.value })}
                        aria-label={`${WEEK_DAYS[row.day - 1]} do`}
                      />
                      {index > 0 && (
                        <button
                          type="button"
                          className="admin-icon-button"
                          onClick={() => updateDay(row.day, { ranges: row.ranges.slice(0, 1) })}
                          aria-label="Odebrat přestávku"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                  {row.ranges.length === 1 && (
                    <button
                      type="button"
                      className="admin-link-button"
                      onClick={() => {
                        const [first] = row.ranges;
                        updateDay(row.day, {
                          ranges: [{ from: first.from, to: '12:00' }, { from: '13:00', to: first.to }],
                        });
                      }}
                    >
                      + přestávka
                    </button>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section className="admin-card mb-6">
        <div className="admin-section-head">
          <div>
            <h2>Mimořádné dny</h2>
            <p className="text-theme-secondary text-sm">Svátky, dovolená nebo zkrácená doba. Po uplynutí zmizí samy.</p>
          </div>
          <button
            type="button"
            className="btn-tech-secondary btn-compact"
            onClick={() => setSpecial((rows) => [
              ...rows,
              { key: ++specialKey, date: '', open: false, range: DEFAULT_RANGE, note: '' },
            ])}
          >
            + Přidat den
          </button>
        </div>

        {special.length === 0 ? (
          <p className="text-theme-muted text-sm">Žádné mimořádné dny. Platí běžný týden.</p>
        ) : (
          <ul className="admin-hours">
            {special.map((row) => (
              <li key={row.key} className="admin-hours-row admin-special-row">
                <input
                  type="date"
                  className="form-input admin-date"
                  value={row.date}
                  min={pragueDate()}
                  onChange={(event) => updateSpecial(row.key, { date: event.target.value })}
                  aria-label="Datum"
                />
                <Switch checked={row.open} onChange={(open) => updateSpecial(row.key, { open })} label={row.open ? 'Otevřeno' : 'Zavřeno'} />
                {row.open && (
                  <div className="admin-time-range" data-invalid={!rangesValid(true, [row.range])}>
                    <input
                      type="time"
                      className="form-input"
                      value={row.range.from}
                      onChange={(event) => updateSpecial(row.key, { range: { ...row.range, from: event.target.value } })}
                      aria-label="Od"
                    />
                    <span aria-hidden="true">–</span>
                    <input
                      type="time"
                      className="form-input"
                      value={row.range.to}
                      onChange={(event) => updateSpecial(row.key, { range: { ...row.range, to: event.target.value } })}
                      aria-label="Do"
                    />
                  </div>
                )}
                <input
                  className="form-input admin-special-note"
                  placeholder="Poznámka, např. Státní svátek"
                  value={row.note}
                  maxLength={120}
                  onChange={(event) => updateSpecial(row.key, { note: event.target.value })}
                  aria-label="Poznámka"
                />
                <button
                  type="button"
                  className="admin-icon-button"
                  onClick={() => setSpecial((rows) => rows.filter((item) => item.key !== row.key))}
                  aria-label="Odebrat mimořádný den"
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <SaveBar
        dirty={dirty}
        saving={saving}
        onSave={save}
        onReset={() => {
          setWeek(saved.week);
          setSpecial(saved.special);
        }}
      />
    </>
  );
}

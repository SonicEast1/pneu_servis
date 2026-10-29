'use client';

import type { ReactNode } from 'react';

/** Nadpis stránky adminu: název, jedna věta vysvětlení, případně tlačítko vpravo. */
export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <header className="admin-header">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-theme">{title}</h1>
        <p className="text-theme-secondary text-sm mt-1 max-w-2xl">{description}</p>
      </div>
      {action && <div className="admin-header-action">{action}</div>}
    </header>
  );
}

/** Přepínač ano/ne. */
export function Switch({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
}) {
  return (
    <label className="admin-switch">
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
      <span className="admin-switch-track" aria-hidden="true" />
      <span>{label}</span>
    </label>
  );
}

/** Výběr jedné z několika možností (segmentové tlačítko). */
export function Segmented<T extends string>({
  value,
  options,
  onChange,
  label,
}: {
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
  label: string;
}) {
  return (
    <div className="admin-segmented" role="radiogroup" aria-label={label}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          role="radio"
          aria-checked={value === option.value}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

/** Lišta s tlačítkem Uložit, drží se u spodního okraje, když jsou neuložené změny. */
export function SaveBar({
  dirty,
  saving,
  onSave,
  onReset,
}: {
  dirty: boolean;
  saving: boolean;
  onSave: () => void;
  onReset: () => void;
}) {
  return (
    <div className="admin-savebar" data-dirty={dirty}>
      <span className="text-sm">{dirty ? 'Máte neuložené změny' : 'Vše uloženo'}</span>
      <div className="flex gap-2">
        {dirty && (
          <button type="button" className="btn-tech-secondary btn-compact" onClick={onReset} disabled={saving}>
            Zahodit
          </button>
        )}
        <button type="button" className="btn-tech-primary btn-compact" onClick={onSave} disabled={!dirty || saving}>
          {saving ? 'Ukládám…' : 'Uložit změny'}
        </button>
      </div>
    </div>
  );
}

export function Loading({ text = 'Načítám…' }: { text?: string }) {
  return (
    <div className="py-16 text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[var(--accent)] mx-auto mb-3" />
      <p className="text-theme-muted text-sm">{text}</p>
    </div>
  );
}

/** fetch s JSON a srozumitelnou chybou (zobrazí se v oznámení). */
export async function api<T>(url: string, init?: RequestInit & { json?: unknown }): Promise<T> {
  const { json, ...rest } = init ?? {};
  const response = await fetch(url, {
    ...rest,
    headers: json === undefined ? rest.headers : { 'Content-Type': 'application/json', ...rest.headers },
    body: json === undefined ? rest.body : JSON.stringify(json),
    cache: 'no-store',
  });
  const body = await response.json().catch(() => ({}));
  if (response.status === 401) {
    window.location.reload();
    throw new Error('Přihlášení vypršelo, přihlaste se znovu.');
  }
  if (!response.ok) {
    throw new Error(typeof body.error === 'string' ? body.error : 'Něco se nepovedlo. Zkuste to znovu.');
  }
  return body as T;
}

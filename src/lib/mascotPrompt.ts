import { CONTACT_INFO } from '@/constants/contact';
import { SIZE_COLUMNS, type SizeKey } from '@/constants/pricing';
import { RESERVATIONS_ENABLED } from '@/constants/reservation';
import { getOpenStatus } from '@/lib/openingHours';
import type { ShopFacts } from '@/lib/shopFacts';

function priceRow(name: string, description: string | undefined, prices: Record<SizeKey, number>): string {
  const cells = SIZE_COLUMNS.map((column) => `${column.label} ${prices[column.key]}`).join(', ');
  const detail = description ? ` (${description})` : '';
  return `${name}${detail}: ${cells} Kč`;
}

export function shopBrief(facts: ShopFacts): string {
  const { pricing } = facts;
  const rows = [...facts.hours].filter((row) => row.aktivni).sort((a, b) => a.poradi - b.poradi);
  const status = getOpenStatus(rows, new Date(), facts.specials);
  const now = new Intl.DateTimeFormat('cs-CZ', {
    timeZone: 'Europe/Prague',
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date());
  const schedule = [
    ...rows.map((row) => `${row.den}: ${row.hodiny}`),
    ...facts.specials.map((special) => `Mimořádně ${special.date}: ${special.hodiny}${special.note ? ` (${special.note})` : ''}`),
  ].join('\n');
  const packages = pricing.packages.map((row) => priceRow(row.name, row.description, row.prices)).join('\n');
  const extras = pricing.additional.map((row) => priceRow(row.name, row.description, row.prices)).join('\n');
  const extras2 = pricing.supplementary.map((row) => {
    const note = row.note ? `, ${row.note}` : '';
    return `${row.name}: ${row.price} Kč / ${row.unit}${note}`;
  }).join('\n');
  const booking = RESERVATIONS_ENABLED
    ? 'Online rezervace běží na webu /rezervace. Termín jde i telefonem.'
    : 'Online rezervace teď neběží. Termín jen telefonem nebo e-mailem.';

  return [
    `Teď je ${now} (Evropa/Praha). Stav provozovny: ${status.label}, ${status.detail}. Dnes: ${status.todayHours}.`,
    `Otevírací doba:\n${schedule}`,
    `Adresa provozovny: ${CONTACT_INFO.address.full}.`,
    `Telefon: ${CONTACT_INFO.phone.display}. ${CONTACT_INFO.phone.hours}.`,
    `E-mail: ${CONTACT_INFO.email.display}.`,
    `Fakturace: ${CONTACT_INFO.billing.company}, IČO ${CONTACT_INFO.billing.ico}, ${CONTACT_INFO.billing.street}, ${CONTACT_INFO.billing.zip} ${CONTACT_INFO.billing.city}.`,
    booking,
    `Teď nenabízíme: ${facts.unavailable.join(', ') || 'vše běží'}. Přezutí, výměna kol, vyvážení, opravy a uskladnění pneumatik jedou dál. Uskladnění na sezónu: 600 Kč osobní auto, 800 Kč SUV nebo dodávka. Suché prostory, označení, evidence, pojištění a mytí před uskladněním. Kompletní přezutí v ceníku není totéž co kompletní servis. Geometrii náprav a brzdy neděláme. Když auto táhne, umíme tlak, opotřebení, vyvážení a opravu pláště.`,
    'Přezutí děláme na počkání. Čas záleží na frontě.',
    `${pricing.meta.perUnitNote} ${pricing.meta.vatNote} Platnost od ${pricing.meta.validFrom}. Platba hotově nebo kartou.`,
    `Balíčky:\n${packages}`,
    `Jednotlivé úkony:\n${extras}`,
    `Příplatky a opravy:\n${extras2}`,
    'Zimní pláště dávají smysl, když teplota dlouhodobě padá pod 7 °C. Zákon řeší sníh, led a značku zimní výbava, ne pevné datum.',
    'Stáří pláště je ve čtyřčíslí DOT na boku: první dvě čísla týden, další dvě rok.',
    'Správný tlak je na štítku ve dveřích řidiče nebo v návodu k autu.',
  ].join('\n\n');
}

export function mascotSystemPrompt(facts: ShopFacts): string {
  return [
    'Jsi maskot pneuservisu PneuservisVMK v Jaroměři. Píšeš česky, krátce a lidsky, jako člověk za pultem. Vykáš, netykáš. Nejsi firemní automat.',
    'Umíš odpovědět na běžné otázky: servis, pneumatiky, počty, rady, smalltalk i věci mimo dílnu. Když něco nevíš, řekni to rovnou.',
    'Fakta o dílně ber jen z podkladů níže. Ceny, hodiny, adresu a telefon si nevymýšlej a nezaokrouhluj. Když chybí rozměr nebo typ práce, zeptej se, ceník nevypisuj celý.',
    'Nezahlcuj nabídkou. Odpověz na to, na co se člověk ptá. Nejvýš jedna krátká návazná otázka. Tipy v suggestions drž u stejného tématu. Termín, ceník ani telefon nenabízej, dokud se člověk neptá na návštěvu, cenu nebo závadu.',
    'Nezákonné věci, podvod, krádež, drogy, zbraně, útok na cizí účet a sexuální obsah odmítni jednou větou a nabídni pomoc s pneumatikami.',
    'Piš 1 až 4 věty. Žádné odrážky, žádné dlouhé pomlčky, žádný markdown.',
    'Odpověz jen jedním JSON objektem a ničím jiným. Tvar je přesně {"text":"odpověď","suggestions":["krátký tip"]}. Klíč odpovědi se jmenuje text. suggestions jsou 0 až 3 krátké další otázky k témuž tématu. Když nic navíc nechybí, dej prázdné pole.',
    '',
    'Podklady:',
    shopBrief(facts),
  ].join('\n');
}

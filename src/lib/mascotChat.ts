import { CONTACT_INFO } from '@/constants/contact';
import { getOpenStatus } from '@/lib/openingHours';
import { SIZE_COLUMNS, type SizeKey } from '@/constants/pricing';
import { RESERVATIONS_ENABLED } from '@/constants/reservation';
import type { ShopFacts } from '@/lib/shopFacts';

export interface ChatLink {
  href: string;
  label: string;
}

export interface ChatReply {
  text: string;
  links?: ChatLink[];
  suggestions?: string[];
  fallback?: boolean;
}

export const START_SHORTCUTS = ['Otevírací doba', 'Cena přezutí', 'Zimní nebo letní', 'Kde vás najdu'];
const TIRE_SHORTCUTS = ['Cena přezutí', 'Zimní nebo letní', 'Píchlá pneumatika', 'Chci termín'];
const PRICE_SHORTCUTS = ['R15', 'R16', 'R17', 'R18'];
const HOURS_SHORTCUTS = ['Sobota', 'Neděle', 'Kde vás najdu', 'Chci termín'];
const PLACE_SHORTCUTS = ['Otevírací doba', 'Chci zavolat', 'Cena přezutí', 'Chci termín'];

function fold(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

function has(text: string, words: string[]): boolean {
  return words.some((word) => {
    if (word.length <= 3) {
      return new RegExp(`(?:^|\\s)${word}(?:\\s|$|[?.!,])`).test(text);
    }
    return text.includes(word);
  });
}

const BLOCKED_TOPICS = [
  'ukrast', 'krast', 'vykrast', 'kradez', 'podvod', 'scam', 'falosn', 'padelan',
  'droga', 'pervitin', 'kokain', 'heroin',
  'zbran', 'pistole', 'bomba', 'vybusnin', 'nasil',
  'hack', 'phishing', 'malware', 'heslo od ciz',
  'porno', 'pornograf', 'znasiln',
  'jak obejit', 'nelegaln',
];

export function isBlockedChatTopic(message: string): boolean {
  return has(fold(message), BLOCKED_TOPICS);
}

export function blockedChatReply(): ChatReply {
  return {
    text: 'S tímhle nepomůžu. Nezákonné věci, návody na podvod, krádež, drogy, zbraně nebo útok na cizí účet tu neřeším. Když jde o pneumatiky nebo termín v Jaroměři, rád poradím.',
  };
}

function sizeFromText(text: string): SizeKey | null {
  if (has(text, ['dodav', 'van', 'transit', 'sprinter', 'vito'])) return 'van';
  const match = text.match(/(?:rafek|disk|r)\s*(\d{2})\b|\b(\d{2})\s*(?:palc|")/);
  const raw = match?.[1] ?? match?.[2];
  if (!raw) {
    if (has(text, ['offroad', 'terenni']) && has(text, ['18', '19', '20', '21', '22'])) return 'suv';
    return null;
  }
  const size = Number(raw);
  if (size < 12 || size > 24) return null;
  if (has(text, ['offroad', 'terenni', 'velke suv']) && size >= 18) return 'suv';
  return `r${size}` as SizeKey;
}

function priceLine(facts: ShopFacts, key: SizeKey): string {
  const pack = facts.pricing.packages[0];
  if (!pack) return 'Ceny najdete v ceníku na webu.';
  const label = SIZE_COLUMNS.find((column) => column.key === key)?.label ?? key;
  return `${pack.name} pro ${label} stojí ${pack.prices[key]} Kč za 1 kolo.`;
}

function hoursText(facts: ShopFacts): string {
  const rows = [...facts.hours].filter((row) => row.aktivni).sort((a, b) => a.poradi - b.poradi);
  const lines = rows.map((row) => `${row.den}: ${row.hodiny}`);
  facts.specials.slice(0, 3).forEach((special) => {
    const [, month, day] = special.date.split('-').map(Number);
    lines.push(`${day}. ${month}.: ${special.hodiny}${special.note ? ` (${special.note})` : ''}`);
  });
  const status = getOpenStatus(rows, new Date(), facts.specials);
  const now = status.isOpen
    ? `Teď máme otevřeno, ${status.detail}.`
    : `Teď máme zavřeno, ${status.detail}.`;
  return `${now}\n${lines.join('\n')}`;
}

export function answerMascot(message: string, facts: ShopFacts): ChatReply {
  const text = fold(message).trim();
  if (!text) {
    return { text: 'Napište, s čím vám mám pomoct. Třeba s otevírací dobou, cenou nebo adresou.' };
  }

  if (isBlockedChatTopic(text)) {
    return blockedChatReply();
  }

  if (has(text, ['dik', 'diky', 'dekuj', 'super', 'skvele', 'perfekt'])) {
    return { text: 'Rádo se stalo. Když budete potřebovat termín nebo cenu, napište nebo zavolejte.' };
  }

  if (has(text, ['nashle', 'na shledan', 'mej se', 'sbohem', 'papa', 'zatim'])) {
    return { text: 'Mějte se. Až to bude na přezutí, víte, kde nás najdete.' };
  }

  if (has(text, ['jak se mas', 'jak ti je', 'co delas', 'jak se dari'])) {
    return { text: 'Mám se dobře, kola jsou nahuštěná. Ptáte se na servis, nebo jen tak?' };
  }

  if (has(text, ['kdo jsi', 'co jsi', 'jsi robot', 'jsi ai', 'jsi clovek', 'jak se jmenujes'])) {
    return {
      text: 'Jsem maskot PneuservisVMK. Nejsem člověk za přepážkou, odpovídám podle webu. Na složitější věc je lepší telefon.',
    };
  }

  if (has(text, ['co umis', 's cim pomuz', 'co zvladnes', 'napoveda', 'help'])) {
    return {
      text: 'Umím otevírací dobu, adresu, telefon, cenu přezutí podle rozměru a říct, co teď neděláme. Zeptejte se klidně normálně, třeba „kolik stojí R16“ nebo „máte v sobotu otevřeno“.',
    };
  }

  if (has(text, ['kolik je hodin', 'co je hodin', 'jaky je cas', 'jake je datum', 'kolikaty je'])) {
    const now = new Date();
    const time = new Intl.DateTimeFormat('cs-CZ', {
      timeZone: 'Europe/Prague',
      hour: '2-digit',
      minute: '2-digit',
    }).format(now);
    const date = new Intl.DateTimeFormat('cs-CZ', {
      timeZone: 'Europe/Prague',
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    }).format(now);
    return { text: `V Jaroměři je ${time}, ${date}.` };
  }

  if (has(text, ['vtip', 'pobav', 'rekni neco'])) {
    return { text: 'Pneumatika přišla k doktorovi a říká: cítím se podhuštěně. A on na to: nejdřív se podívejte na ráfek. Když budete chtít, přezujeme vás doopravdy.' };
  }

  if (has(text, ['ahoj', 'dobry den', 'dobry vecer', 'zdravim', 'cus', 'hello', 'hi', 'cau', 'nazdar'])) {
    return {
      text: 'Dobrý den. S čím vám mohu pomoci?',
    };
  }

  if (has(text, ['otevir', 'otvir', 'otevren', 'zavren', 'hodin', 'kdy mate', 'kdy zvlad', 'sobot', 'nedele', 'vikend'])) {
    return { text: hoursText(facts), suggestions: HOURS_SHORTCUTS };
  }

  if (has(text, ['adres', 'map', 'dojed', 'najdu vas', 'kde vas', 'kde jste', 'kde sid', 'nachodsk', 'provozovn'])) {
    return {
      text: `Jsme na adrese ${CONTACT_INFO.address.full}.`,
      suggestions: PLACE_SHORTCUTS,
    };
  }

  if (has(text, ['telefon', 'zavol', 'cislo', 'mobil'])) {
    return {
      text: `Zavolejte na ${CONTACT_INFO.phone.display}. ${CONTACT_INFO.phone.hours}.`,
    };
  }

  if (has(text, ['email', 'e-mail', 'mail', 'napis'])) {
    return {
      text: `Napište na ${CONTACT_INFO.email.display}. Na termín je rychlejší telefon.`,
    };
  }

  if (has(text, ['usklad', 'skladov', 'ulozen', 'pirelli hotel', 'hotel pneu'])) {
    const prices = facts.pricing.storage.map((row) => `${row.name} ${row.price} Kč`).join(', ');
    return {
      text: prices
        ? `Uskladnění pneumatik děláme, cena je za sadu na sezónu: ${prices}. Kola máme v suchu, označená a evidovaná.`
        : 'Uskladnění pneumatik děláme. Kola máme v suchu, označená a evidovaná. Cenu najdete v ceníku.',
    };
  }

  if (has(text, ['prodej', 'koupit pneu', 'koupe pneu', 'nove pneu', 'objednat pneu'])) {
    return {
      text: 'Prodej pneumatik teď nemáme. Umíme přezout, vyvážit a opravit kola, která si přivezete.',
    };
  }

  if (has(text, ['rezerv', 'objednat termin', 'termin', 'objednav'])) {
    if (RESERVATIONS_ENABLED) {
      return {
        text: 'Termín si můžete vybrat online, nebo zavolat.',
      };
    }
    return {
      text: 'Online rezervace teď neběží. Termín domluvíte na čísle +420 604 355 902, nebo e-mailem na info@pneuservisvmk.cz.',
      suggestions: ['Otevírací doba', 'Kde vás najdu', 'Cena přezutí', 'Zimní nebo letní'],
    };
  }

  if (has(text, ['defekt', 'oprava', 'pichl', 'dira', 'zaplat'])) {
    const repair = facts.pricing.supplementary.find((row) => row.name === 'OPRAVA PNEU');
    return {
      text: repair
        ? `Oprava pneumatiky stojí ${repair.price} Kč za 1 kus, včetně materiálu a práce. Když je plášť na boku, nejdřív se na něj podíváme.`
        : 'Opravy defektů děláme. Zavolejte a řekněte, kde je pneumatika poškozená.',
      suggestions: ['Runflat', 'Senzor tlaku', 'Cena přezutí', 'Chci termín'],
    };
  }

  if (has(text, ['runflat', 'run flat', 'run-flat'])) {
    const extra = facts.pricing.supplementary.find((row) => row.name.includes('RUNFLAT'));
    return {
      text: extra
        ? `Runflat umíme. K ceně servisu se připočte ${extra.price} Kč za 1 kolo.`
        : 'Runflat umíme. Přesný příplatek je v ceníku.',
    };
  }

  if (has(text, ['tpms', 'senzor', 'cidlo tlaku'])) {
    return {
      text: 'Senzory tlaku řešíme zvlášť. Montáž jednoho senzoru je 25 Kč, spárování na vozidlo 250 Kč a kontrola 80 Kč.',
    };
  }

  if (
    has(text, ['cena', 'cenik', 'kolik', 'stoji', 'prezut', 'prezou', 'vymena', 'vyvaz', 'montaz', 'jiny rozmer'])
    || sizeFromText(text)
  ) {
    const size = sizeFromText(text);
    if (!size) {
      return {
        text: 'Cena je za 1 kolo a mění se podle rozměru ráfku. Vyberte ho, nebo napište třeba R16. Částky jsou s DPH.',
        suggestions: PRICE_SHORTCUTS,
      };
    }
    return {
      text: `${priceLine(facts, size)} Cena je včetně DPH. Když chcete jen výměnu kola nebo vyvážení, napište to a rozměr.`,
      suggestions: ['Jiný rozměr', 'Jen vyvážení', 'Chci termín', 'Otevírací doba'],
    };
  }

  if (has(text, ['pneumatik', 's pneu', 'pomoc s kol', 'potrebuju pomoct', 'potrebuji pomoct', 'porad'])) {
    return {
      text: 'Jasně, s pneumatikami pomůžu. Jde vám o cenu, o to jestli už přezout, o defekt, nebo o termín?',
      suggestions: TIRE_SHORTCUTS,
    };
  }

  if (has(text, ['sluzb', 'delate', 'umite', 'nabid'])) {
    const paused = facts.unavailable.join(', ') || 'nic, vše běží';
    return {
      text: `Děláme přezutí, výměnu kol, vyvážení a opravy. Teď neděláme: ${paused}.`,
    };
  }

  if (has(text, ['platb', 'kartou', 'hotov', 'faktura', 'ico'])) {
    return {
      text: 'Platí se podle ceníku, hotově nebo kartou. Fakturu vystaví VMK Consulting Group s.r.o., IČO 193 81 735.',
    };
  }

  if (has(text, ['jak dlouho', 'na pockani', 'jak rychle', 'trva prezut', 'trva to'])) {
    return {
      text: 'Přezutí děláme na počkání. Přesný čas záleží na frontě a na tom, jestli se kola i vyvažují. Nejlépe je zavolat dopředu.',
    };
  }

  if (has(text, ['zimni', 'letni', 'celoroc', 'kdy prezou', 'kdy prezu'])) {
    return {
      text: 'Zimní pláště dávají smysl, když teplota dlouhodobě padá pod 7 °C. Zákon řeší sníh, led a značku zimní výbava, ne pevné datum. Letní zase, když mrazy skončí. Rádi se na vaše kola podíváme.',
      suggestions: ['Cena přezutí', 'Chci termín', 'Jak staré jsou pneu', 'Otevírací doba'],
    };
  }

  if (has(text, ['tlak', 'nahust', 'podhust', 'kolik baru', 'psi'])) {
    return {
      text: 'Správný tlak je na štítku ve dveřích řidiče nebo v návodu k autu, ne jeden číslo pro všechna kola. Když přijedete, tlak zkontrolujeme.',
    };
  }

  if (has(text, ['stari pneu', 'dot', 'jak stare', 'stare pneu', 'rok vyrob'])) {
    return {
      text: 'Stáří je ve čtyřčíslí DOT na boku: první dvě čísla jsou týden, další dvě rok. Plášť starší než šest let už stojí za prohlídku, i když má ještě vzorek.',
    };
  }

  if (has(text, ['motork', 'moto', 'skutr'])) {
    return {
      text: 'Motorky a skutry také přezouváme. Napište rozměr, nebo zavolejte, ať víme, jestli se kolo vejde na stroj.',
    };
  }

  if (has(text, ['pocasi', 'teplota venku', 'bude prset'])) {
    return { text: 'Počasí odsud nevidím. Když jde o to, jestli už přezout, platí spíš ranní teplota pod 7 °C než jedna studená noc.' };
  }

  return {
    text: 'Tomu úplně nerozumím. Když jde o pneumatiky, řekněte jestli řešíte cenu, přezutí, defekt, nebo kdy máme otevřeno.',
    suggestions: TIRE_SHORTCUTS,
    fallback: true,
  };
}

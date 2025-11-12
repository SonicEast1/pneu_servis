import { NextRequest, NextResponse } from 'next/server';
import { mkdir, access, readFile, writeFile } from 'fs/promises';
import path from 'path';
import * as XLSX from 'xlsx';

interface Service {
  id: string;
  nazev: string;
  popis: string;
  ikona: string;
  cenaOsobni: string;
  cenaSUV: string;
  features: string; // Oddělené středníkem
  kategorie?: string;
  aktivni: boolean;
  poradi?: number;
}

const EXCEL_FILE = path.join(process.cwd(), 'data', 'cenik_sluzby.xlsx');

// Zajistit, že složka data existuje
async function ensureDataDir() {
  const dataDir = path.join(process.cwd(), 'data');
  try {
    await mkdir(dataDir, { recursive: true });
  } catch (error) {
    // Složka už existuje
  }
}

// Zkontrolovat, zda soubor existuje
async function fileExists(filePath: string): Promise<boolean> {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

// Inicializovat Excel soubor s výchozími daty
async function initializeExcelFile() {
  await ensureDataDir();

  const defaultServices: Service[] = [
    {
      id: 'SRV-1',
      nazev: 'Výměna pneumatik',
      popis: 'Rychlá a profesionální výměna pneumatik. Osobní auta, SUV a dodávky, motocykly. Kontrola tlaku.',
      ikona: '🔧',
      cenaOsobni: '400 Kč',
      cenaSUV: '600 Kč',
      features: 'Osobní auta;SUV a dodávky;Motocykly;Kontrola tlaku',
      kategorie: 'Základní služby',
      aktivni: true,
      poradi: 1,
    },
    {
      id: 'SRV-2',
      nazev: 'Vyvážení kol',
      popis: 'Precizní vyvážení na moderním zařízení pro klidnou jízdu bez vibrací.',
      ikona: '⚖️',
      cenaOsobni: '150 Kč',
      cenaSUV: '200 Kč',
      features: 'Dynamické vyvážení;Statické vyvážení;Kontrola geometrie;Diagnostika vibrací',
      kategorie: 'Základní služby',
      aktivni: true,
      poradi: 2,
    },
    {
      id: 'SRV-3',
      nazev: 'Uskladnění pneu',
      popis: 'Skladujeme vaše pneumatiky v optimálních podmínkách. Suché prostory, označení a evidence.',
      ikona: '📦',
      cenaOsobni: '600 Kč/sezóna',
      cenaSUV: '800 Kč/sezóna',
      features: 'Suché prostory;Označení a evidence;Pojištění;Mytí před uskladněním',
      kategorie: 'Uskladnění',
      aktivni: true,
      poradi: 3,
    },
    {
      id: 'SRV-4',
      nazev: 'Oprava pneumatik',
      popis: 'Odborná oprava defektů a poškozených pneumatik. Oprava propíchnutí, těsnění ventilků.',
      ikona: '🔨',
      cenaOsobni: '200 Kč',
      cenaSUV: '250 Kč',
      features: 'Oprava propíchnutí;Těsnění ventilků;Kontrola tlaku;Záplaty zevnitř',
      kategorie: 'Opravy',
      aktivni: true,
      poradi: 4,
    },
    {
      id: 'SRV-5',
      nazev: 'Prodej pneumatik',
      popis: 'Široký sortiment pneumatik všech značek a rozměrů. Letní, zimní a celoroční pneumatiky.',
      ikona: '🛒',
      cenaOsobni: 'Od 1500 Kč',
      cenaSUV: 'Od 2000 Kč',
      features: 'Letní pneumatiky;Zimní pneumatiky;Celoroční pneumatiky;Prémiové značky',
      kategorie: 'Prodej',
      aktivni: true,
      poradi: 5,
    },
    {
      id: 'SRV-6',
      nazev: 'Kompletní servis',
      popis: 'Kompletní péče o vaše kola a pneumatiky. Kontrola opotřebení, dohuštění, poradenství.',
      ikona: '🚗',
      cenaOsobni: '500 Kč',
      cenaSUV: '700 Kč',
      features: 'Kontrola opotřebení;Dohuštění;Poradenství;Sezonní prohlídka',
      kategorie: 'Kompletní servis',
      aktivni: true,
      poradi: 6,
    },
  ];

  await saveServices(defaultServices);
}

// Načíst všechny služby z Excel souboru
async function getServices(): Promise<Service[]> {
  try {
    const exists = await fileExists(EXCEL_FILE);
    if (!exists) {
      // Pokud soubor neexistuje, vytvořit s výchozími daty
      await initializeExcelFile();
    }

    const fileBuffer = await readFile(EXCEL_FILE);
    const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);

    // Převést zpět na interní formát
    return data.map((row: any) => ({
      id: row['ID'] || '',
      nazev: row['Název služby'] || '',
      popis: row['Popis'] || '',
      ikona: row['Ikona'] || '🔧',
      cenaOsobni: row['Cena osobní auto'] || '',
      cenaSUV: row['Cena SUV/Dodávka'] || '',
      features: row['Funkce'] || '',
      kategorie: row['Kategorie'] || '',
      aktivni: row['Aktivní'] === 'Ano' || row['Aktivní'] === true,
      poradi: row['Pořadí'] || 0,
    }));
  } catch (error) {
    console.error('Chyba při čtení Excel souboru:', error);
    return [];
  }
}

// Uložit služby do Excel souboru
async function saveServices(services: Service[]) {
  await ensureDataDir();

  // Seřadit podle pořadí
  const sortedServices = [...services].sort((a, b) => (a.poradi || 0) - (b.poradi || 0));

  // Převést služby na formát pro Excel
  const excelData = sortedServices.map(s => ({
    'ID': s.id,
    'Název služby': s.nazev,
    'Popis': s.popis,
    'Ikona': s.ikona,
    'Cena osobní auto': s.cenaOsobni,
    'Cena SUV/Dodávka': s.cenaSUV,
    'Funkce': s.features,
    'Kategorie': s.kategorie || '',
    'Aktivní': s.aktivni ? 'Ano' : 'Ne',
    'Pořadí': s.poradi || 0,
  }));

  // Vytvořit worksheet a workbook
  const worksheet = XLSX.utils.json_to_sheet(excelData);
  
  // Nastavit šířku sloupců
  const columnWidths = [
    { wch: 15 }, // ID
    { wch: 25 }, // Název služby
    { wch: 50 }, // Popis
    { wch: 8 },  // Ikona
    { wch: 18 }, // Cena osobní auto
    { wch: 20 }, // Cena SUV/Dodávka
    { wch: 60 }, // Funkce
    { wch: 20 }, // Kategorie
    { wch: 10 }, // Aktivní
    { wch: 8 },  // Pořadí
  ];
  worksheet['!cols'] = columnWidths;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Ceník služeb');

  // Uložit soubor pomocí buffer
  const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
  await writeFile(EXCEL_FILE, buffer);
}

// GET - Získat všechny služby (veřejné API - pouze aktivní)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const all = searchParams.get('all') === 'true'; // Pro admin - všechny služby

    let services = await getServices();
    
    // Filtrovat pouze aktivní služby pro veřejné zobrazení
    if (!all) {
      services = services.filter(s => s.aktivni);
    }

    // Seřadit podle pořadí
    services.sort((a, b) => (a.poradi || 0) - (b.poradi || 0));

    return NextResponse.json({ services });
  } catch (error) {
    console.error('Chyba při načítání služeb:', error);
    return NextResponse.json(
      { error: 'Nastala chyba při načítání služeb' },
      { status: 500 }
    );
  }
}

// POST - Vytvořit novou službu
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validace
    if (!body.nazev || !body.popis || !body.cenaOsobni) {
      return NextResponse.json(
        { error: 'Název, popis a cena osobní auto jsou povinné' },
        { status: 400 }
      );
    }

    // Načíst existující služby
    const services = await getServices();

    // Vytvořit novou službu
    const newService: Service = {
      id: `SRV-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      nazev: body.nazev,
      popis: body.popis,
      ikona: body.ikona || '🔧',
      cenaOsobni: body.cenaOsobni,
      cenaSUV: body.cenaSUV || body.cenaOsobni,
      features: body.features || '',
      kategorie: body.kategorie || '',
      aktivni: body.aktivni !== false,
      poradi: body.poradi || services.length + 1,
    };

    // Přidat k existujícím
    services.push(newService);

    // Uložit
    await saveServices(services);

    return NextResponse.json({
      success: true,
      service: newService,
      message: 'Služba byla úspěšně vytvořena'
    });

  } catch (error) {
    console.error('Chyba při vytváření služby:', error);
    return NextResponse.json(
      { error: 'Nastala chyba při vytváření služby' },
      { status: 500 }
    );
  }
}

// PUT - Aktualizovat službu
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!body.id) {
      return NextResponse.json(
        { error: 'ID je povinné' },
        { status: 400 }
      );
    }

    const services = await getServices();
    const index = services.findIndex(s => s.id === body.id);
    
    if (index === -1) {
      return NextResponse.json(
        { error: 'Služba nebyla nalezena' },
        { status: 404 }
      );
    }

    // Aktualizovat službu
    services[index] = {
      ...services[index],
      ...body,
      id: body.id, // Zachovat původní ID
    };

    await saveServices(services);

    return NextResponse.json({
      success: true,
      service: services[index]
    });

  } catch (error) {
    console.error('Chyba při aktualizaci služby:', error);
    return NextResponse.json(
      { error: 'Nastala chyba při aktualizaci služby' },
      { status: 500 }
    );
  }
}

// DELETE - Smazat službu
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID je povinné' },
        { status: 400 }
      );
    }

    const services = await getServices();
    const filtered = services.filter(s => s.id !== id);
    
    if (filtered.length === services.length) {
      return NextResponse.json(
        { error: 'Služba nebyla nalezena' },
        { status: 404 }
      );
    }

    await saveServices(filtered);

    return NextResponse.json({
      success: true,
      message: 'Služba byla smazána'
    });

  } catch (error) {
    console.error('Chyba při mazání služby:', error);
    return NextResponse.json(
      { error: 'Nastala chyba při mazání služby' },
      { status: 500 }
    );
  }
}


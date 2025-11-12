import { NextRequest, NextResponse } from 'next/server';
import { mkdir, access, readFile, writeFile } from 'fs/promises';
import path from 'path';
import * as XLSX from 'xlsx';

interface OpeningHour {
  id: string;
  den: string;
  hodiny: string;
  poradi: number;
  aktivni: boolean;
}

const EXCEL_FILE = path.join(process.cwd(), 'data', 'oteviraci_doby.xlsx');

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

  const defaultHours: OpeningHour[] = [
    {
      id: 'OH-1',
      den: 'Pondělí',
      hodiny: '8:00 - 18:00',
      poradi: 1,
      aktivni: true,
    },
    {
      id: 'OH-2',
      den: 'Úterý',
      hodiny: '8:00 - 18:00',
      poradi: 2,
      aktivni: true,
    },
    {
      id: 'OH-3',
      den: 'Středa',
      hodiny: '8:00 - 18:00',
      poradi: 3,
      aktivni: true,
    },
    {
      id: 'OH-4',
      den: 'Čtvrtek',
      hodiny: '8:00 - 18:00',
      poradi: 4,
      aktivni: true,
    },
    {
      id: 'OH-5',
      den: 'Pátek',
      hodiny: '8:00 - 18:00',
      poradi: 5,
      aktivni: true,
    },
    {
      id: 'OH-6',
      den: 'Sobota',
      hodiny: '9:00 - 14:00',
      poradi: 6,
      aktivni: true,
    },
    {
      id: 'OH-7',
      den: 'Neděle',
      hodiny: 'Zavřeno',
      poradi: 7,
      aktivni: true,
    },
  ];

  await saveOpeningHours(defaultHours);
}

// Načíst všechny otevírací doby z Excel souboru
async function getOpeningHours(): Promise<OpeningHour[]> {
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
      den: row['Den'] || '',
      hodiny: row['Hodiny'] || '',
      poradi: row['Pořadí'] || 0,
      aktivni: row['Aktivní'] === 'Ano' || row['Aktivní'] === true,
    }));
  } catch (error) {
    console.error('Chyba při čtení Excel souboru:', error);
    return [];
  }
}

// Uložit otevírací doby do Excel souboru
async function saveOpeningHours(hours: OpeningHour[]) {
  await ensureDataDir();

  // Seřadit podle pořadí
  const sortedHours = [...hours].sort((a, b) => a.poradi - b.poradi);

  // Převést na formát pro Excel
  const excelData = sortedHours.map(h => ({
    'ID': h.id,
    'Den': h.den,
    'Hodiny': h.hodiny,
    'Pořadí': h.poradi,
    'Aktivní': h.aktivni ? 'Ano' : 'Ne',
  }));

  // Vytvořit worksheet a workbook
  const worksheet = XLSX.utils.json_to_sheet(excelData);
  
  // Nastavit šířku sloupců
  const columnWidths = [
    { wch: 15 }, // ID
    { wch: 15 }, // Den
    { wch: 20 }, // Hodiny
    { wch: 8 },  // Pořadí
    { wch: 10 }, // Aktivní
  ];
  worksheet['!cols'] = columnWidths;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Otevírací doba');

  // Uložit soubor pomocí buffer
  const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
  await writeFile(EXCEL_FILE, buffer);
}

// GET - Získat všechny otevírací doby (veřejné API - pouze aktivní)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const all = searchParams.get('all') === 'true'; // Pro admin - všechny

    let hours = await getOpeningHours();
    
    // Filtrovat pouze aktivní pro veřejné zobrazení
    if (!all) {
      hours = hours.filter(h => h.aktivni);
    }

    // Seřadit podle pořadí
    hours.sort((a, b) => a.poradi - b.poradi);

    return NextResponse.json({ hours });
  } catch (error) {
    console.error('Chyba při načítání otevírací doby:', error);
    return NextResponse.json(
      { error: 'Nastala chyba při načítání otevírací doby' },
      { status: 500 }
    );
  }
}

// POST - Vytvořit novou otevírací dobu
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validace
    if (!body.den || !body.hodiny) {
      return NextResponse.json(
        { error: 'Den a hodiny jsou povinné' },
        { status: 400 }
      );
    }

    // Načíst existující
    const hours = await getOpeningHours();

    // Vytvořit novou
    const newHour: OpeningHour = {
      id: `OH-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      den: body.den,
      hodiny: body.hodiny,
      poradi: body.poradi || hours.length + 1,
      aktivni: body.aktivni !== false,
    };

    // Přidat k existujícím
    hours.push(newHour);

    // Uložit
    await saveOpeningHours(hours);

    return NextResponse.json({
      success: true,
      hour: newHour,
      message: 'Otevírací doba byla úspěšně vytvořena'
    });

  } catch (error) {
    console.error('Chyba při vytváření otevírací doby:', error);
    return NextResponse.json(
      { error: 'Nastala chyba při vytváření otevírací doby' },
      { status: 500 }
    );
  }
}

// PUT - Aktualizovat otevírací dobu
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!body.id) {
      return NextResponse.json(
        { error: 'ID je povinné' },
        { status: 400 }
      );
    }

    const hours = await getOpeningHours();
    const index = hours.findIndex(h => h.id === body.id);
    
    if (index === -1) {
      return NextResponse.json(
        { error: 'Otevírací doba nebyla nalezena' },
        { status: 404 }
      );
    }

    // Aktualizovat
    hours[index] = {
      ...hours[index],
      ...body,
      id: body.id, // Zachovat původní ID
    };

    await saveOpeningHours(hours);

    return NextResponse.json({
      success: true,
      hour: hours[index]
    });

  } catch (error) {
    console.error('Chyba při aktualizaci otevírací doby:', error);
    return NextResponse.json(
      { error: 'Nastala chyba při aktualizaci otevírací doby' },
      { status: 500 }
    );
  }
}

// DELETE - Smazat otevírací dobu
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

    const hours = await getOpeningHours();
    const filtered = hours.filter(h => h.id !== id);
    
    if (filtered.length === hours.length) {
      return NextResponse.json(
        { error: 'Otevírací doba nebyla nalezena' },
        { status: 404 }
      );
    }

    await saveOpeningHours(filtered);

    return NextResponse.json({
      success: true,
      message: 'Otevírací doba byla smazána'
    });

  } catch (error) {
    console.error('Chyba při mazání otevírací doby:', error);
    return NextResponse.json(
      { error: 'Nastala chyba při mazání otevírací doby' },
      { status: 500 }
    );
  }
}


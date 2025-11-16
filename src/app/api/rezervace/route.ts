import { NextRequest, NextResponse } from 'next/server';
import { mkdir, access, readFile, writeFile } from 'fs/promises';
import path from 'path';
import * as XLSX from 'xlsx';

interface Reservation {
  id: string;
  service: string;
  date: string;
  time: string;
  name: string;
  email: string;
  phone: string;
  car?: string;
  note?: string;
  createdAt: string;
  status: 'pending' | 'confirmed' | 'cancelled';
}

// Načíst názvy služeb z Excelu
async function getServiceNames(): Promise<Record<string, string>> {
  try {
    const servicesFile = path.join(process.cwd(), 'data', 'cenik_sluzby.xlsx');
    const exists = await fileExists(servicesFile);
    if (!exists) {
      // Fallback na výchozí hodnoty, pokud soubor neexistuje
      return {
        'vymena': 'Výměna pneumatik',
        'vyvazeni': 'Vyvážení kol',
        'uskladneni': 'Uskladnění pneu',
        'oprava': 'Oprava pneumatik',
        'prodej': 'Prodej + montáž',
      };
    }

    const fileBuffer = await readFile(servicesFile);
    const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);

    // Vytvořit mapování ID -> Název služby
    const serviceMap: Record<string, string> = {};
    data.forEach((row: any) => {
      const id = row['ID'] || '';
      const nazev = row['Název služby'] || '';
      if (id && nazev) {
        serviceMap[id] = nazev;
      }
    });

    return serviceMap;
  } catch (error) {
    console.error('Chyba při načítání názvů služeb:', error);
    // Fallback
    return {
      'vymena': 'Výměna pneumatik',
      'vyvazeni': 'Vyvážení kol',
      'uskladneni': 'Uskladnění pneu',
      'oprava': 'Oprava pneumatik',
      'prodej': 'Prodej + montáž',
    };
  }
}

const statusLabels: Record<string, string> = {
  'pending': 'Čeká na potvrzení',
  'confirmed': 'Potvrzeno',
  'cancelled': 'Zrušeno',
};

const EXCEL_FILE = path.join(process.cwd(), 'data', 'rezervace_all.xlsx');

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

// Načíst všechny rezervace z Excel souboru
async function getReservations(): Promise<Reservation[]> {
  try {
    const exists = await fileExists(EXCEL_FILE);
    if (!exists) {
      return [];
    }

    const fileBuffer = await readFile(EXCEL_FILE);
    const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);

    // Načíst názvy služeb z Excelu
    const serviceNamesMap = await getServiceNames();
    const reverseServiceMap: Record<string, string> = {};
    Object.entries(serviceNamesMap).forEach(([id, nazev]) => {
      reverseServiceMap[nazev] = id;
    });

    // Převést zpět na interní formát
    return data.map((row: any) => ({
      id: row['ID'],
      service: reverseServiceMap[row['Služba']] || row['Služba'] || '',
      date: row['Datum'] ? new Date(row['Datum']).toISOString().split('T')[0] : '',
      time: row['Čas'],
      name: row['Jméno'],
      email: row['Email'],
      phone: row['Telefon'],
      car: row['Vozidlo'] || '',
      note: row['Poznámka'] || '',
      createdAt: row['Vytvořeno'],
      status: row['Status'] === 'Potvrzeno' ? 'confirmed' : 
              row['Status'] === 'Zrušeno' ? 'cancelled' : 'pending'
    }));
  } catch (error) {
    console.error('Chyba při čtení Excel souboru:', error);
    return [];
  }
}

// Uložit rezervace do Excel souboru
async function saveReservations(reservations: Reservation[]) {
  await ensureDataDir();

  // Načíst názvy služeb z Excelu
  const serviceNamesMap = await getServiceNames();

  // Převést rezervace na formát pro Excel
  const excelData = reservations.map(r => ({
    'ID': r.id,
    'Služba': serviceNamesMap[r.service] || r.service,
    'Datum': r.date,
    'Čas': r.time,
    'Jméno': r.name,
    'Email': r.email,
    'Telefon': r.phone,
    'Vozidlo': r.car || '',
    'Poznámka': r.note || '',
    'Vytvořeno': new Date(r.createdAt).toLocaleString('cs-CZ'),
    'Status': statusLabels[r.status]
  }));

  // Vytvořit worksheet a workbook
  const worksheet = XLSX.utils.json_to_sheet(excelData);
  
  // Nastavit šířku sloupců
  const columnWidths = [
    { wch: 25 }, // ID
    { wch: 20 }, // Služba
    { wch: 12 }, // Datum
    { wch: 8 },  // Čas
    { wch: 20 }, // Jméno
    { wch: 25 }, // Email
    { wch: 15 }, // Telefon
    { wch: 20 }, // Vozidlo
    { wch: 30 }, // Poznámka
    { wch: 18 }, // Vytvořeno
    { wch: 18 }, // Status
  ];
  worksheet['!cols'] = columnWidths;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Rezervace');

  // Uložit soubor pomocí buffer
  const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
  await writeFile(EXCEL_FILE, buffer);
}

// POST - Vytvořit novou rezervaci
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validace
    if (!body.service || !body.date || !body.time || !body.name || !body.email || !body.phone) {
      return NextResponse.json(
        { error: 'Všechna povinná pole musí být vyplněna' },
        { status: 400 }
      );
    }

    // Načíst existující rezervace
    const reservations = await getReservations();

    // Vytvořit novou rezervaci
    const newReservation: Reservation = {
      id: `RES-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      service: body.service,
      date: body.date,
      time: body.time,
      name: body.name,
      email: body.email,
      phone: body.phone,
      car: body.car || '',
      note: body.note || '',
      createdAt: new Date().toISOString(),
      status: 'pending'
    };

    // Přidat k existujícím
    reservations.push(newReservation);

    // Uložit
    await saveReservations(reservations);

    // Volitelně - odeslat email správci
   // await sendEmailToAdmin(newReservation);

    return NextResponse.json({
      success: true,
      reservation: newReservation,
      message: 'Rezervace byla úspěšně vytvořena'
    });

  } catch (error) {
    console.error('Chyba při vytváření rezervace:', error);
    return NextResponse.json(
      { error: 'Nastala chyba při vytváření rezervace' },
      { status: 500 }
    );
  }
}

// GET - Získat všechny rezervace (pouze pro admina)
export async function GET(request: NextRequest) {
  try {
    const reservations = await getReservations();
    
    // Seřadit podle data vytvoření (nejnovější první)
    reservations.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return NextResponse.json({ reservations });
  } catch (error) {
    console.error('Chyba při načítání rezervací:', error);
    return NextResponse.json(
      { error: 'Nastala chyba při načítání rezervací' },
      { status: 500 }
    );
  }
}

// PUT - Aktualizovat status rezervace
export async function PUT(request: NextRequest) {
  try {
    const { id, status } = await request.json();
    
    if (!id || !status) {
      return NextResponse.json(
        { error: 'ID a status jsou povinné' },
        { status: 400 }
      );
    }

    const reservations = await getReservations();
    const index = reservations.findIndex(r => r.id === id);
    
    if (index === -1) {
      return NextResponse.json(
        { error: 'Rezervace nebyla nalezena' },
        { status: 404 }
      );
    }

    reservations[index].status = status;
    await saveReservations(reservations);

    return NextResponse.json({
      success: true,
      reservation: reservations[index]
    });

  } catch (error) {
    console.error('Chyba při aktualizaci rezervace:', error);
    return NextResponse.json(
      { error: 'Nastala chyba při aktualizaci rezervace' },
      { status: 500 }
    );
  }
}

// DELETE - Smazat rezervaci
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

    const reservations = await getReservations();
    const filtered = reservations.filter(r => r.id !== id);
    
    if (filtered.length === reservations.length) {
      return NextResponse.json(
        { error: 'Rezervace nebyla nalezena' },
        { status: 404 }
      );
    }

    await saveReservations(filtered);

    return NextResponse.json({
      success: true,
      message: 'Rezervace byla smazána'
    });

  } catch (error) {
    console.error('Chyba při mazání rezervace:', error);
    return NextResponse.json(
      { error: 'Nastala chyba při mazání rezervace' },
      { status: 500 }
    );
  }
}


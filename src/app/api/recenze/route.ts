import { NextRequest, NextResponse } from 'next/server';
import { mkdir, access, readFile, writeFile } from 'fs/promises';
import path from 'path';
import * as XLSX from 'xlsx';

interface Review {
  id: string;
  name: string;
  email: string;
  rating: number;
  text: string;
  createdAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

const statusLabels: Record<string, string> = {
  'pending': 'Čeká na schválení',
  'approved': 'Schváleno',
  'rejected': 'Zamítnuto',
};

const EXCEL_FILE = path.join(process.cwd(), 'data', 'recenze_all.xlsx');

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

// Načíst všechny recenze z Excel souboru
async function getReviews(): Promise<Review[]> {
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

    // Převést zpět na interní formát
    return data.map((row: any) => ({
      id: row['ID'],
      name: row['Jméno'],
      email: row['Email'],
      rating: row['Hodnocení'],
      text: row['Recenze'],
      createdAt: row['Vytvořeno'],
      status: row['Status'] === 'Schváleno' ? 'approved' : 
              row['Status'] === 'Zamítnuto' ? 'rejected' : 'pending'
    }));
  } catch (error) {
    console.error('Chyba při čtení Excel souboru:', error);
    return [];
  }
}

// Uložit recenze do Excel souboru
async function saveReviews(reviews: Review[]) {
  await ensureDataDir();

  // Převést recenze na formát pro Excel
  const excelData = reviews.map(r => ({
    'ID': r.id,
    'Jméno': r.name,
    'Email': r.email,
    'Hodnocení': r.rating,
    'Recenze': r.text,
    'Vytvořeno': new Date(r.createdAt).toLocaleString('cs-CZ'),
    'Status': statusLabels[r.status]
  }));

  // Vytvořit worksheet a workbook
  const worksheet = XLSX.utils.json_to_sheet(excelData);
  
  // Nastavit šířku sloupců
  const columnWidths = [
    { wch: 25 }, // ID
    { wch: 20 }, // Jméno
    { wch: 25 }, // Email
    { wch: 10 }, // Hodnocení
    { wch: 50 }, // Recenze
    { wch: 18 }, // Vytvořeno
    { wch: 18 }, // Status
  ];
  worksheet['!cols'] = columnWidths;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Recenze');

  // Uložit soubor pomocí buffer
  const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
  await writeFile(EXCEL_FILE, buffer);
}

// POST - Vytvořit novou recenzi
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validace
    if (!body.name || !body.email || !body.rating || !body.text) {
      return NextResponse.json(
        { error: 'Všechna pole musí být vyplněna' },
        { status: 400 }
      );
    }

    // Validace hodnocení
    if (body.rating < 1 || body.rating > 5) {
      return NextResponse.json(
        { error: 'Hodnocení musí být mezi 1-5' },
        { status: 400 }
      );
    }

    // Načíst existující recenze
    const reviews = await getReviews();

    // Vytvořit novou recenzi
    const newReview: Review = {
      id: `REV-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: body.name,
      email: body.email,
      rating: parseInt(body.rating),
      text: body.text,
      createdAt: new Date().toISOString(),
      status: 'pending' // Výchozí status - čeká na schválení
    };

    // Přidat k existujícím
    reviews.push(newReview);

    // Uložit
    await saveReviews(reviews);

    return NextResponse.json({
      success: true,
      review: newReview,
      message: 'Recenze byla úspěšně odeslána a čeká na schválení'
    });

  } catch (error) {
    console.error('Chyba při vytváření recenze:', error);
    return NextResponse.json(
      { error: 'Nastala chyba při vytváření recenze' },
      { status: 500 }
    );
  }
}

// GET - Získat všechny recenze
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const onlyApproved = searchParams.get('approved') === 'true';

    let reviews = await getReviews();
    
    // Filtrovat pouze schválené recenze pro veřejné zobrazení
    if (onlyApproved) {
      reviews = reviews.filter(r => r.status === 'approved');
    }

    // Seřadit podle data vytvoření (nejnovější první)
    reviews.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return NextResponse.json({ reviews });
  } catch (error) {
    console.error('Chyba při načítání recenzí:', error);
    return NextResponse.json(
      { error: 'Nastala chyba při načítání recenzí' },
      { status: 500 }
    );
  }
}

// PUT - Aktualizovat status recenze
export async function PUT(request: NextRequest) {
  try {
    const { id, status } = await request.json();
    
    if (!id || !status) {
      return NextResponse.json(
        { error: 'ID a status jsou povinné' },
        { status: 400 }
      );
    }

    const reviews = await getReviews();
    const index = reviews.findIndex(r => r.id === id);
    
    if (index === -1) {
      return NextResponse.json(
        { error: 'Recenze nebyla nalezena' },
        { status: 404 }
      );
    }

    reviews[index].status = status;
    await saveReviews(reviews);

    return NextResponse.json({
      success: true,
      review: reviews[index]
    });

  } catch (error) {
    console.error('Chyba při aktualizaci recenze:', error);
    return NextResponse.json(
      { error: 'Nastala chyba při aktualizaci recenze' },
      { status: 500 }
    );
  }
}

// DELETE - Smazat recenzi
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

    const reviews = await getReviews();
    const filtered = reviews.filter(r => r.id !== id);
    
    if (filtered.length === reviews.length) {
      return NextResponse.json(
        { error: 'Recenze nebyla nalezena' },
        { status: 404 }
      );
    }

    await saveReviews(filtered);

    return NextResponse.json({
      success: true,
      message: 'Recenze byla smazána'
    });

  } catch (error) {
    console.error('Chyba při mazání recenze:', error);
    return NextResponse.json(
      { error: 'Nastala chyba při mazání recenze' },
      { status: 500 }
    );
  }
}


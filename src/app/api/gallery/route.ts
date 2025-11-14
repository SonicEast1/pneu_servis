import { NextRequest, NextResponse } from 'next/server';
import { mkdir, access, readFile, writeFile, readdir } from 'fs/promises';
import path from 'path';
import * as XLSX from 'xlsx';

interface GalleryImage {
  id: string;
  fileName: string;
  url: string;
  category: string;
  title: string;
  description: string;
  aktivni: boolean;
  poradi?: number;
}

const EXCEL_FILE = path.join(process.cwd(), 'data', 'gallery_option.xlsx');
const GALLERY_DIR = path.join(process.cwd(), 'public', 'gallery');

// Zajistit, že složka data existuje
async function ensureDataDir() {
  const dataDir = path.join(process.cwd(), 'data');
  try {
    await mkdir(dataDir, { recursive: true });
  } catch (error) {
    // Složka už existuje
  }
}

// Zajistit, že složka gallery existuje
async function ensureGalleryDir() {
  try {
    await mkdir(GALLERY_DIR, { recursive: true });
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

  // Vytvořit Excel data se všemi požadovanými sloupci
  const excelData = [
    {
      'ID': 'IMG-1',
      'Název souboru': 'placeholder.jpg',
      'Kategorie': 'Výměna pneumatik',
      'Zobrazovací název': 'Profesionální výměna',
      'Popis': 'Naše profesionální výměna pneumatik',
      'Aktivní': false,
      'Pořadí': 1,
    },
  ];

  // Vytvořit worksheet se všemi sloupci (i když jsou prázdné)
  const worksheet = XLSX.utils.json_to_sheet(excelData);
  
  // Zajistit, že všechny sloupce jsou přítomny v správném pořadí
  const headers = ['ID', 'Název souboru', 'Kategorie', 'Zobrazovací název', 'Popis', 'Aktivní', 'Pořadí'];
  const headerRow = XLSX.utils.encode_row(0);
  
  // Nastavit hlavičky sloupců
  headers.forEach((header, index) => {
    const cellAddress = XLSX.utils.encode_cell({ r: 0, c: index });
    if (!worksheet[cellAddress]) {
      worksheet[cellAddress] = { t: 's', v: header };
    }
  });
  
  // Nastavit šířku sloupců pro lepší čitelnost
  worksheet['!cols'] = [
    { wch: 10 }, // ID
    { wch: 20 }, // Název souboru
    { wch: 20 }, // Kategorie
    { wch: 25 }, // Zobrazovací název
    { wch: 40 }, // Popis
    { wch: 10 }, // Aktivní
    { wch: 10 }, // Pořadí
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Galerie');
  await writeFile(EXCEL_FILE, XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' }));
}

// Načíst obrázky ze složky
async function getImageFiles(): Promise<string[]> {
  try {
    await ensureGalleryDir();
    const files = await readdir(GALLERY_DIR);
    return files.filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file));
  } catch (error) {
    return [];
  }
}

// Načíst metadata z Excelu
async function loadMetadata(): Promise<Record<string, Partial<GalleryImage>>> {
  try {
    const exists = await fileExists(EXCEL_FILE);
    if (!exists) {
      await initializeExcelFile();
      return {};
    }

    const fileBuffer = await readFile(EXCEL_FILE);
    const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);

    const metadata: Record<string, Partial<GalleryImage>> = {};
    data.forEach((row: any) => {
      const fileName = row['Název souboru'] || row['fileName'] || '';
      if (fileName) {
        metadata[fileName] = {
          id: row['ID'] || row['id'] || '',
          fileName: fileName,
          category: row['Kategorie'] || row['category'] || 'Všechny',
          title: row['Zobrazovací název'] || row['Název'] || row['title'] || row['Zobrazovaci nazev'] || '',
          description: row['Popis'] || row['description'] || '',
          aktivni: row['Aktivní'] !== undefined ? row['Aktivní'] : (row['aktivni'] !== undefined ? row['aktivni'] : true),
          poradi: row['Pořadí'] || row['poradi'] || 0,
        };
      }
    });

    return metadata;
  } catch (error) {
    console.error('Chyba při načítání metadat:', error);
    return {};
  }
}

// GET - Načíst všechny obrázky
export async function GET() {
  try {
    await ensureGalleryDir();
    const imageFiles = await getImageFiles();
    const metadata = await loadMetadata();

    // Kombinovat obrázky s metadaty
    const images: GalleryImage[] = imageFiles
      .map((fileName, index) => {
        const meta = metadata[fileName] || {};
        return {
          id: meta.id || `IMG-${index + 1}`,
          fileName: fileName,
          url: `/gallery/${fileName}`,
          category: meta.category || 'Všechny',
          title: meta.title || fileName.replace(/\.[^/.]+$/, ''),
          description: meta.description || '',
          aktivni: meta.aktivni !== undefined ? meta.aktivni : true,
          poradi: meta.poradi || index + 1,
        };
      })
      .filter(img => img.aktivni)
      .sort((a, b) => (a.poradi || 0) - (b.poradi || 0));

    return NextResponse.json({ images });
  } catch (error) {
    console.error('Chyba při načítání obrázků:', error);
    return NextResponse.json(
      { error: 'Nastala chyba při načítání obrázků' },
      { status: 500 }
    );
  }
}

// POST - Aktualizovat metadata
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { images } = body;

    if (!Array.isArray(images)) {
      return NextResponse.json(
        { error: 'Neplatná data' },
        { status: 400 }
      );
    }

    await ensureDataDir();

    // Převést na formát pro Excel
    const excelData = images.map((img: GalleryImage) => ({
      'ID': img.id,
      'Název souboru': img.fileName,
      'Kategorie': img.category,
      'Zobrazovací název': img.title,
      'Popis': img.description,
      'Aktivní': img.aktivni,
      'Pořadí': img.poradi || 0,
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Galerie');
    await writeFile(EXCEL_FILE, XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' }));

    return NextResponse.json({ success: true, message: 'Metadata byla aktualizována' });
  } catch (error) {
    console.error('Chyba při ukládání metadat:', error);
    return NextResponse.json(
      { error: 'Nastala chyba při ukládání metadat' },
      { status: 500 }
    );
  }
}


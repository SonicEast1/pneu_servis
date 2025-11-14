import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';

const GALLERY_DATA_FILE = path.join(process.cwd(), 'data', 'gallery_data.json');

export async function GET() {
  try {
    const fileContent = await readFile(GALLERY_DATA_FILE, 'utf-8');
    const data = JSON.parse(fileContent);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Chyba při načítání dat galerie:', error);
    // Vrátit výchozí data, pokud soubor neexistuje
    return NextResponse.json({
      categories: ['Všechny', 'Výměna pneumatik', 'Servis', 'Provoz', 'Pneumatiky'],
      images: []
    });
  }
}


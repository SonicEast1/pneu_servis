import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';

const EXCEL_FILE = path.join(process.cwd(), 'data', 'rezervace_all.xlsx');

// GET - Stáhnout Excel soubor s rezervacemi
export async function GET() {
  try {
    // Přečíst Excel soubor
    const fileBuffer = await readFile(EXCEL_FILE);

    // Vrátit jako Excel soubor ke stažení
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="rezervace_all.xlsx"`,
      },
    });

  } catch (error) {
    console.error('Chyba při exportu rezervací:', error);
    return NextResponse.json(
      { error: 'Nastala chyba při exportu rezervací. Možná ještě neexistují žádné rezervace.' },
      { status: 500 }
    );
  }
}


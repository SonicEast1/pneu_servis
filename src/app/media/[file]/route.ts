import { readFile } from 'fs/promises';
import path from 'path';
import { NextResponse } from 'next/server';
import { UPLOAD_DIR } from '@/lib/db';

const TYPES: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
};

/**
 * Nahrané fotky z DATA_DIR/uploads. Složka public/ by nestačila —
 * Next v produkci servíruje jen soubory, které tam byly při buildu.
 */
export async function GET(_request: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;
  // Jen náš formát názvu (uuid.přípona) → žádné ../ ani jiné soubory
  if (!/^[0-9a-f-]{36}\.(jpg|png|webp)$/.test(file)) {
    return new NextResponse(null, { status: 404 });
  }

  try {
    const bytes = await readFile(path.join(UPLOAD_DIR, file));
    return new NextResponse(new Uint8Array(bytes), {
      headers: {
        'Content-Type': TYPES[path.extname(file)],
        // Název je unikátní a obsah se nemění → může se cachovat napořád
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch {
    return new NextResponse(null, { status: 404 });
  }
}

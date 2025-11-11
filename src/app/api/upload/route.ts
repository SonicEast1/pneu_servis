import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'Nebyl nahrán žádný soubor' },
        { status: 400 }
      );
    }

    // Kontrola, zda je soubor obrázek
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Soubor musí být obrázek' },
        { status: 400 }
      );
    }

    // Kontrola velikosti (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'Soubor je příliš velký (maximum 5MB)' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Vytvoření unikátního názvu souboru
    const timestamp = Date.now();
    const originalName = file.name.replace(/\s+/g, '_');
    const fileName = `${timestamp}_${originalName}`;
    
    // Cesta k uložení
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    const filePath = path.join(uploadDir, fileName);

    // Ujistit se, že složka existuje
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (error) {
      // Složka už existuje
    }

    // Uložení souboru
    await writeFile(filePath, buffer);

    // Vrácení URL obrázku
    const fileUrl = `/uploads/${fileName}`;

    return NextResponse.json({
      success: true,
      url: fileUrl,
      fileName: fileName,
      message: 'Soubor byl úspěšně nahrán'
    });

  } catch (error) {
    console.error('Chyba při nahrávání souboru:', error);
    return NextResponse.json(
      { error: 'Nastala chyba při nahrávání souboru' },
      { status: 500 }
    );
  }
}

// GET endpoint pro získání seznamu nahraných obrázků
export async function GET() {
  try {
    const { readdir } = await import('fs/promises');
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    
    try {
      const files = await readdir(uploadDir);
      const imageFiles = files
        .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
        .map(file => ({
          name: file,
          url: `/uploads/${file}`
        }));
      
      return NextResponse.json({ files: imageFiles });
    } catch (error) {
      return NextResponse.json({ files: [] });
    }
  } catch (error) {
    console.error('Chyba při načítání souborů:', error);
    return NextResponse.json(
      { error: 'Nastala chyba při načítání souborů' },
      { status: 500 }
    );
  }
}


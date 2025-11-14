import { NextResponse } from 'next/server';
import { readdir } from 'fs/promises';
import path from 'path';

const GALLERY_DIR = path.join(process.cwd(), 'public', 'gallery');

export async function GET() {
  try {
    const files = await readdir(GALLERY_DIR);
    const imageFiles = files
      .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
      .map(file => ({
        fileName: file,
        url: `/gallery/${file}`
      }));
    
    return NextResponse.json({ images: imageFiles });
  } catch (error) {
    console.error('Chyba při načítání obrázků:', error);
    return NextResponse.json({ images: [] });
  }
}


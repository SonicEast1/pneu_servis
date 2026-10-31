import { randomUUID } from 'crypto';
import { writeFile } from 'fs/promises';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';
import { denyUnlessAdmin, isAdminRequest } from '@/lib/adminAuth';
import { UPLOAD_DIR } from '@/lib/db';
import {
  addGalleryImage,
  deleteGalleryImage,
  listGallery,
  reorderGallery,
  updateGalleryImage,
} from '@/lib/content';

export const dynamic = 'force-dynamic';

const MAX_BYTES = 12 * 1024 * 1024;
const clip = (value: unknown, max: number) => String(value ?? '').trim().slice(0, max);

/** Kategorie fotky: max. 6, každá max. 40 znaků, bez duplicit. */
function cleanCategories(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return Array.from(new Set(value.map((item) => clip(item, 40)).filter(Boolean))).slice(0, 6);
}

/** Typ obrázku podle obsahu souboru (ne podle přípony, tu jde podvrhnout). */
function imageExtension(bytes: Buffer): string | null {
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return 'jpg';
  if (bytes.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return 'png';
  if (bytes.subarray(0, 4).toString('ascii') === 'RIFF' && bytes.subarray(8, 12).toString('ascii') === 'WEBP') return 'webp';
  return null;
}

export async function GET(request: NextRequest) {
  const all = request.nextUrl.searchParams.get('all') === '1' && isAdminRequest(request);
  return NextResponse.json(
    { images: listGallery({ onlyVisible: !all }) },
    { headers: { 'Cache-Control': 'no-store' } },
  );
}

/** Nahrání fotky: multipart s polem `file`, volitelně `title`. */
export async function POST(request: NextRequest) {
  const denied = denyUnlessAdmin(request);
  if (denied) return denied;

  const form = await request.formData().catch(() => null);
  const file = form?.get('file');
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'Chybí soubor.' }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: 'Fotka je moc velká (max. 12 MB).' }, { status: 413 });
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const extension = imageExtension(bytes);
  if (!extension) {
    return NextResponse.json({ error: 'Podporované jsou fotky JPG, PNG a WebP.' }, { status: 415 });
  }

  const fileName = `${randomUUID()}.${extension}`;
  await writeFile(path.join(UPLOAD_DIR, fileName), bytes);
  const image = addGalleryImage(fileName, clip(form?.get('title'), 80), []);
  return NextResponse.json({ image });
}

/** Úprava názvu, popisu, kategorií a viditelnosti ({ id, … }) nebo nové pořadí ({ order }). */
export async function PATCH(request: NextRequest) {
  const denied = denyUnlessAdmin(request);
  if (denied) return denied;

  const body = await request.json().catch(() => ({}));
  if (Array.isArray(body.order)) {
    reorderGallery(body.order.map(String));
    return NextResponse.json({ ok: true });
  }

  const image = typeof body.id === 'string'
    ? updateGalleryImage(body.id, {
      title: body.title === undefined ? undefined : clip(body.title, 80),
      description: body.description === undefined ? undefined : clip(body.description, 600),
      categories: body.categories === undefined ? undefined : cleanCategories(body.categories),
      visible: typeof body.visible === 'boolean' ? body.visible : undefined,
    })
    : null;
  if (!image) {
    return NextResponse.json({ error: 'Fotka nebyla nalezena.' }, { status: 404 });
  }
  return NextResponse.json({ image });
}

export async function DELETE(request: NextRequest) {
  const denied = denyUnlessAdmin(request);
  if (denied) return denied;

  const id = request.nextUrl.searchParams.get('id');
  if (!id || !(await deleteGalleryImage(id))) {
    return NextResponse.json({ error: 'Fotka nebyla nalezena.' }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}

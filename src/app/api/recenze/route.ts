import { NextRequest, NextResponse } from 'next/server';
import { denyUnlessAdmin, isAdminRequest } from '@/lib/adminAuth';
import { addReview, deleteReview, listReviews, updateReview, type ReviewStatus } from '@/lib/content';

export const dynamic = 'force-dynamic';

const STATUSES: ReviewStatus[] = ['pending', 'approved', 'hidden'];
const clip = (value: unknown, max: number) => String(value ?? '').trim().slice(0, max);
const rating = (value: unknown) => Math.min(5, Math.max(1, Math.round(Number(value) || 5)));

export async function GET(request: NextRequest) {
  // Veřejně jen schválené; admin s ?all=1 vidí všechny (včetně e-mailů)
  const all = request.nextUrl.searchParams.get('all') === '1' && isAdminRequest(request);
  const reviews = listReviews({ onlyApproved: !all });
  return NextResponse.json(
    { reviews: all ? reviews : reviews.map((review) => ({ ...review, email: undefined })) },
    { headers: { 'Cache-Control': 'no-store' } },
  );
}

/** Admin přidá recenzi ručně (např. přepsanou z papíru nebo z telefonu). */
export async function POST(request: NextRequest) {
  const denied = denyUnlessAdmin(request);
  if (denied) return denied;

  const body = await request.json().catch(() => ({}));
  const name = clip(body.name, 60);
  const text = clip(body.text, 1000);
  if (!name || !text) {
    return NextResponse.json({ error: 'Vyplňte jméno i text recenze.' }, { status: 400 });
  }
  const review = addReview({ name, text, rating: rating(body.rating), status: 'approved' });
  return NextResponse.json({ review });
}

export async function PATCH(request: NextRequest) {
  const denied = denyUnlessAdmin(request);
  if (denied) return denied;

  const body = await request.json().catch(() => ({}));
  const review = typeof body.id === 'string'
    ? updateReview(body.id, {
      name: body.name === undefined ? undefined : clip(body.name, 60),
      text: body.text === undefined ? undefined : clip(body.text, 1000),
      rating: body.rating === undefined ? undefined : rating(body.rating),
      status: STATUSES.includes(body.status) ? body.status : undefined,
    })
    : null;
  if (!review) {
    return NextResponse.json({ error: 'Recenze nebyla nalezena.' }, { status: 404 });
  }
  return NextResponse.json({ review });
}

export async function DELETE(request: NextRequest) {
  const denied = denyUnlessAdmin(request);
  if (denied) return denied;

  const id = request.nextUrl.searchParams.get('id');
  if (!id || !deleteReview(id)) {
    return NextResponse.json({ error: 'Recenze nebyla nalezena.' }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}

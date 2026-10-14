import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';
import * as XLSX from 'xlsx';
import { DEFAULT_OPENING_HOURS, type OpeningHour } from '@/lib/openingHours';
import { answerMascot, blockedChatReply, isBlockedChatTopic, type ChatReply } from '@/lib/mascotChat';
import { mascotSystemPrompt } from '@/lib/mascotPrompt';

export const runtime = 'nodejs';

const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 12;

const hits = new Map<string, number[]>();

interface IncomingMessage {
  role: 'user' | 'mascot';
  text: string;
}

function clientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  return forwarded || request.headers.get('x-real-ip') || 'local';
}

function withinLimit(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((stamp) => now - stamp < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(ip, recent);
    return false;
  }
  recent.push(now);
  hits.set(ip, recent);
  return true;
}

async function loadHours(): Promise<OpeningHour[]> {
  try {
    const fileBuffer = await readFile(path.join(process.cwd(), 'data', 'oteviraci_doby.xlsx'));
    const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet);
    const hours = data.map((row) => ({
      id: String(row['ID'] ?? ''),
      den: String(row['Den'] ?? ''),
      hodiny: String(row['Hodiny'] ?? ''),
      poradi: Number(row['Pořadí'] ?? 0),
      aktivni: row['Aktivní'] === 'Ano' || row['Aktivní'] === true,
    }));
    return hours.length > 0 ? hours : DEFAULT_OPENING_HOURS;
  } catch {
    return DEFAULT_OPENING_HOURS;
  }
}

function localReply(message: string, hours: OpeningHour[]): ChatReply {
  const local = answerMascot(message, hours);
  if (!local.fallback) return local;
  return {
    text: 'Teď se mi nedaří odpovědět pořádně. Napište to ještě jednou, nebo zavolejte na +420 604 355 902.',
    suggestions: local.suggestions,
  };
}

function cleanText(value: string): string {
  const text = value
    .replace(/\s*[—–]\s*/g, ', ')
    .replace(/[ \t]+/g, ' ')
    .replace(/ *\n */g, '\n')
    .trim();
  if (text.length <= 700) return text;
  const cut = text.slice(0, 700);
  const end = Math.max(cut.lastIndexOf('.'), cut.lastIndexOf('!'), cut.lastIndexOf('?'));
  return (end > 180 ? cut.slice(0, end + 1) : cut).trim();
}

function parseModel(raw: string): ChatReply | null {
  const cleaned = raw.trim().replace(/^```(?:json)?/i, '').replace(/```$/i, '').trim();
  const start = cleaned.indexOf('{');
  const end = cleaned.lastIndexOf('}');
  if (start >= 0 && end > start) {
    try {
      const parsed = JSON.parse(cleaned.slice(start, end + 1)) as Record<string, unknown>;
      const rawText = [parsed.text, parsed.odpoved, parsed.answer, parsed.response]
        .find((item) => typeof item === 'string' && item.trim());
      if (typeof rawText === 'string') {
        const suggestions = Array.isArray(parsed.suggestions)
          ? parsed.suggestions
            .filter((item): item is string => typeof item === 'string')
            .map((item) => item.trim())
            .filter((item) => item.length > 0 && item.length <= 52)
            .slice(0, 3)
          : [];
        return { text: cleanText(rawText), suggestions };
      }
    } catch {
      /* plain text below */
    }
  }
  const text = cleanText(cleaned);
  if (!text || text.startsWith('{') || text.startsWith('[')) return null;
  return { text };
}

function providers(): Array<{ url: string; model: string }> {
  if (process.env.CHAT_API_URL) {
    return [{ url: process.env.CHAT_API_URL, model: process.env.CHAT_MODEL || 'openai-fast' }];
  }
  return [
    { url: 'https://hermes.ai.unturf.com/v1/chat/completions', model: 'turboderp/Qwen3.8-27B-exl3' },
    { url: 'https://api.llm7.io/v1/chat/completions', model: 'nemotron-3-nano:30b' },
    { url: 'https://text.pollinations.ai/openai', model: 'openai-fast' },
  ];
}

async function askProvider(
  provider: { url: string; model: string },
  hours: OpeningHour[],
  messages: IncomingMessage[],
): Promise<ChatReply | null> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (process.env.CHAT_API_URL && process.env.CHAT_API_KEY) {
    headers.Authorization = `Bearer ${process.env.CHAT_API_KEY}`;
  }

  const response = await fetch(provider.url, {
    method: 'POST',
    headers,
    signal: AbortSignal.timeout(22_000),
    body: JSON.stringify({
      model: provider.model,
      temperature: 0.4,
      messages: [
        { role: 'system', content: mascotSystemPrompt(hours) },
        ...messages.map((message) => ({
          role: message.role === 'mascot' ? 'assistant' : 'user',
          content: message.text,
        })),
      ],
    }),
  });

  if (!response.ok) return null;
  const data = await response.json() as { choices?: Array<{ message?: { content?: string } }> };
  const content = data.choices?.[0]?.message?.content;
  if (typeof content !== 'string') return null;
  return parseModel(content);
}

async function askModel(hours: OpeningHour[], messages: IncomingMessage[]): Promise<ChatReply | null> {
  for (const provider of providers()) {
    try {
      const reply = await askProvider(provider, hours, messages);
      if (reply?.text) return reply;
    } catch {
      /* další model */
    }
  }
  return null;
}

export async function POST(request: NextRequest) {
  let body: { messages?: IncomingMessage[] };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ text: 'Napište otázku ještě jednou.' }, { status: 400 });
  }

  const messages = Array.isArray(body.messages)
    ? body.messages
      .filter((message): message is IncomingMessage => (
        !!message
        && (message.role === 'user' || message.role === 'mascot')
        && typeof message.text === 'string'
        && message.text.trim().length > 0
      ))
      .slice(-10)
      .map((message) => ({ role: message.role, text: message.text.trim().slice(0, 400) }))
    : [];

  const latest = [...messages].reverse().find((message) => message.role === 'user');
  if (!latest) {
    return NextResponse.json({ text: 'Napište, s čím vám mám pomoct.' }, { status: 400 });
  }

  if (isBlockedChatTopic(latest.text)) {
    const reply = blockedChatReply();
    return NextResponse.json({ text: reply.text });
  }

  const hours = await loadHours();

  if (!withinLimit(clientIp(request))) {
    const reply = localReply(latest.text, hours);
    return NextResponse.json({ text: reply.text, suggestions: reply.suggestions });
  }

  try {
    const reply = await askModel(hours, messages);
    if (reply?.text) {
      return NextResponse.json({ text: reply.text, suggestions: reply.suggestions ?? [] });
    }
  } catch {
    /* model nedostupný */
  }

  const reply = localReply(latest.text, hours);
  return NextResponse.json({ text: reply.text, suggestions: reply.suggestions ?? [] });
}

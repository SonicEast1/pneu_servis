'use client';

import { useEffect, useId, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCookieConsent } from '@/hooks/useCookieConsent';
import { DEFAULT_OPENING_HOURS, type OpeningHour } from '@/lib/openingHours';
import { answerMascot, START_SHORTCUTS, type ChatLink } from '@/lib/mascotChat';

interface ChatMessage {
  id: string;
  role: 'mascot' | 'user';
  text: string;
  links?: ChatLink[];
  suggestions?: string[];
}

const STORAGE_KEY = 'vmk-mascot-chat-v3';

const WELCOME: ChatMessage = {
  id: 'welcome',
  role: 'mascot',
  text: 'Dobrý den. S čím vám mohu pomoci?',
  suggestions: START_SHORTCUTS,
};

function loadMessages(): ChatMessage[] {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return [WELCOME];
    const parsed = JSON.parse(raw) as ChatMessage[];
    return Array.isArray(parsed) && parsed.length > 0 ? parsed.slice(-30) : [WELCOME];
  } catch {
    return [WELCOME];
  }
}

export default function MascotChat() {
  const pathname = usePathname();
  const { showBanner } = useCookieConsent();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState('');
  const [hours, setHours] = useState<OpeningHour[]>(DEFAULT_OPENING_HOURS);
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME]);
  const [pending, setPending] = useState(false);
  const [ready, setReady] = useState(false);
  const pendingRef = useRef(false);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const titleId = useId();

  useEffect(() => {
    setMessages(loadMessages());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages, ready]);

  useEffect(() => {
    fetch('/api/oteviraci-doba')
      .then((response) => response.json())
      .then((data: { hours?: OpeningHour[] }) => {
        if (Array.isArray(data.hours) && data.hours.length > 0) setHours(data.hours);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    list.scrollTop = list.scrollHeight;
  }, [messages, open, pending]);

  const shortcuts = [...messages].reverse().find((message) => message.suggestions?.length)?.suggestions ?? START_SHORTCUTS;

  if (pathname.startsWith('/admin')) return null;

  const send = async (value: string) => {
    const text = value.trim().slice(0, 400);
    if (!text || pendingRef.current) return;
    pendingRef.current = true;
    setPending(true);
    const history = [...messages, { id: `u-${Date.now()}`, role: 'user' as const, text }];
    setMessages(history);
    setDraft('');
    const finish = (reply: { text: string; links?: ChatLink[]; suggestions?: string[] }) => {
      setMessages((current) => [
        ...current,
        { id: `m-${Date.now()}`, role: 'mascot', text: reply.text, links: reply.links, suggestions: reply.suggestions },
      ]);
    };
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: history.slice(-10).map((message) => ({ role: message.role, text: message.text })),
        }),
      });
      const data = await response.json() as { text?: string; suggestions?: string[] };
      if (!response.ok || typeof data.text !== 'string' || !data.text.trim()) {
        finish(answerMascot(text, hours));
      } else {
        finish({ text: data.text, suggestions: data.suggestions });
      }
    } catch {
      finish(answerMascot(text, hours));
    } finally {
      pendingRef.current = false;
      setPending(false);
    }
  };

  return (
    <div className={`mascot-chat${showBanner ? ' mascot-chat-raised' : ''}`}>
      {open && (
        <section className="mascot-chat-panel" role="dialog" aria-modal="false" aria-labelledby={titleId}>
          <header className="mascot-chat-head">
            <span className="mascot-chat-avatar" aria-hidden>
              <Image src="/pictures_web/mascot_thumbsup.png" alt="" width={72} height={72} />
            </span>
            <span>
              <strong id={titleId}>Maskot VMK</strong>
              <small>Pneuservis Jaroměř</small>
            </span>
            <button type="button" className="mascot-chat-close" onClick={() => setOpen(false)} aria-label="Zavřít chat">
              ×
            </button>
          </header>
          <div className="mascot-chat-log" ref={listRef}>
            {messages.map((message) => (
              <div key={message.id} className={`mascot-chat-row mascot-chat-${message.role}`}>
                {message.role === 'mascot' && (
                  <span className="mascot-chat-avatar" aria-hidden>
                    <Image src="/pictures_web/mascot_thumbsup.png" alt="" width={64} height={64} />
                  </span>
                )}
                <div className="mascot-chat-bubble">
                  <p>{message.text}</p>
                  {message.links && message.links.length > 0 && (
                    <span className="mascot-chat-links">
                      {message.links.map((link) => (
                        link.href.startsWith('/') ? (
                          <Link key={link.href + link.label} href={link.href} onClick={() => setOpen(false)}>
                            {link.label}
                          </Link>
                        ) : (
                          <a key={link.href + link.label} href={link.href}>
                            {link.label}
                          </a>
                        )
                      ))}
                    </span>
                  )}
                </div>
              </div>
            ))}
            {pending && (
              <div className="mascot-chat-row mascot-chat-mascot">
                <span className="mascot-chat-avatar" aria-hidden>
                  <Image src="/pictures_web/mascot_thumbsup.png" alt="" width={64} height={64} />
                </span>
                <div className="mascot-chat-bubble">
                  <p className="mascot-chat-typing">Píšu…</p>
                </div>
              </div>
            )}
          </div>
          <div className="mascot-chat-suggestions">
            {shortcuts.map((suggestion) => (
              <button key={suggestion} type="button" onClick={() => send(suggestion)} disabled={pending}>
                {suggestion}
              </button>
            ))}
          </div>
          <form
            className="mascot-chat-form"
            onSubmit={(event) => {
              event.preventDefault();
              send(draft);
            }}
          >
            <label className="sr-only" htmlFor="mascot-chat-input">Vaše zpráva</label>
            <input
              id="mascot-chat-input"
              ref={inputRef}
              value={draft}
              maxLength={400}
              placeholder="Napište otázku"
              onChange={(event) => setDraft(event.target.value)}
              disabled={pending}
            />
            <button type="submit" disabled={pending || !draft.trim()}>
              Odeslat
            </button>
          </form>
        </section>
      )}
      <button
        type="button"
        className="mascot-chat-launcher"
        aria-expanded={open}
        aria-label={open ? 'Zavřít chat' : 'Otevřít chat'}
        onClick={() => setOpen((current) => !current)}
      >
        {open ? (
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5 6.5h14a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H9l-4 3v-3H5a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1z" />
          </svg>
        )}
      </button>
    </div>
  );
}

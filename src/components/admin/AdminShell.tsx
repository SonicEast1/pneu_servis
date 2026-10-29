'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react';

export interface AdminCounts {
  newReservations: number;
  pendingReviews: number;
}

const NAV = [
  { href: '/admin', label: 'Přehled', countKey: null },
  { href: '/admin/rezervace', label: 'Rezervace', countKey: 'newReservations' },
  { href: '/admin/oteviraci-doba', label: 'Otevírací doba', countKey: null },
  { href: '/admin/sluzby', label: 'Služby', countKey: null },
  { href: '/admin/cenik', label: 'Ceník', countKey: null },
  { href: '/admin/galerie', label: 'Galerie', countKey: null },
  { href: '/admin/recenze', label: 'Recenze', countKey: 'pendingReviews' },
  { href: '/admin/statistiky', label: 'Statistiky', countKey: null },
] as const;

/* ─── Oznámení „Uloženo" ─── */

interface Toast {
  id: number;
  text: string;
  tone: 'ok' | 'error';
  link?: { href: string; label: string };
}

const ToastContext = createContext<(toast: Omit<Toast, 'id'>) => void>(() => {});

/** toast({ text, tone, link }) — krátké potvrzení po uložení. */
export function useToast() {
  return useContext(ToastContext);
}

export default function AdminShell({ counts, children }: { counts: AdminCounts; children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(0);

  const push = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = ++nextId.current;
    setToasts((list) => [...list.slice(-2), { ...toast, id }]);
    window.setTimeout(() => setToasts((list) => list.filter((item) => item.id !== id)), 5000);
    // Čísla v menu (nové rezervace, recenze) se po změně přepočítají
    router.refresh();
  }, [router]);

  const logout = async () => {
    await fetch('/api/admin/session', { method: 'DELETE' });
    router.refresh();
  };

  const isActive = (href: string) => (href === '/admin' ? pathname === href : pathname.startsWith(href));

  return (
    <ToastContext.Provider value={push}>
      <div className="admin-shell">
        <aside className="admin-sidebar" data-open={menuOpen}>
          <div className="admin-brand">
            <span className="font-display font-bold text-theme tracking-tight">
              PNEUSERVIS<span className="text-accent">VMK</span>
            </span>
            <span className="admin-brand-sub">Správa webu</span>
            <button
              type="button"
              className="admin-menu-toggle"
              aria-expanded={menuOpen}
              aria-controls="admin-nav"
              onClick={() => setMenuOpen((open) => !open)}
            >
              {menuOpen ? 'Zavřít' : 'Menu'}
            </button>
          </div>

          <nav id="admin-nav" className="admin-nav" aria-label="Správa webu">
            {NAV.map((item) => {
              const count = item.countKey ? counts[item.countKey] : 0;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="admin-nav-link"
                  aria-current={isActive(item.href) ? 'page' : undefined}
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                  {count > 0 && <span className="admin-badge" aria-label={`${count} nových`}>{count}</span>}
                </Link>
              );
            })}
            <div className="admin-nav-foot">
              <a href="/" target="_blank" rel="noopener noreferrer" className="admin-nav-link">
                Zobrazit web <span aria-hidden="true">↗</span>
              </a>
              <button type="button" onClick={logout} className="admin-nav-link">
                Odhlásit
              </button>
            </div>
          </nav>
        </aside>

        <main className="admin-main">{children}</main>

        <div className="admin-toasts" role="status" aria-live="polite">
          {toasts.map((toast) => (
            <div key={toast.id} className="admin-toast" data-tone={toast.tone}>
              <span>{toast.text}</span>
              {toast.link && (
                <a href={toast.link.href} target="_blank" rel="noopener noreferrer">
                  {toast.link.label} <span aria-hidden="true">↗</span>
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </ToastContext.Provider>
  );
}

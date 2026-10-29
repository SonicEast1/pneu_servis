'use client';

import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

/** Hlavička, patička, chat a cookie lišta patří jen veřejnému webu, ne do adminu. */
export default function PublicOnly({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (pathname?.startsWith('/admin')) return null;
  return children;
}

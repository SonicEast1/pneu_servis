import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import AdminLogin from '@/components/admin/AdminLogin';
import AdminShell from '@/components/admin/AdminShell';
import { adminConfigured, isAdminSession } from '@/lib/adminAuth';
import { adminCounts } from '@/lib/content';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: { default: 'Správa webu', template: '%s · Správa webu' },
  robots: { index: false, follow: false },
};

/** Celý /admin je za přihlášením — bez něj se zobrazí jen přihlašovací formulář. */
export default async function AdminLayout({ children }: { children: ReactNode }) {
  if (!(await isAdminSession())) {
    return <AdminLogin configured={adminConfigured()} />;
  }
  const counts = adminCounts();
  return <AdminShell counts={counts}>{children}</AdminShell>;
}

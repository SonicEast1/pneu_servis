export const PAGE_LABELS: Record<string, string> = {
  '/': 'Domů',
  '/o-nas': 'O nás',
  '/sluzby': 'Služby',
  '/cenik': 'Ceník',
  '/recenze': 'Recenze',
  '/rezervace': 'Rezervace',
  '/galerie': 'Galerie',
  '/kontakty': 'Kontakty',
};

export type ClickCategory = 'card' | 'cta' | 'nav' | 'click';

export interface AnalyticsEvent {
  type: 'pageview' | 'click';
  path: string;
  label?: string;
  category?: ClickCategory;
  sessionNew?: boolean;
}

export interface RankedItem {
  label: string;
  category?: ClickCategory;
  path?: string;
  count: number;
}

export interface DailyPoint {
  date: string;
  pageviews: number;
  clicks: number;
  sessions: number;
}

export interface AnalyticsSummary {
  from: string;
  to: string;
  totals: {
    pageviews: number;
    clicks: number;
    sessions: number;
  };
  pages: RankedItem[];
  clicks: RankedItem[];
  cards: RankedItem[];
  daily: DailyPoint[];
}

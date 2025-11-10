# 🚗 PneuServis - Profesionální pneuservis

Moderní webová aplikace pro pneuservis vytvořená s Next.js 15, React 19, TypeScript a Tailwind CSS.

## ✨ Funkce

- 🏠 **Homepage** - Přehledná domovská stránka s informacemi o službách
- ⭐ **Recenze** - Interaktivní stránka s recenzemi zákazníků a možností přidat vlastní recenzi
- 📅 **Online rezervace** - Vícekapový rezervační formulář s výběrem služby, data a času
- 📸 **Fotogalerie** - Galerie s lightboxem a filtrováním podle kategorií
- 🍪 **Cookie consent** - GDPR-compliant cookie banner
- 🔍 **SEO optimalizace** - Metadata, strukturovaná data (Schema.org), sitemap, robots.txt

## 🎨 Design

Aplikace využívá konzistentní barevné schéma:
- **Oranžová** (#FF6B35) - Primární barva
- **Červená** (#DC2626) - Sekundární barva
- **Hnědá** (#8B4513) - Akcentová barva
- **Tmavé pozadí** - Moderní dark mode design

## 🚀 Spuštění projektu

```bash
# Instalace závislostí
npm install

# Spuštění vývojového serveru
npm run dev

# Build pro produkci
npm run build

# Spuštění produkční verze
npm start
```

Aplikace běží na [http://localhost:3000](http://localhost:3000)

## 📁 Struktura projektu

```
src/
├── app/                    # Next.js 15 App Router
│   ├── page.tsx           # Homepage
│   ├── recenze/           # Stránka recenzí
│   ├── rezervace/         # Online rezervace
│   ├── galerie/           # Fotogalerie
│   ├── layout.tsx         # Root layout
│   ├── globals.css        # Globální styly
│   └── sitemap.ts         # Dynamický sitemap
├── components/            # React komponenty
│   ├── Navigation.tsx     # Hlavní navigace
│   ├── Footer.tsx         # Footer
│   ├── CookieBanner.tsx   # Cookie consent
│   └── StructuredData.tsx # SEO strukturovaná data
├── constants/             # Konstanty a konfigurace
│   ├── colors.ts          # Barevná paleta
│   └── metadata.ts        # SEO metadata
└── hooks/                 # React hooks
    └── useCookieConsent.ts
```

## 🛠️ Technologie

- **Framework:** Next.js 15 (App Router)
- **UI Library:** React 19
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Fonts:** Inter (Google Fonts)

## 📱 Responzivita

Aplikace je plně responzivní a optimalizovaná pro:
- 📱 Mobilní zařízení
- 📱 Tablety
- 💻 Desktop

## 🔍 SEO Features

- ✅ Metadata pro všechny stránky
- ✅ Strukturovaná data (Schema.org)
- ✅ Sitemap.xml
- ✅ Robots.txt
- ✅ Open Graph tagy
- ✅ Twitter Card
- ✅ Sémantické HTML

## 🎯 Komponenty

### Interaktivní prvky
- **Hover efekty** - Plynulé animace při najetí myší
- **Animace** - Custom CSS animace (fadeIn, slideUp, scaleIn)
- **Formuláře** - Validované formuláře s user-friendly UX
- **Lightbox** - Plnohodnotná galerie s lightboxem a navigací

### Mobilní menu
- Responsivní hamburger menu
- Plynulé animace
- Touch-friendly ovládání

## 📄 Licence

© 2024 PneuServis. Všechna práva vyhrazena.

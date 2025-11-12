# 🚀 Návod na nasazení na www.pneuservisvmk.cz

## Metoda 1: Vercel (Doporučeno - nejjednodušší)

Vercel je ideální platforma pro Next.js aplikace a nabízí bezplatný hosting.

### Krok 1: Vytvoření účtu na Vercel
1. Jděte na [vercel.com](https://vercel.com)
2. Zaregistrujte se pomocí GitHub účtu (nejjednodušší)
3. Přihlaste se do dashboardu

### Krok 2: Nasazení projektu
1. V dashboardu klikněte na **"Add New Project"**
2. Vyberte tento GitHub repozitář (`pneu_servis`)
3. Vercel automaticky detekuje Next.js a nastaví konfiguraci
4. Klikněte na **"Deploy"**
5. Počkejte na dokončení buildu (obvykle 1-2 minuty)

### Krok 3: Připojení domény
1. V projektu na Vercel klikněte na **"Settings"**
2. Přejděte na **"Domains"**
3. Zadejte: `www.pneuservisvmk.cz`
4. Vercel vám zobrazí DNS záznamy, které musíte přidat u vašeho poskytovatele domény

### Krok 4: Konfigurace DNS u poskytovatele domény
Musíte přidat následující DNS záznamy u vašeho poskytovatele domény (např. Wedos, Forpsi, atd.):

**Pro www subdoménu:**
- **Typ:** CNAME
- **Název:** www
- **Hodnota:** cname.vercel-dns.com

**Pro root doménu (pneuservisvmk.cz):**
- **Typ:** A
- **Název:** @
- **Hodnota:** 76.76.21.21

Nebo použijte přesměrování na www u vašeho poskytovatele.

### Krok 5: Ověření
1. Počkejte na propagaci DNS (obvykle 5-60 minut)
2. Vercel automaticky vydá SSL certifikát
3. Web bude dostupný na https://www.pneuservisvmk.cz

---

## Metoda 2: Netlify

### Krok 1: Vytvoření účtu
1. Jděte na [netlify.com](https://netlify.com)
2. Zaregistrujte se pomocí GitHub

### Krok 2: Nasazení
1. Klikněte na **"Add new site"** → **"Import an existing project"**
2. Vyberte GitHub repozitář
3. Nastavte:
   - **Build command:** `npm run build`
   - **Publish directory:** `.next`
4. Klikněte na **"Deploy site"**

### Krok 3: Připojení domény
1. V projektu → **"Domain settings"**
2. Přidejte custom domain: `www.pneuservisvmk.cz`
3. Postupujte podle instrukcí pro DNS konfiguraci

---

## Metoda 3: Vlastní server (Pokročilé)

Pokud máte vlastní VPS/server:

### Krok 1: Build aplikace
```bash
npm install
npm run build
```

### Krok 2: Spuštění produkčního serveru
```bash
npm start
```

### Krok 3: Konfigurace webového serveru (Nginx)
Vytvořte konfiguraci pro Nginx:

```nginx
server {
    listen 80;
    server_name www.pneuservisvmk.cz pneuservisvmk.cz;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Krok 4: SSL certifikát (Let's Encrypt)
```bash
sudo certbot --nginx -d www.pneuservisvmk.cz -d pneuservisvmk.cz
```

---

## ⚠️ Důležité poznámky

1. **Environment Variables:** Pokud aplikace používá environment variables, přidejte je v nastavení deployment platformy
2. **Build Time:** První build může trvat déle (2-5 minut)
3. **DNS Propagace:** Změny DNS mohou trvat až 48 hodin, obvykle však 5-60 minut
4. **SSL:** Vercel a Netlify automaticky poskytují SSL certifikáty
5. **Automatické nasazení:** Při push do GitHub repozitáře se automaticky nasadí nová verze

---

## 🔧 Řešení problémů

### Web se nenačítá
- Zkontrolujte DNS záznamy (použijte [whatsmydns.net](https://www.whatsmydns.net))
- Ověřte, že doména je správně připojená v deployment platformě
- Zkontrolujte build logy pro chyby

### SSL certifikát nefunguje
- Počkejte na vydání certifikátu (obvykle 5-10 minut)
- Ověřte, že DNS záznamy jsou správně nastavené

### Build selhává
- Zkontrolujte `package.json` a závislosti
- Ověřte, že všechny environment variables jsou nastavené
- Zkontrolujte build logy v deployment platformě

---

## 📞 Podpora

Pokud máte problémy s nasazením, zkontrolujte:
- [Vercel dokumentace](https://vercel.com/docs)
- [Next.js deployment guide](https://nextjs.org/docs/deployment)


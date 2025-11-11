# 📅 Systém správy rezervací

## ✅ Co bylo vytvořeno:

### 1. **API Endpointy**

#### `/api/rezervace` (POST, GET, PUT, DELETE)
- **POST**: Vytvoření nové rezervace z formuláře
- **GET**: Získání seznamu všech rezervací (pro admina)
- **PUT**: Změna statusu rezervace (pending/confirmed/cancelled)
- **DELETE**: Smazání rezervace

#### `/api/rezervace/export` (GET)
- Export všech rezervací do CSV/Excel souboru
- Správné kódování češtiny
- Připraveno pro otevření v Excelu

### 2. **Admin stránka**

**URL:** `http://localhost:3000/admin/rezervace`

**Funkce:**
- ✅ Přehled všech rezervací
- ✅ Statistiky (celkem, čeká, potvrzeno, zrušeno)
- ✅ Filtrování podle statusu
- ✅ Vyhledávání podle jména, emailu, telefonu, ID
- ✅ Změna statusu rezervace (Potvrdit/Čeká/Zrušit)
- ✅ Mazání rezervací
- ✅ Export do CSV/Excel
- ✅ Obnovení seznamu
- ✅ Odkazy na galerii

### 3. **Aktualizovaný rezervační formulář**

**URL:** `http://localhost:3000/rezervace`

- ✅ Odesílá data na API
- ✅ Ukládá rezervace do JSON souboru
- ✅ Zobrazuje ID rezervace po úspěšném odeslání
- ✅ Loading stav při odesílání
- ✅ Chybové hlášky

### 4. **Ukládání dat**

**Umístění:** `data/rezervace_all.xlsx`

**Formát:** Excel soubor (.xlsx)

**Struktura tabulky:**
| ID | Služba | Datum | Čas | Jméno | Email | Telefon | Vozidlo | Poznámka | Vytvořeno | Status |
|---|---|---|---|---|---|---|---|---|---|---|
| RES-xxx | Výměna pneumatik | 2025-11-15 | 10:00 | Jan Novák | jan@email.cz | +420123456789 | Škoda Octavia | ... | 11.11.2025 12:00:00 | Čeká na potvrzení |

**Výhody:**
- ✅ Přímo otevřitelné v Excelu
- ✅ Automaticky nastavená šířka sloupců
- ✅ Česká jména sloupců
- ✅ Správné formátování data a času

---

## 📋 Jak to používat:

### **Pro zákazníky:**
1. Jít na `http://localhost:3000/rezervace`
2. Vyplnit formulář (4 kroky)
3. Potvrdit rezervaci
4. Dostat ID rezervace

### **Pro správce:**
1. Jít na `http://localhost:3000/admin/rezervace`
2. Vidět všechny rezervace
3. Potvrdit/zrušit rezervace
4. Exportovat do Excelu
5. Kontaktovat zákazníky (email/telefon jsou klikatelné odkazy)

---

## 📊 Stažení Excel souboru:

1. V admin rozhraní kliknout na **"📊 Stáhnout Excel"**
2. Stáhne se soubor `rezervace_all.xlsx`
3. **Přímo otevřít v Excelu** - není potřeba žádné nastavování!

**Soubor obsahuje:**
- ✅ Všechny rezervace v jednom souboru
- ✅ Správně naformátované sloupce
- ✅ Automaticky nastavená šířka
- ✅ Česká jména sloupců
- ✅ Kompletní historie všech rezervací

**Nebo přímý odkaz na stažení:**
```
http://localhost:3000/api/rezervace/export
```

---

## 🔐 Zabezpečení (Doporučení):

Pro produkční použití doporučuji:

1. **Přidat autentizaci pro admin stránku:**
   - Použít Next-Auth nebo podobnou knihovnu
   - Chránit `/admin/*` cesty heslem

2. **Přidat email notifikace:**
   - Při nové rezervaci poslat email správci
   - Při potvrzení poslat email zákazníkovi

3. **Použít databázi místo JSON:**
   - PostgreSQL, MySQL, MongoDB
   - Lepší výkon a bezpečnost

---

## 📧 Volitelně: Email notifikace

Pro přidání email notifikací můžete použít:
- **Nodemailer** (SMTP)
- **SendGrid**
- **Resend**
- **Mailgun**

Kód je připravený v `/api/rezervace/route.ts`:
```typescript
// await sendEmailToAdmin(newReservation);
```

---

## 📁 Struktura souborů:

```
src/
├── app/
│   ├── api/
│   │   └── rezervace/
│   │       ├── route.ts           # Hlavní API endpoint
│   │       └── export/
│   │           └── route.ts       # Stažení Excel souboru
│   ├── admin/
│   │   └── rezervace/
│   │       ├── page.tsx           # Admin stránka
│   │       └── metadata.ts        # Metadata (noindex)
│   └── rezervace/
│       ├── page.tsx               # Rezervační formulář
│       └── metadata.ts            # Metadata
└── data/
    ├── .gitignore                 # Ignorovat rezervace v Gitu
    └── rezervace_all.xlsx         # Excel soubor se všemi rezervacemi (auto-generováno)
```

---

## 🚀 Testování:

1. **Spustit dev server:**
   ```bash
   npm run dev
   ```

2. **Vytvořit testovací rezervaci:**
   - Jít na http://localhost:3000/rezervace
   - Vyplnit formulář
   - Odeslat

3. **Zkontrolovat v adminu:**
   - Jít na http://localhost:3000/admin/rezervace
   - Měla by se zobrazit nová rezervace

4. **Stáhnout Excel soubor:**
   - Kliknout na "📊 Stáhnout Excel"
   - Otevřít soubor `rezervace_all.xlsx` v Excelu

---

## ✨ Funkce:

- ✅ **Ukládání rezervací** do Excel souboru (.xlsx)
- ✅ **Admin rozhraní** pro správu
- ✅ **Stažení Excel souboru** (rezervace_all.xlsx)
- ✅ **Filtrování a vyhledávání**
- ✅ **Změna statusu** (pending/confirmed/cancelled)
- ✅ **Mazání rezervací**
- ✅ **Statistiky**
- ✅ **Responzivní design**
- ✅ **Klikatelné odkazy** (email, telefon)
- ✅ **Auto-generování ID** rezervace

---

## 💡 Tipy:

1. **Pravidelně zálohovat** `data/rezervace_all.xlsx`
2. **Nemazat** rezervace, radši je označit jako "cancelled"
3. **Soubor se automaticky aktualizuje** při každé změně rezervace
4. **Můžete otevřít Excel soubor** i během běhu webu (čtení)
5. **Chránit admin stránku** heslem v produkci

---

Vše je připraveno k použití! 🎉


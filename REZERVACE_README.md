# 📅 Systém rezervací - Návod pro admina

## 📋 Přehled systému

Systém rezervací umožňuje zákazníkům rezervovat termíny online prostřednictvím webového formuláře. Všechny rezervace se automaticky ukládají do Excel souboru, který můžete snadno otevřít a spravovat.

---

## 🗂️ Kde se rezervace ukládají?

**Soubor:** `data/rezervace_all.xlsx`

Tento Excel soubor obsahuje všechny rezervace včetně jejich detailů. Soubor se automaticky vytvoří při první rezervaci.

### Struktura Excel souboru:

| Sloupec | Popis | Příklad |
|---------|-------|---------|
| **ID** | Jedinečné ID rezervace | `RES-1701234567890-abc123def` |
| **Služba** | Název vybrané služby | `Výměna pneumatik` |
| **Datum** | Datum rezervace | `2025-01-15` |
| **Čas** | Čas rezervace | `10:00` |
| **Jméno** | Jméno zákazníka | `Jan Novák` |
| **Email** | Email zákazníka | `jan@email.cz` |
| **Telefon** | Telefon zákazníka | `+420 602 299 090` |
| **Vozidlo** | Značka a model vozu | `Škoda Octavia` |
| **Poznámka** | Dodatečné poznámky | `Potřebuji rychlou výměnu` |
| **Vytvořeno** | Datum a čas vytvoření rezervace | `15.1.2025 12:30:00` |
| **Status** | Status rezervace | `Čeká na potvrzení` |

---

## 🔄 Statusy rezervací

Každá rezervace má jeden ze tří statusů:

1. **Čeká na potvrzení** (`pending`) - Nová rezervace, která ještě nebyla potvrzena
2. **Potvrzeno** (`confirmed`) - Rezervace byla potvrzena
3. **Zrušeno** (`cancelled`) - Rezervace byla zrušena

---

## 🌐 Jak zákazníci vytvářejí rezervace?

1. Zákazník navštíví stránku `/rezervace`
2. Projde 4 kroky:
   - **Krok 1:** Vybere službu (např. "Výměna pneumatik")
   - **Krok 2:** Vybere datum a čas
   - **Krok 3:** Vyplní osobní údaje (jméno, email, telefon, vozidlo, poznámka)
   - **Krok 4:** Zkontroluje a potvrdí rezervaci
3. Po potvrzení se rezervace automaticky uloží do Excel souboru

---

## 🛠️ Admin rozhraní

### URL: `/admin/rezervace`

Admin rozhraní umožňuje:

#### ✅ **Přehled všech rezervací**
- Zobrazení všech rezervací v přehledné tabulce
- Automatické řazení podle data vytvoření (nejnovější první)

#### 📊 **Statistiky**
- Celkový počet rezervací
- Počet rezervací čekajících na potvrzení
- Počet potvrzených rezervací
- Počet zrušených rezervací

#### 🔍 **Filtrování a vyhledávání**
- **Filtrování podle statusu:**
  - Všechny
  - Čeká na potvrzení
  - Potvrzeno
  - Zrušeno

- **Vyhledávání:**
  - Podle jména zákazníka
  - Podle emailu
  - Podle telefonu
  - Podle ID rezervace

#### ✏️ **Správa rezervací**
- **Změna statusu:**
  - Kliknutím na tlačítko "Potvrdit" změníte status na "Potvrzeno"
  - Kliknutím na tlačítko "Zrušit" změníte status na "Zrušeno"
  - Kliknutím na tlačítko "Čeká" vrátíte status na "Čeká na potvrzení"

- **Mazání rezervací:**
  - Kliknutím na tlačítko "Smazat" trvale odstraníte rezervaci
  - ⚠️ **Pozor:** Tato akce je nevratná!

#### 📥 **Export dat**
- Tlačítko "Exportovat do CSV" stáhne všechny rezervace jako CSV soubor
- Soubor můžete otevřít v Excelu nebo jiném tabulkovém editoru

#### 🔄 **Obnovení seznamu**
- Tlačítko "Obnovit" znovu načte všechny rezervace z Excel souboru

---

## 📝 Jak upravit rezervaci přímo v Excelu?

1. Otevřete soubor `data/rezervace_all.xlsx` v Excelu
2. Najděte řádek s rezervací, kterou chcete upravit
3. Upravte potřebné údaje (např. změňte status z "Čeká na potvrzení" na "Potvrzeno")
4. Uložte soubor
5. V admin rozhraní klikněte na "Obnovit" pro načtení změn

⚠️ **Důležité:**
- Při úpravách v Excelu zachovejte formát sloupců
- Status musí být přesně: `Čeká na potvrzení`, `Potvrzeno`, nebo `Zrušeno`
- ID rezervace neměňte (je to jedinečný identifikátor)

---

## 🔗 API endpointy

Systém používá následující API endpointy:

### `POST /api/rezervace`
- Vytvoří novou rezervaci
- Používá se při odesílání rezervačního formuláře

### `GET /api/rezervace`
- Vrátí seznam všech rezervací
- Používá se v admin rozhraní

### `PUT /api/rezervace`
- Aktualizuje status rezervace
- Používá se při změně statusu v admin rozhraní

### `DELETE /api/rezervace?id=RES-xxx`
- Smaže rezervaci
- Používá se při mazání rezervace v admin rozhraní

---

## 📧 Email notifikace

Systém je připraven na odesílání emailových notifikací, ale tato funkce je momentálně zakomentovaná v kódu.

Pokud chcete aktivovat emailové notifikace:
1. Otevřete soubor `src/app/api/rezervace/route.ts`
2. Najděte řádek: `// await sendEmailToAdmin(newReservation);`
3. Odkomentujte řádek a implementujte funkci `sendEmailToAdmin`

---

## 🎯 Tipy pro správu rezervací

1. **Pravidelně kontrolujte rezervace:**
   - Každý den zkontrolujte nové rezervace se statusem "Čeká na potvrzení"
   - Potvrďte nebo zrušte rezervace co nejdříve

2. **Kontaktujte zákazníky:**
   - Po potvrzení rezervace kontaktujte zákazníka telefonicky nebo emailem
   - Potvrďte termín a případně upřesněte detaily

3. **Exportujte data:**
   - Pravidelně exportujte rezervace do CSV pro zálohu
   - Můžete vytvořit měsíční archivy rezervací

4. **Sledujte statistiky:**
   - Použijte statistiky v admin rozhraní pro přehled o vytíženosti
   - Identifikujte nejpopulárnější služby a časy

---

## ❓ Časté otázky

### Kde najdu Excel soubor s rezervacemi?
Soubor se nachází v `data/rezervace_all.xlsx` v kořenovém adresáři projektu.

### Co když se Excel soubor poškodí?
Systém automaticky vytvoří nový soubor, pokud ten starý neexistuje. Pokud máte zálohu, můžete ji obnovit.

### Jak zobrazím rezervace pro konkrétní datum?
V admin rozhraní můžete použít vyhledávání nebo filtrování. Pro pokročilejší filtrování můžete otevřít Excel soubor a použít filtry v Excelu.

### Můžu upravit časové sloty pro rezervace?
Ano, časové sloty jsou definovány v souboru `src/app/rezervace/page.tsx` v poli `timeSlots`. Můžete je upravit podle vašich potřeb.

### Co když zákazník vytvoří rezervaci na již obsazený čas?
Systém momentálně nekontroluje kolize rezervací automaticky. Měli byste kontrolovat rezervace manuálně a v případě kolize kontaktovat zákazníka.

---

## 📞 Podpora

Pokud máte problémy s rezervacemi nebo potřebujete pomoc:
1. Zkontrolujte, zda existuje soubor `data/rezervace_all.xlsx`
2. Zkontrolujte, zda máte oprávnění k zápisu do složky `data`
3. Zkontrolujte konzoli prohlížeče pro případné chyby
4. Zkontrolujte serverové logy pro chyby na backendu

---

**Poslední aktualizace:** 2025-01-15


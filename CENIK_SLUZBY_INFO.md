# 📊 Excel systém pro správu služeb a ceníku

## ✅ **CO BYLO VYTVOŘENO:**

Kompletní systém pro správu služeb přes Excel tabulky!

---

## 📁 **Soubor:**

```
C:\github\pneu_servis\data\cenik_sluzby.xlsx
```

---

## 🎯 **Výhody:**

1. ✅ **Přímo otevřitelný v Excelu** - žádné konverze
2. ✅ **Automaticky naformátovaný** - šířka sloupců, česká jména
3. ✅ **Vše v jednom souboru** - kompletní ceník služeb
4. ✅ **Stále živý** - aktualizuje se při každé změně
5. ✅ **Přenositelný** - můžete ho poslat emailem, zkopírovat
6. ✅ **Správa přes web** - přidávat, upravovat, mazat služby v admin rozhraní

---

## 📊 **Struktura tabulky:**

| ID | Název služby | Popis | Ikona | Cena osobní auto | Cena SUV/Dodávka | Funkce | Kategorie | Aktivní | Pořadí |
|---|---|---|---|---|---|---|---|---|---|
| SRV-1 | Výměna pneumatik | Rychlá a profesionální výměna... | 🔧 | 400 Kč | 600 Kč | Osobní auta;SUV a dodávky;... | Základní služby | Ano | 1 |

---

## 🚀 **Jak to funguje:**

### **Admin rozhraní:**
1. Jděte na `http://localhost:3000/admin/sluzby`
2. Zobrazí se seznam všech služeb
3. Můžete:
   - ➕ **Přidat novou službu** - klikněte na "Přidat službu"
   - ✏️ **Upravit službu** - klikněte na "Upravit"
   - 👁️ **Skrýt/Zobrazit** - deaktivovat službu bez smazání
   - 🗑️ **Smazat službu** - trvale odstranit

### **Veřejná stránka:**
1. Jděte na `http://localhost:3000/sluzby`
2. Zobrazí se pouze **aktivní služby** z Excel souboru
3. Automaticky se načítají názvy, popisy, ceny a funkce

---

## 📝 **Pole služby:**

### **Povinná pole:**
- **Název služby** - název služby (např. "Výměna pneumatik")
- **Popis** - detailní popis služby
- **Cena osobní auto** - cena pro osobní auta (např. "400 Kč")

### **Volitelná pole:**
- **Ikona** - emoji ikona (např. 🔧, ⚖️, 📦)
- **Cena SUV/Dodávka** - cena pro SUV a dodávky (pokud není vyplněno, použije se cena osobní auto)
- **Funkce** - seznam funkcí oddělených středníkem (např. "Funkce 1;Funkce 2;Funkce 3")
- **Kategorie** - kategorie služby (např. "Základní služby", "Opravy")
- **Aktivní** - zda se služba zobrazuje na webu (Ano/Ne)
- **Pořadí** - pořadí zobrazení (menší číslo = výše)

---

## 💡 **Můžete:**

✅ **Otevřít soubor v Excelu** i během běhu webu (pro čtení)
✅ **Filtrovat a třídit** v Excelu
✅ **Vytvořit grafy** v Excelu
✅ **Použít vzorce** v Excelu
✅ **Zkopírovat data** do jiných programů
✅ **Poslat emailem** jako přílohu
✅ **Zálohovat** jednoduše zkopírováním
✅ **Spravovat přes web** - přidávat, upravovat, mazat služby

---

## ⚠️ **DŮLEŽITÉ:**

- ❌ **Neupravujte soubor** během běhu webu (může dojít ke konfliktu)
- ✅ **Pro úpravy** používejte admin rozhraní (`/admin/sluzby`)
- ✅ **Pro čtení** můžete otevřít Excel kdykoliv
- ✅ **Pro zálohu** zkopírujte soubor jinam

---

## 🔗 **Odkazy:**

### **Admin rozhraní:**
```
http://localhost:3000/admin/sluzby
```

### **Veřejná stránka:**
```
http://localhost:3000/sluzby
```

### **API endpoint:**
```
GET  /api/sluzby          - Získat všechny aktivní služby
GET  /api/sluzby?all=true - Získat všechny služby (včetně neaktivních)
POST /api/sluzby          - Vytvořit novou službu
PUT  /api/sluzby          - Aktualizovat službu
DELETE /api/sluzby?id=... - Smazat službu
```

### **Přímo ze složky:**
```
C:\github\pneu_servis\data\cenik_sluzby.xlsx
```

---

## 🔄 **Aktualizace:**

Soubor se **automaticky aktualizuje** při:
- ✅ Přidání nové služby
- ✅ Úpravě služby
- ✅ Smazání služby
- ✅ Změně aktivního stavu

Nemusíte nic dělat - vše je automatické!

---

## 💾 **Záloha:**

**Doporučení:**
1. Pravidelně kopírovat soubor jinam
2. Například: `cenik_sluzby_BACKUP_2025-01-15.xlsx`
3. Nebo nahrát do cloudu (Google Drive, OneDrive)

**Příkaz pro zálohu (PowerShell):**
```powershell
Copy-Item "C:\github\pneu_servis\data\cenik_sluzby.xlsx" "C:\Zalohy\cenik_sluzby_$(Get-Date -Format 'yyyy-MM-dd').xlsx"
```

---

## 🎉 **Výsledek:**

Teď máte profesionální systém, kde:
- ✅ Služby se spravují přes admin rozhraní
- ✅ Data se ukládají do Excelu
- ✅ Web automaticky zobrazuje aktivní služby
- ✅ Můžete je analyzovat v Excelu
- ✅ Vše funguje automaticky!

---

## 📋 **Příklad použití:**

1. **Přidat novou službu:**
   - Jděte na `/admin/sluzby`
   - Klikněte na "➕ Přidat službu"
   - Vyplňte formulář
   - Klikněte na "Uložit"
   - Služba se automaticky přidá do Excelu a zobrazí na webu

2. **Upravit cenu:**
   - Jděte na `/admin/sluzby`
   - Najděte službu a klikněte na "✏️ Upravit"
   - Změňte cenu
   - Klikněte na "Uložit"
   - Cena se automaticky aktualizuje na webu

3. **Skrýt službu:**
   - Jděte na `/admin/sluzby`
   - Najděte službu a klikněte na "👁️ Skrýt"
   - Služba se přestane zobrazovat na webu, ale zůstane v Excelu

---

**Skvělá volba! Excel je univerzální a všichni ho znají.** 🚀


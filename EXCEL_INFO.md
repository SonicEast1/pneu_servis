# 📊 Excel systém pro rezervace

## ✅ **CO SE ZMĚNILO:**

Rezervace se teď **ukládají rovnou do Excel souboru** místo JSON!

---

## 📁 **Soubor:**

```
C:\github\pneu_servis\data\rezervace_all.xlsx
```

---

## 🎯 **Výhody:**

1. ✅ **Přímo otevřitelný v Excelu** - žádné konverze
2. ✅ **Automaticky naformátovaný** - šířka sloupců, česká jména
3. ✅ **Vše v jednom souboru** - kompletní historie rezervací
4. ✅ **Stále živý** - aktualizuje se při každé změně
5. ✅ **Přenositelný** - můžete ho poslat emailem, zkopírovat

---

## 📊 **Struktura tabulky:**

| ID | Služba | Datum | Čas | Jméno | Email | Telefon | Vozidlo | Poznámka | Vytvořeno | Status |
|---|---|---|---|---|---|---|---|---|---|---|
| RES-xxx | Výměna pneumatik | 2025-11-15 | 10:00 | Jan Novák | jan@email.cz | +420123456789 | Škoda Octavia | ... | 11.11.2025 12:00:00 | Čeká na potvrzení |

---

## 🚀 **Jak to funguje:**

### **Když zákazník vytvoří rezervaci:**
1. Vyplní formulář na webu
2. Rezervace se **automaticky přidá** do Excel souboru
3. Nový řádek se objeví v tabulce

### **Když správce změní status:**
1. V admin rozhraní klikne na "Potvrdit" nebo "Zrušit"
2. Excel soubor se **automaticky aktualizuje**
3. Sloupec "Status" se změní

### **Když chcete stáhnout Excel:**
1. V admin rozhraní kliknout na "📊 Stáhnout Excel"
2. Stáhne se soubor `rezervace_all.xlsx`
3. Otevřete v Excelu - vše je správně naformátované!

---

## 💡 **Můžete:**

✅ **Otevřít soubor v Excelu** i během běhu webu (pro čtení)
✅ **Filtrovat a třídit** v Excelu
✅ **Vytvořit grafy** v Excelu
✅ **Použít vzorce** v Excelu
✅ **Zkopírovat data** do jiných programů
✅ **Poslat emailem** jako přílohu
✅ **Zálohovat** jednoduše zkopírováním

---

## ⚠️ **DŮLEŽITÉ:**

- ❌ **Neupravujte soubor** během běhu webu (může dojít ke konfliktu)
- ✅ **Pro úpravy** používejte admin rozhraní
- ✅ **Pro čtení** můžete otevřít Excel kdykoliv
- ✅ **Pro zálohu** zkopírujte soubor jinam

---

## 📥 **Stažení:**

### **Přes admin rozhraní:**
```
http://localhost:3000/admin/rezervace
→ Tlačítko "📊 Stáhnout Excel"
```

### **Přímý link:**
```
http://localhost:3000/api/rezervace/export
```

### **Přímo ze složky:**
```
C:\github\pneu_servis\data\rezervace_all.xlsx
```

---

## 🔄 **Aktualizace:**

Soubor se **automaticky aktualizuje** při:
- ✅ Nové rezervaci
- ✅ Změně statusu
- ✅ Smazání rezervace
- ✅ Úpravě rezervace

Nemusíte nic dělat - vše je automatické!

---

## 💾 **Záloha:**

**Doporučení:**
1. Pravidelně kopírovat soubor jinam
2. Například: `rezervace_all_BACKUP_2025-11-11.xlsx`
3. Nebo nahrát do cloudu (Google Drive, OneDrive)

**Příkaz pro zálohu (PowerShell):**
```powershell
Copy-Item "C:\github\pneu_servis\data\rezervace_all.xlsx" "C:\Zalohy\rezervace_all_$(Get-Date -Format 'yyyy-MM-dd').xlsx"
```

---

## 🎉 **Výsledek:**

Teď máte profesionální systém, kde:
- ✅ Zákazníci rezervují online
- ✅ Data se ukládají do Excelu
- ✅ Můžete je spravovat v admin rozhraní
- ✅ Můžete je analyzovat v Excelu
- ✅ Vše funguje automaticky!

---

**Skvělá volba! Excel je univerzální a všichni ho znají.** 🚀


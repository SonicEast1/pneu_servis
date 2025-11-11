# 🔗 Důležité odkazy pro správu webu

## 📋 Admin stránky:

### 📅 **Správa rezervací**
```
http://localhost:3000/admin/rezervace
```
- Zobrazit všechny rezervace
- Potvrdit/zrušit rezervace
- Export do Excelu
- Vyhledávání a filtrování

### ⭐ **Správa recenzí**
```
http://localhost:3000/admin/recenze
```
- Schvalování recenzí zákazníků
- Zamítání nevhodných recenzí
- Mazání recenzí
- Vyhledávání a filtrování

### 📸 **Správa obrázků**
```
http://localhost:3000/admin/upload
```
- Nahrávání obrázků na web
- Galerie nahraných obrázků
- Kopírování URL obrázků

---

## 🌐 Veřejné stránky:

### 🏠 **Homepage**
```
http://localhost:3000/
```

### 📅 **Rezervace (formulář)**
```
http://localhost:3000/rezervace
```

### 📝 **Recenze**
```
http://localhost:3000/recenze
```

### 🖼️ **Galerie**
```
http://localhost:3000/galerie
```

---

## 📊 Stažení dat:

### **Stáhnout Excel soubor s rezervacemi**
Použít tlačítko v admin rozhraní nebo přímý odkaz:
```
http://localhost:3000/api/rezervace/export
```
Stáhne se soubor `rezervace_all.xlsx` - přímo otevřitelný v Excelu!

---

## 📁 Důležité soubory:

| Soubor | Účel |
|--------|------|
| `data/rezervace_all.xlsx` | Excel soubor se všemi rezervacemi |
| `data/recenze_all.xlsx` | Excel soubor se všemi recenzemi |
| `public/uploads/` | Nahrané obrázky |
| `public/logoWeb.png` | Logo webu |

---

## 🚀 Spuštění webu:

```bash
cd C:\github\pneu_servis
npm run dev
```

Web běží na: **http://localhost:3000**

---

## 📞 Užitečné zkratky:

- **Ctrl + C** = Zastavit server
- **Ctrl + Shift + R** = Hard refresh stránky
- **F12** = Otevřít Developer Tools

---

Pro více informací viz `REZERVACE_SYSTEM.md`


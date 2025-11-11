# Jak nahrát logo

## Krok 1: Uložte logo
1. Uložte obrázek loga, které jste poslali, jako **`logo.png`**
2. Umístěte ho do složky **`C:\github\pneu_servis\public\`**

Výsledná cesta by měla být:
```
C:\github\pneu_servis\public\logo.png
```

## Krok 2: Restartujte vývojový server
Pokud máte spuštěný dev server, restartujte ho:
1. Stiskněte `Ctrl + C` v terminálu
2. Spusťte znovu: `npm run dev`

## Krok 3: Zkontrolujte web
Otevřete `http://localhost:3000` a uvidíte:
- ✅ Logo v navigaci (vlevo nahoře)
- ✅ Logo v patičce (dole)
- ✅ Nový název: **PneuservisVMK**
- ✅ Nové barvy odpovídající logu (oranžová + tmavá hnědá)

---

## Co bylo změněno:
- ✅ Název webu: **PneuservisVMK**
- ✅ Motto: "Vždy nám na každém kole záleží"
- ✅ Barevné schéma:
  - Hlavní: Oranžová (#FF8C00) - z loga
  - Pozadí: Tmavá hnědá (#3D1F1F) - z loga
  - Text: Bílá (#FFFFFF)
- ✅ Logo v navigaci a patičce
- ✅ Všechny prvky upraveny pro sladění s logem

## Alternativa: Pokud logo není PNG
Pokud je logo v jiném formátu (např. .jpg, .webp), můžete:
1. Buď ho převést na PNG
2. Nebo přejmenovat soubor a upravit cestu v kódu

Pro změnu formátu v kódu změňte `"/logo.png"` na `"/logo.webp"` (nebo jiný formát) v souborech:
- `src/components/Navigation.tsx`
- `src/components/Footer.tsx`


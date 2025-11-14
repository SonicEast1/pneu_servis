# 📸 Návod pro správu galerie

## Jak přidat nebo upravit obrázky v galerii

### 1. Přidání obrázků do složky

1. Otevřete složku `public/gallery/` v projektu
2. Zkopírujte nebo přesuňte obrázky (JPG, PNG, GIF, WEBP) do této složky
3. **Důležité:** Obrázky se automaticky NEZOBRAZÍ! Musíte je ručně přepsat v kódu (viz krok 2)

### 2. Úprava názvů, kategorií a URL obrázků

1. Otevřete soubor `src/app/galerie/page.tsx`
2. Najděte sekci označenou komentářem:
   ```typescript
   // ============================================
   // ZDE MŮŽETE UPRAVIT NÁZVY, KATEGORIE A URL OBRÁZKŮ
   // ============================================
   ```
3. Upravte objekt `imageMetadata` podle potřeby:

```typescript
const imageMetadata: Record<string, { title?: string; description?: string; category?: string; imageUrl?: string }> = {
  'foto1.jpg': { 
    title: 'Profesionální výměna', 
    description: 'Naše profesionální výměna pneumatik', 
    category: 'Výměna pneumatik',
    imageUrl: 'https://images.unsplash.com/...' // PROZATÍMNÍ - přepište na '/gallery/foto1.jpg' když přidáte obrázek
  },
  // Přidejte zde další obrázky
};
```

### 3. Co můžete upravit:

- **title**: Název obrázku, který se zobrazí v galerii (pokud není nastaveno, použije se název souboru)
- **description**: Popis obrázku (volitelné)
- **category**: Kategorie obrázku (pokud není nastaveno, použije se "Všechny")
- **imageUrl**: URL obrázku - pokud chcete použít obrázek ze složky, nastavte na `/gallery/nazev_souboru.jpg`

### 4. Jak přepsat prozatímní alt obrázek na skutečný:

1. Přidejte obrázek do složky `public/gallery/` (např. `foto1.jpg`)
2. V `src/app/galerie/page.tsx` najděte řádek s komentářem `// PROZATÍMNÍ`
3. Přepište `imageUrl` na cestu k vašemu obrázku:

```typescript
'foto1.jpg': { 
  title: 'Profesionální výměna', 
  description: 'Naše profesionální výměna pneumatik', 
  category: 'Výměna pneumatik',
  imageUrl: '/gallery/foto1.jpg' // Přepsáno z prozatímního na skutečný obrázek
},
```

### 5. Příklad přidání nového obrázku:

1. Přidejte obrázek `moje_foto.jpg` do složky `public/gallery/`
2. V `src/app/galerie/page.tsx` přidejte do objektu `imageMetadata`:

```typescript
'moje_foto.jpg': { 
  title: 'Nový obrázek', 
  description: 'Popis nového obrázku', 
  category: 'Provoz',
  imageUrl: '/gallery/moje_foto.jpg' // nebo nechte prázdné pro automatické načtení
},
```

### 6. Poznámky:

- **Prozatímní alt obrázky**: Galerie obsahuje 12 prozatímních alt obrázků z Unsplash, aby nevypadala prázdně
- **Ruční aktivace**: Obrázky ze složky se automaticky NEZOBRAZÍ - musíte je ručně přepsat v kódu
- **Zobrazení pouze s imageUrl**: Zobrazí se pouze obrázky, které mají nastaveno `imageUrl` v `imageMetadata`
- **Výchozí hodnoty**: Pokud není nastaven název, použije se název souboru bez přípony
- **Kategorie**: Pokud není nastavena kategorie, obrázek se zobrazí ve všech kategoriích
- **Bezpečnost**: Obrázky ze složky se nezobrazí, dokud je ručně nepřepíšete v kódu - to zajišťuje kontrolu nad zobrazovaným obsahem


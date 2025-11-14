# Správa galerie obrázků

Tento dokument popisuje, jak přidávat a spravovat obrázky v galerii webu.

## Jak to funguje

Galerie automaticky načítá obrázky ze složky `public/gallery/` a jejich metadata z Excel souboru `data/gallery_option.xlsx`.

## Přidání obrázků

### Krok 1: Přidejte obrázky do složky

1. Otevřete složku `public/gallery/` v projektu
2. Zkopírujte nebo přesuňte obrázky (JPG, PNG, GIF, WEBP) do této složky
3. Obrázky budou automaticky zobrazeny v galerii

### Krok 2: Upravte metadata v Excel souboru

1. Otevřete soubor `data/gallery_option.xlsx`
2. Pro každý obrázek vyplňte:
   - **Název souboru**: Přesný název souboru (např. `foto1.jpg`) - musí přesně odpovídat názvu souboru ve složce
   - **Kategorie**: Kategorie obrázku (např. `Výměna pneumatik`, `Servis`, `Provoz`, `Pneumatiky`)
   - **Zobrazovací název**: Název, který se zobrazí v galerii pod obrázkem (např. "Profesionální výměna")
   - **Popis**: Popis obrázku (volitelné)
   - **Aktivní**: `true` nebo `false` - zda se má obrázek zobrazit
   - **Pořadí**: Číslo pro řazení obrázků (nižší = výše)

### Struktura Excel souboru

| ID | Název souboru | Kategorie | Zobrazovací název | Popis | Aktivní | Pořadí |
|----|---------------|-----------|-------------------|-------|---------|--------|
| IMG-1 | foto1.jpg | Výměna pneumatik | Profesionální výměna | Naše profesionální výměna pneumatik | true | 1 |
| IMG-2 | foto2.jpg | Servis | Vyvážení kol | Precizní vyvážení | true | 2 |

**Důležité sloupce:**
- **Název souboru**: Přesný název souboru (např. `foto1.jpg`) - musí odpovídat názvu souboru ve složce
- **Zobrazovací název**: Název, který se zobrazí v galerii pod obrázkem (např. "Profesionální výměna")
- **Kategorie**: Kategorie obrázku pro filtrování
- **Popis**: Popis obrázku (volitelné)
- **Aktivní**: `true` nebo `false` - zda se má obrázek zobrazit
- **Pořadí**: Číslo pro řazení obrázků

## Kategorie

Kategorie se **automaticky generují** z obrázků v Excel souboru. Když přidáte novou kategorii do sloupce "Kategorie" v Excel souboru, automaticky se vytvoří nový button pro tuto kategorii v galerii.

**Jak to funguje:**
1. Přidejte obrázek do složky `public/gallery/`
2. V Excel souboru vyplňte sloupec "Kategorie" (např. "Nové služby")
3. Button pro kategorii "Nové služby" se automaticky vytvoří v galerii
4. Pokud kategorie už existuje, button se nevytvoří znovu (unikátní kategorie)

**Poznámky:**
- Kategorie se generují jen z aktivních obrázků (`Aktivní = true`)
- Prázdné kategorie se ignorují
- Kategorie se řadí abecedně (kromě "Všechny", která je vždy první)

## API Endpoint

Galerie používá API endpoint `/api/gallery`:

- **GET**: Vrací seznam všech aktivních obrázků s metadaty
- **POST**: Aktualizuje metadata obrázků (používá se v admin rozhraní)

## Poznámky

- Obrázky musí být ve formátu JPG, PNG, GIF nebo WEBP
- Názvy souborů v Excel souboru musí přesně odpovídat názvům souborů ve složce
- Pokud obrázek není v Excel souboru, použijí se výchozí hodnoty (zobrazovací název = název souboru bez přípony, kategorie = "Všechny")
- **Zobrazovací název** se zobrazí v galerii pod obrázkem a v lightboxu - můžete ho libovolně upravit v Excel souboru
- Pouze aktivní obrázky (`Aktivní = true`) se zobrazí v galerii
- Obrázky se řadí podle sloupce "Pořadí"

## Příklad použití

1. Přidejte obrázek `moje_foto.jpg` do `public/gallery/`
2. V Excel souboru přidejte řádek:
   - ID: `IMG-10`
   - Název souboru: `moje_foto.jpg`
   - Kategorie: `Provoz`
   - Zobrazovací název: `Naše provozovna`
   - Popis: `Moderní vybavení`
   - Aktivní: `true`
   - Pořadí: `10`
3. Obrázek se automaticky zobrazí v galerii v kategorii "Provoz" s názvem "Naše provozovna"


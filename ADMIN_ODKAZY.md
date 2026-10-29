# Správa webu

Vše se upravuje na adrese **/admin** (např. https://www.pneuservisvmk.cz/admin).
Změny se na webu projeví hned po uložení.

| Sekce | Co se tam dělá | Kde se to ukáže na webu |
|---|---|---|
| Přehled | Nové rezervace, recenze ke schválení, rychlé odkazy | — |
| Rezervace | Potvrdit / zrušit / smazat, export do Excelu | — |
| Otevírací doba | Běžný týden, přestávka, mimořádné dny (svátky, dovolená) | Lišta nahoře, Kontakty, rezervace, chat |
| Služby | Text, ikona, ceny, „dočasně nedostupná“, pořadí | Služby, výběr služby v rezervaci, patička |
| Ceník | Ceny podle rozměru, doplňkové služby, platnost | Ceník, chat |
| Galerie | Nahrání fotek (i z mobilu), popisek, kategorie, skrytí | Galerie |
| Recenze | Přidat, schválit, skrýt | Recenze |
| Statistiky | Návštěvnost webu | — |

## Přihlášení

Jméno a heslo jsou v proměnných prostředí na serveru, ne v kódu:

- `ADMIN_PASSWORD` – heslo (povinné, bez něj se nikdo nepřihlásí)
- `ADMIN_USERNAME` – jméno (nepovinné, výchozí `admin`)

Na Rosti se nastavují přes GitHub secret `ENV` (Settings → Secrets and variables → Actions),
jeden řádek na proměnnou, např. `ADMIN_PASSWORD=…`. Po změně stačí znovu nasadit.
Změna hesla odhlásí všechny přihlášené.

Při vývoji na počítači (bez nastaveného hesla) platí `admin` / `admin`.

## Kde jsou data

- Databáze: `DATA_DIR/pneuservis.db` (SQLite, na Rosti `/srv/data`)
- Nahrané fotky: `DATA_DIR/uploads`

Složka `/srv/data` je mimo nasazovaný kód, takže ji deploy nepřepíše.
Při prvním spuštění se do databáze jednou převezmou data ze starých Excel souborů v `data/`.

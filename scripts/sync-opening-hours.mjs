import { mkdirSync, writeFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as XLSX from 'xlsx';

const hours = [
  { ID: 'OH-1', Den: 'Pondělí', Hodiny: '8:00 - 16:00', 'Pořadí': 1, 'Aktivní': 'Ano' },
  { ID: 'OH-2', Den: 'Úterý', Hodiny: '8:00 - 16:00', 'Pořadí': 2, 'Aktivní': 'Ano' },
  { ID: 'OH-3', Den: 'Středa', Hodiny: '8:00 - 16:00', 'Pořadí': 3, 'Aktivní': 'Ano' },
  { ID: 'OH-4', Den: 'Čtvrtek', Hodiny: '8:00 - 16:00', 'Pořadí': 4, 'Aktivní': 'Ano' },
  { ID: 'OH-5', Den: 'Pátek', Hodiny: '8:00 - 16:00', 'Pořadí': 5, 'Aktivní': 'Ano' },
  { ID: 'OH-6', Den: 'Sobota', Hodiny: '9:00 - 14:00', 'Pořadí': 6, 'Aktivní': 'Ano' },
  { ID: 'OH-7', Den: 'Neděle', Hodiny: 'Zavřeno', 'Pořadí': 7, 'Aktivní': 'Ano' },
];

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dataDir = path.join(root, 'data');
mkdirSync(dataDir, { recursive: true });

const worksheet = XLSX.utils.json_to_sheet(hours);
worksheet['!cols'] = [
  { wch: 15 },
  { wch: 15 },
  { wch: 20 },
  { wch: 8 },
  { wch: 10 },
];

const workbook = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(workbook, worksheet, 'Otevírací doba');
const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
writeFileSync(path.join(dataDir, 'oteviraci_doby.xlsx'), buffer);

console.log('Otevírací doba uložena: Po–Pá 8:00–16:00, So 9:00–14:00, Ne zavřeno');

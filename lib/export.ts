import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';

import { Receipt } from '@/lib/database';

function escapeCell(value: string): string {
  // Wrap in quotes if the value contains a semicolon, quote, or newline
  if (value.includes(';') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function formatCreatedAt(isoString: string): string {
  try {
    const d = new Date(isoString);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${day}.${month}.${year} ${hours}:${minutes}`;
  } catch {
    return isoString;
  }
}

function buildCsv(receipts: Receipt[]): string {
  const header = 'Datum;Geschäft;Betrag (CHF);MwSt (%);Zahlungsart;Erfasst am';

  const rows = receipts.map((r) => {
    const cells = [
      escapeCell(r.date ?? ''),
      escapeCell(r.business ?? ''),
      r.amount != null ? r.amount.toFixed(2) : '',
      r.vat != null ? String(r.vat) : '',
      escapeCell(r.payment_method ?? ''),
      escapeCell(formatCreatedAt(r.created_at)),
    ];
    return cells.join(';');
  });

  return [header, ...rows].join('\r\n');
}

export async function exportReceiptsCsv(receipts: Receipt[]): Promise<void> {
  const csv = buildCsv(receipts);
  const fileUri = FileSystem.cacheDirectory + 'belege_export.csv';

  await FileSystem.writeAsStringAsync(fileUri, csv, {
    encoding: 'utf8',
  });

  const isAvailable = await Sharing.isAvailableAsync();
  if (!isAvailable) {
    throw new Error('Teilen ist auf diesem Gerät nicht verfügbar.');
  }

  await Sharing.shareAsync(fileUri, {
    mimeType: 'text/csv',
    dialogTitle: 'Belege exportieren',
    UTI: 'public.comma-separated-values-text',
  });
}

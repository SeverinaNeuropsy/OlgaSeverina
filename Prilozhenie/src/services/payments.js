import AsyncStorage from '@react-native-async-storage/async-storage';
import { documentDirectory, writeAsStringAsync, EncodingType } from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';

const KEY = '@mamasuper_ledger_v1';

function rowToCsvLine(r) {
  const esc = (s) => `"${String(s).replace(/"/g, '""')}"`;
  return [
    esc(r.userName),
    esc(r.country || ''),
    esc(r.dateIso),
    esc(r.amountUsd),
    esc(r.paymentIndexForUser),
  ].join(',');
}

export const CSV_HEADER =
  'user_name,country,payment_date_iso,amount_usd,payment_index_for_user';

export async function loadLocalPayments() {
  const raw = await AsyncStorage.getItem(KEY);
  if (!raw) return [];
  try {
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

export async function appendPaymentRow(row) {
  const list = await loadLocalPayments();
  list.push(row);
  await AsyncStorage.setItem(KEY, JSON.stringify(list));
  return list;
}

export function buildExportCsv() {
  return loadLocalPayments().then((list) => {
    const lines = [CSV_HEADER, ...list.map(rowToCsvLine)];
    return lines.join('\n');
  });
}

export async function shareExportCsv() {
  const text = await buildExportCsv();
  if (!documentDirectory) throw new Error('documentDirectory');
  const path = documentDirectory + 'mamasuper_payments_export.csv';
  await writeAsStringAsync(path, '\uFEFF' + text, { encoding: EncodingType.UTF8 });
  const can = await Sharing.isAvailableAsync();
  if (can) await Sharing.shareAsync(path, { mimeType: 'text/csv', dialogTitle: 'Экспорт оплат' });
  return path;
}

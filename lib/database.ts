import * as SQLite from 'expo-sqlite';

export interface ReceiptData {
  date: string | null;
  business: string | null;
  amount: number | null;
  vat: number | null;
  payment_method: string | null;
  image_uri: string | null;
  created_at: string;
}

export interface Receipt extends ReceiptData {
  id: number;
}

let db: SQLite.SQLiteDatabase | null = null;

async function getDb(): Promise<SQLite.SQLiteDatabase> {
  if (!db) {
    db = await SQLite.openDatabaseAsync('schreinerei_kiwi.db');
  }
  return db;
}

export async function initDatabase(): Promise<void> {
  const database = await getDb();
  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS receipts (
      id              INTEGER PRIMARY KEY AUTOINCREMENT,
      date            TEXT,
      business        TEXT,
      amount          REAL,
      vat             REAL,
      payment_method  TEXT,
      image_uri       TEXT,
      created_at      TEXT NOT NULL
    );
  `);
}

export async function insertReceipt(data: ReceiptData): Promise<number> {
  const database = await getDb();
  const result = await database.runAsync(
    `INSERT INTO receipts (date, business, amount, vat, payment_method, image_uri, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      data.date,
      data.business,
      data.amount,
      data.vat,
      data.payment_method,
      data.image_uri,
      data.created_at,
    ]
  );
  return result.lastInsertRowId;
}

export async function getAllReceipts(): Promise<Receipt[]> {
  const database = await getDb();
  return database.getAllAsync<Receipt>(
    'SELECT * FROM receipts ORDER BY created_at DESC'
  );
}

export async function getReceiptById(id: number): Promise<Receipt | null> {
  const database = await getDb();
  const result = await database.getFirstAsync<Receipt>(
    'SELECT * FROM receipts WHERE id = ?',
    [id]
  );
  return result ?? null;
}

export async function updateReceipt(id: number, data: Omit<ReceiptData, 'created_at'>): Promise<void> {
  const database = await getDb();
  await database.runAsync(
    `UPDATE receipts SET date = ?, business = ?, amount = ?, vat = ?, payment_method = ?, image_uri = ?
     WHERE id = ?`,
    [data.date, data.business, data.amount, data.vat, data.payment_method, data.image_uri, id]
  );
}

export async function deleteReceipt(id: number): Promise<void> {
  const database = await getDb();
  await database.runAsync('DELETE FROM receipts WHERE id = ?', [id]);
}

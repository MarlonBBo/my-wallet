// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { SQLiteDatabase } from "expo-sqlite";

// export async function initializeDatabase(database: SQLiteDatabase) {

//   await AsyncStorage.removeItem('@active_wallet');
 
//   // Apaga as tabelas existentes
//   await database.execAsync(`
//     DROP TABLE IF EXISTS transactions;
//     DROP TABLE IF EXISTS categories;
//     DROP TABLE IF EXISTS wallets;
//     DROP TABLE IF EXISTS anotations;
//     DROP TABLE IF EXISTS anotations_itens;
//   `);

// }



import { SQLiteDatabase } from "expo-sqlite";

export async function initializeDatabase(database: SQLiteDatabase) {
  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS wallets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      color TEXT NOT NULL,
      balance INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);

  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      wallet_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      color TEXT NOT NULL,
      type TEXT CHECK(type IN ('income', 'expense')) NOT NULL,
      total INTEGER NOT NULL DEFAULT 0,
      icon_name TEXT NOT NULL,
      icon_lib TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (wallet_id) REFERENCES wallets(id) ON DELETE CASCADE,
      UNIQUE (wallet_id, title)
    );
  `);

  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      wallet_id INTEGER NOT NULL,
      category_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      type TEXT CHECK(type IN ('income', 'expense')) NOT NULL,
      icon_name TEXT NOT NULL,
      icon_lib TEXT NOT NULL,
      value INTEGER NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (wallet_id) REFERENCES wallets(id) ON DELETE CASCADE,
      FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
    );
  `);

  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS anotations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      type TEXT CHECK(type IN ('income', 'expense')) NOT NULL,
      wallet_id INTEGER NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (wallet_id) REFERENCES wallets(id) ON DELETE CASCADE
    );
  `);

  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS anotations_itens (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      anotation_id INTEGER NOT NULL,
      category_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      value INTEGER NOT NULL,
      completed INTEGER DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (anotation_id) REFERENCES anotations(id) ON DELETE CASCADE,
      FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
    );
  `);
}

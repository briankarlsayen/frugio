// import db from "./db";
import {SQLiteDatabase} from 'react-native-sqlite-storage';

export const DB_NAME = 'expense.db';

// update when needed
// lowest should be 1
const DATABASE_VERSION = 2;

export const executeSqlAsync = (
  db: SQLiteDatabase,
  sql: string,
  params: any[] = [],
): Promise<any> => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        sql,
        params,
        (_, result) => {
          // console.log('result', result);
          return resolve(result);
        },
        (_, error) => {
          // console.log('error', error);
          return reject(error);
        },
      );
    });
  });
};

const generateTables = async (db: SQLiteDatabase): Promise<void> => {
  db.sqlBatch(
    [
      `DROP TABLE IF EXISTS expenses`,
      `DROP TABLE IF EXISTS categories`,
      `CREATE TABLE categories (
      id INTEGER PRIMARY KEY,
      label TEXT NOT NULL,
      color TEXT NOT NULL,
      description TEXT NULL,
      is_active INTEGER NOT NULL DEFAULT 1
      )`,
      `CREATE TABLE expenses (
      id INTEGER PRIMARY KEY,
      amount REAL NOT NULL DEFAULT 0,
      category_id INTEGER NULL,
      pay_date TEXT NULL,
      description TEXT NULL,
      is_active TINYINT(1) NOT NULL DEFAULT 1,
      created_at NOT NULL DEFAULT (CURRENT_DATE)
      )`,
    ],
    function () {
      console.log('Success table migration');
    },
    function (error) {
      console.log('Success table migration: ' + error.message);
    },
  );
};

const generateCategories = async (db: SQLiteDatabase): Promise<void> => {
  const categories = [
    {
      label: 'Food & Drinks',
      color: '#FF5733',
      description: 'Groceries, restaurants, coffee, snacks',
    },
    {
      label: 'Transportation',
      color: '#3498DB',
      description: 'Gas, public transit, Uber, parking, tolls',
    },
    {
      label: 'Bills',
      color: '#00FF00',
      description: 'Water, internet, house mortage, car mortage, electricity',
    },
    {
      label: 'Travel',
      color: '#1ABC9C',
      description: 'Tours, hiking, flight',
    },
    {
      label: 'Savings & Investments',
      color: '#27AE60',
      description: 'Emergency fund, stocks, crypto, retirement',
    },
    {
      label: 'Shopping',
      color: '#F39C12',
      description: 'Clothes, electronics, accessories, shopee, lazada',
    },
    {
      label: 'Entertainment',
      color: '#9B59B6',
      description: 'Movies, streaming, concerts, games',
    },
  ];

  try {
    await Promise.all(
      categories.map(item =>
        executeSqlAsync(
          db,
          'INSERT INTO categories (label, color, description) VALUES (?, ?, ?);',
          [item?.label, item?.color, item?.description],
        ),
      ),
    );
  } catch (error) {
    console.log('Error generateCategories: ', error);
  }
};

const getDatabaseVersion = async (db: SQLiteDatabase): Promise<number> => {
  try {
    const result = await executeSqlAsync(db, 'PRAGMA user_version;');
    return result.rows.item(0).user_version || 0;
  } catch (error) {
    console.error('Error fetching database version:', error);
    return 0;
  }
};

const updateDatabaseVersion = async (db: SQLiteDatabase) => {
  await executeSqlAsync(db, `PRAGMA user_version = ${DATABASE_VERSION};`);
};

export default async function migration(db: SQLiteDatabase) {
  try {
    const currentDbVersion = await getDatabaseVersion(db);
    console.log('currentDbVersion', currentDbVersion);

    if (currentDbVersion === DATABASE_VERSION) return; // no DB change needed
    else if (!!currentDbVersion || currentDbVersion < DATABASE_VERSION) {
      await generateTables(db);
      await generateCategories(db);
    } else {
      console.log('no change needed');
      return;
    }
    updateDatabaseVersion(db);
  } catch (error) {
    console.log('Error: ', error);
  }
}

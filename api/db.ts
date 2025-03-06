import SQLite from 'react-native-sqlite-storage';
const DB_NAME = 'expense.db';

const db = SQLite.openDatabase(
  {name: 'expense.db', location: 'default'},
  () => {
    console.log('done open');
  },
  error => {
    console.error('Error opening database:', error);
  },
);

export default db;

// export default SQLite.openDatabaseSync({name: DB_NAME, location: 'default'});

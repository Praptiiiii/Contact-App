
import { openDatabase } from 'expo-sqlite';

const db = openDatabase('contacts.db');

db.transaction((tx) => {
  tx.executeSql(
    'CREATE TABLE IF NOT EXISTS contacts (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, imageUri TEXT)',
    [],
    () => {
      console.log('Table created successfully');
    },
    (error) => {
      console.error('Error creating table: ', error);
    }
  );
});

export default db;

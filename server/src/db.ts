import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('./twin3.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the twin3 database.');
});

export default db;
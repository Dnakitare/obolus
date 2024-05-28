const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');

db.serialize(() => {
  db.run("CREATE TABLE users (id INTEGER PRIMARY KEY, username TEXT, password TEXT)");
  db.run("CREATE TABLE expenses (id INTEGER PRIMARY KEY, user_id INTEGER, date TEXT, amount REAL, category TEXT, description TEXT)");
  db.run("CREATE TABLE income (id INTEGER PRIMARY KEY, user_id INTEGER, date TEXT, amount REAL, source TEXT, description TEXT)");
});

db.close();
const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const sqlite3 = require('sqlite3').verbose();
const app = express();

app.use(bodyParser.json());

const db = new sqlite3.Database(':memory:');

// Initalize DB
db.serialize(() => {
  db.run('CREATE TABLE users (id INTEGER PRIMARY KEY, username TEXT, password TEXT)');
  // db.run('INSERT INTO users (username, password) VALUES ("admin", "admin")'); // For testing
  db.run("CREATE TABLE expenses (id INTEGER PRIMARY KEY, user_id INTEGER, date TEXT, amount REAL, category TEXT, description TEXT)");
  db.run("CREATE TABLE income (id INTEGER PRIMARY KEY, user_id INTEGER, date TEXT, amount REAL, source TEXT, description TEXT)");
});


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

// Authenitcation Middleware
const authenticate = (req, res, next) => {
  const token = req.headers['authorization'].split(' ')[1];
  jwt.verify(token, 'secret_key', (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Register User
app.post('/api/register', (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  db.run("INSERT INTO users (username, password) VALUES (?, ?)", [username, hashedPassword], (err) => {
    if (err) return res.sendStatus(500);
    console.log(username);
    res.json({ id:this.lastID });
  });
});

// Login User
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  db.get("SELECT * FROM users WHERE username = ?", [username], (err, user) => {
    if (err || !user) return res.sendStatus(401);
    if (!bcrypt.compareSync(password, user.password)) return res.sendStatus(401);
    console.log(user);
    const token = jwt.sign({ id: user.id }, 'secret_key');
    res.json({ token });
  });
});

// Log Expense
app.post('/api/expenses', authenticate, (req, res) => {
  const { date, amount, category, description } = req.body;
  db.run("INSERT INTO expenses (user_id, date, amount, category, description) VALUES (?, ?, ?, ?, ?)", [req.user.id, date, amount, category, description], (err) => {
    if (err) return res.sendStatus(500);
    res.json({ id: this.lastID });
  });
});

// Log Income
app.post('/api/income', authenticate, (req, res) => {
  const { date, amount, source, description } = req.body;
  db.run("INSERT INTO income (user_id, date, amount, source, description) VALUES (?, ?, ?, ?, ?)", [req.user.id, date, amount, source, description], (err) => {
    if (err) return res.sendStatus(500);
    res.json({ id: this.lastID });
  });
});

// Get Expenses
app.get('/api/expenses', authenticate, (req, res) => {
  db.all("SELECT * FROM expenses WHERE user_id = ?", [req.user.id], (err, expenses) => {
    if (err) return res.sendStatus(500);
    res.json(expenses);
  });
});

// Get Income
app.get('/api/income', authenticate, (req, res) => {
  db.all("SELECT * FROM income WHERE user_id = ?", [req.user.id], (err, income) => {
    if (err) return res.sendStatus(500);
    res.json(income);
  });
});

// Start Server
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
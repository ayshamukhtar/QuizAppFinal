const express = require('express');
const path = require('path');
const db = require('./database');
const app = express();
const port = 3000;

// Serve static files from the root directory
app.use(express.static(__dirname));
app.use(express.json());

// Routes for each page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/questions.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'questions.html'));
});

app.get('/results.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'results.html'));
});

app.listen(port, () => {
  console.log(` Server running at http://localhost:${port}`);
});

// 🔐 Register Endpoint
app.post('/api/register', (req, res) => {
  const { username, password } = req.body;
  db.run(`INSERT INTO users (username, password) VALUES (?, ?)`, [username, password], function (err) {
    if (err) return res.status(400).json({ error: 'Username taken' });
    res.json({ message: 'Registered successfully', userId: this.lastID });
  });
});

// 🔐 Login Endpoint
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  db.get(`SELECT * FROM users WHERE username = ? AND password = ?`, [username, password], (err, user) => {
    if (err || !user) return res.status(401).json({ error: 'Invalid credentials' });
    res.json({ message: 'Login successful', userId: user.id });
  });
});

// 💾 Save Score Endpoint
// Replace the old route with this version
app.post('/api/savescore', (req, res) => {
  const { name, score } = req.body;

  if (!name || typeof score !== 'number') {
    return res.status(400).json({ error: 'Name and score required' });
  }

  const query = `INSERT INTO scores (name, score) VALUES (?, ?)`;
  db.run(query, [name, score], function (err) {
    if (err) {
      console.error("DB Error:", err.message);
      return res.status(500).json({ error: 'Failed to save score' });
    }
    res.json({ message: 'Score saved!', id: this.lastID });
  });
});



// 🏆 Get Top 5 Scores
app.get('/api/top', (req, res) => {
  db.all(`SELECT name, score FROM scores ORDER BY score DESC LIMIT 5`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch scores' });
    res.json(rows);
  });
});


// 👤 Get Scores for a User
app.get('/api/scores/:userId', (req, res) => {
  const userId = req.params.userId;
  db.all(`SELECT * FROM scores WHERE user_id = ? ORDER BY timestamp DESC`, [userId], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch scores' });
    res.json(rows);
  });
});


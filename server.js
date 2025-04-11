// server.js
import express from 'express';
import cors from 'cors';
import { initDB } from './database/db.js';

const app = express();
app.use(cors());
app.use(express.json());

let db;

initDB().then(database => {
  db = database;
  console.log('✅ Database connected.');
});

// Example: Save a transaction
app.post('/api/transactions', async (req, res) => {
  const { name, amount, category } = req.body;
  try {
    await db.run(
      'INSERT INTO transactions (name, amount, category) VALUES (?, ?, ?)',
      [name, amount, category]
    );
    res.status(201).send({ message: 'Transaction added.' });
  } catch (err) {
    res.status(500).send({ error: 'Failed to add transaction.' });
  }
});

// Example: Save a budget
app.post('/api/budgets', async (req, res) => {
  const { category, amount } = req.body;
  try {
    await db.run(
      'INSERT INTO budgets (category, amount) VALUES (?, ?)',
      [category, amount]
    );
    res.status(201).send({ message: 'Budget added.' });
  } catch (err) {
    res.status(500).send({ error: 'Failed to add budget.' });
  }
});

// Run server
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

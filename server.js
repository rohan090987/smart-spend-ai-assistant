
// server.js
import express from 'express';
import cors from 'cors';
import { initDB } from './database/db.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(cors({
  origin: '*', // Allow requests from any origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Serve static files from the dist directory
const distPath = join(__dirname, 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
}

let db;

initDB().then(database => {
  db = database;
  console.log('✅ Database connected.');
}).catch(err => {
  console.error('❌ Database connection error:', err);
});

// CRUD API ENDPOINTS

// Get all transactions
app.get('/api/transactions', async (req, res) => {
  try {
    const transactions = await db.all('SELECT * FROM transactions ORDER BY date DESC');
    res.json(transactions);
  } catch (err) {
    console.error('Error fetching transactions:', err);
    res.status(500).send({ error: 'Failed to fetch transactions.' });
  }
});

// Add a transaction
app.post('/api/transactions', async (req, res) => {
  const { name, amount, category, date } = req.body;
  try {
    const result = await db.run(
      'INSERT INTO transactions (name, amount, category, date) VALUES (?, ?, ?, ?)',
      [name, amount, category, date || new Date().toISOString()]
    );
    
    // Update the spent amount for the budget category if it exists
    if (category) {
      const budget = await db.get('SELECT * FROM budgets WHERE category = ?', [category]);
      if (budget) {
        // Only update spent if it's an expense (negative amount)
        if (amount < 0) {
          await db.run(
            'UPDATE budgets SET spent = spent + ? WHERE category = ?',
            [Math.abs(amount), category]
          );
        }
      }
    }
    
    res.status(201).send({ 
      message: 'Transaction added.',
      id: result.lastID 
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: 'Failed to add transaction.' });
  }
});

// Delete a transaction
app.delete('/api/transactions/:id', async (req, res) => {
  const { id } = req.params;
  try {
    // Get transaction details before deletion to update budget
    const transaction = await db.get('SELECT * FROM transactions WHERE id = ?', [id]);
    
    if (!transaction) {
      return res.status(404).send({ error: 'Transaction not found.' });
    }
    
    await db.run('DELETE FROM transactions WHERE id = ?', [id]);
    
    // Update the spent amount for the budget if it exists and was an expense
    if (transaction.category && transaction.amount < 0) {
      await db.run(
        'UPDATE budgets SET spent = spent - ? WHERE category = ?',
        [Math.abs(transaction.amount), transaction.category]
      );
    }
    
    res.send({ message: 'Transaction deleted.' });
  } catch (err) {
    console.error('Error deleting transaction:', err);
    res.status(500).send({ error: 'Failed to delete transaction.' });
  }
});

// Get all budgets
app.get('/api/budgets', async (req, res) => {
  try {
    const budgets = await db.all('SELECT * FROM budgets');
    res.json(budgets);
  } catch (err) {
    console.error('Error fetching budgets:', err);
    res.status(500).send({ error: 'Failed to fetch budgets.' });
  }
});

// Add a budget
app.post('/api/budgets', async (req, res) => {
  const { category, amount } = req.body;
  try {
    // Check if budget already exists for this category
    const existingBudget = await db.get('SELECT * FROM budgets WHERE category = ?', [category]);
    
    if (existingBudget) {
      await db.run(
        'UPDATE budgets SET amount = ? WHERE category = ?',
        [amount, category]
      );
    } else {
      await db.run(
        'INSERT INTO budgets (category, amount, spent) VALUES (?, ?, 0)',
        [category, amount]
      );
    }
    
    res.status(201).send({ message: 'Budget added.' });
  } catch (err) {
    console.error('Error adding budget:', err);
    res.status(500).send({ error: 'Failed to add budget.' });
  }
});

// Update a budget
app.put('/api/budgets/:id', async (req, res) => {
  const { id } = req.params;
  const { category, amount } = req.body;
  
  try {
    await db.run(
      'UPDATE budgets SET category = ?, amount = ? WHERE id = ?',
      [category, amount, id]
    );
    res.send({ message: 'Budget updated.' });
  } catch (err) {
    console.error('Error updating budget:', err);
    res.status(500).send({ error: 'Failed to update budget.' });
  }
});

// Delete a budget
app.delete('/api/budgets/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.run('DELETE FROM budgets WHERE id = ?', [id]);
    res.send({ message: 'Budget deleted.' });
  } catch (err) {
    console.error('Error deleting budget:', err);
    res.status(500).send({ error: 'Failed to delete budget.' });
  }
});

// Goals API endpoints
app.get('/api/goals', async (req, res) => {
  try {
    const goals = await db.all('SELECT * FROM goals ORDER BY created_at DESC');
    res.json(goals);
  } catch (err) {
    console.error('Error fetching goals:', err);
    res.status(500).send({ error: 'Failed to fetch goals.' });
  }
});

app.post('/api/goals', async (req, res) => {
  const { description, target_amount, category, deadline } = req.body;
  try {
    await db.run(
      'INSERT INTO goals (description, target_amount, current_amount, category, deadline, status) VALUES (?, ?, 0, ?, ?, "In Progress")',
      [description, target_amount, category, deadline]
    );
    res.status(201).send({ message: 'Goal added.' });
  } catch (err) {
    console.error('Error adding goal:', err);
    res.status(500).send({ error: 'Failed to add goal.' });
  }
});

// Update goal progress
app.put('/api/goals/:id', async (req, res) => {
  const { id } = req.params;
  const { current_amount, status } = req.body;
  
  try {
    await db.run(
      'UPDATE goals SET current_amount = ?, status = ? WHERE id = ?',
      [current_amount, status, id]
    );
    res.send({ message: 'Goal updated.' });
  } catch (err) {
    console.error('Error updating goal:', err);
    res.status(500).send({ error: 'Failed to update goal.' });
  }
});

// For any other route, serve the index.html file (for client-side routing)
app.get('*', (req, res) => {
  if (fs.existsSync(join(distPath, 'index.html'))) {
    res.sendFile(join(distPath, 'index.html'));
  } else {
    res.status(404).send('Not found. The application may not be built yet.');
  }
});

// Run server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});


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
const PORT = process.env.PORT || 3001;

let db; // Global database connection

// Enable more detailed logging
const logRequests = (req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
};

app.use(logRequests);

// Configure CORS to allow requests from all origins
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());

// Add a simple test endpoint
app.get('/api/test', (req, res) => {
  console.log('Test endpoint hit');
  res.json({ message: 'API is working!' });
});

// Define API routes with the database connection
// Get all transactions
app.get('/api/transactions', async (req, res) => {
  try {
    console.log('GET /api/transactions');
    if (!db) {
      return res.status(500).json({ error: 'Database not initialized' });
    }
    const transactions = await db.all('SELECT * FROM transactions ORDER BY date DESC');
    console.log('Transactions fetched:', transactions.length);
    res.json(transactions);
  } catch (err) {
    console.error('Error fetching transactions:', err);
    res.status(500).json({ error: 'Failed to fetch transactions: ' + err.message });
  }
});

// Add a transaction
app.post('/api/transactions', async (req, res) => {
  const { name, amount, category, date } = req.body;
  console.log('POST /api/transactions:', { name, amount, category, date });
  
  try {
    if (!db) {
      return res.status(500).json({ error: 'Database not initialized' });
    }
    
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
    
    res.status(201).json({ 
      message: 'Transaction added.',
      id: result.lastID 
    });
  } catch (err) {
    console.error('Error adding transaction:', err);
    res.status(500).json({ error: 'Failed to add transaction: ' + err.message });
  }
});

// Delete a transaction
app.delete('/api/transactions/:id', async (req, res) => {
  const { id } = req.params;
  console.log('DELETE /api/transactions/:id', id);
  
  try {
    if (!db) {
      return res.status(500).json({ error: 'Database not initialized' });
    }
    
    // Get transaction details before deletion to update budget
    const transaction = await db.get('SELECT * FROM transactions WHERE id = ?', [id]);
    
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found.' });
    }
    
    await db.run('DELETE FROM transactions WHERE id = ?', [id]);
    
    // Update the spent amount for the budget if it exists and was an expense
    if (transaction.category && transaction.amount < 0) {
      await db.run(
        'UPDATE budgets SET spent = spent - ? WHERE category = ?',
        [Math.abs(transaction.amount), transaction.category]
      );
    }
    
    res.json({ message: 'Transaction deleted.' });
  } catch (err) {
    console.error('Error deleting transaction:', err);
    res.status(500).json({ error: 'Failed to delete transaction: ' + err.message });
  }
});

// Get all budgets
app.get('/api/budgets', async (req, res) => {
  try {
    console.log('GET /api/budgets');
    if (!db) {
      return res.status(500).json({ error: 'Database not initialized' });
    }
    const budgets = await db.all('SELECT * FROM budgets');
    console.log('Budgets fetched:', budgets.length);
    res.json(budgets);
  } catch (err) {
    console.error('Error fetching budgets:', err);
    res.status(500).json({ error: 'Failed to fetch budgets: ' + err.message });
  }
});

// Add a budget
app.post('/api/budgets', async (req, res) => {
  const { category, amount } = req.body;
  console.log('POST /api/budgets:', { category, amount });
  
  try {
    if (!db) {
      return res.status(500).json({ error: 'Database not initialized' });
    }
    
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
    
    res.status(201).json({ message: 'Budget added.' });
  } catch (err) {
    console.error('Error adding budget:', err);
    res.status(500).json({ error: 'Failed to add budget: ' + err.message });
  }
});

// Update a budget
app.put('/api/budgets/:id', async (req, res) => {
  const { id } = req.params;
  const { category, amount } = req.body;
  console.log('PUT /api/budgets/:id', { id, category, amount });
  
  try {
    if (!db) {
      return res.status(500).json({ error: 'Database not initialized' });
    }
    
    await db.run(
      'UPDATE budgets SET category = ?, amount = ? WHERE id = ?',
      [category, amount, id]
    );
    res.json({ message: 'Budget updated.' });
  } catch (err) {
    console.error('Error updating budget:', err);
    res.status(500).json({ error: 'Failed to update budget: ' + err.message });
  }
});

// Delete a budget
app.delete('/api/budgets/:id', async (req, res) => {
  const { id } = req.params;
  console.log('DELETE /api/budgets/:id', id);
  
  try {
    if (!db) {
      return res.status(500).json({ error: 'Database not initialized' });
    }
    
    await db.run('DELETE FROM budgets WHERE id = ?', [id]);
    res.json({ message: 'Budget deleted.' });
  } catch (err) {
    console.error('Error deleting budget:', err);
    res.status(500).json({ error: 'Failed to delete budget: ' + err.message });
  }
});

// Goals API endpoints
app.get('/api/goals', async (req, res) => {
  try {
    console.log('GET /api/goals');
    if (!db) {
      return res.status(500).json({ error: 'Database not initialized' });
    }
    const goals = await db.all('SELECT * FROM goals ORDER BY created_at DESC');
    console.log('Goals fetched:', goals.length);
    res.json(goals);
  } catch (err) {
    console.error('Error fetching goals:', err);
    res.status(500).json({ error: 'Failed to fetch goals: ' + err.message });
  }
});

app.post('/api/goals', async (req, res) => {
  const { description, target_amount, category, deadline } = req.body;
  console.log('POST /api/goals', { description, target_amount, category, deadline });
  
  try {
    if (!db) {
      return res.status(500).json({ error: 'Database not initialized' });
    }
    
    await db.run(
      'INSERT INTO goals (description, target_amount, current_amount, category, deadline, status) VALUES (?, ?, 0, ?, ?, "In Progress")',
      [description, target_amount, category, deadline]
    );
    res.status(201).json({ message: 'Goal added.' });
  } catch (err) {
    console.error('Error adding goal:', err);
    res.status(500).json({ error: 'Failed to add goal: ' + err.message });
  }
});

// Update goal progress
app.put('/api/goals/:id', async (req, res) => {
  const { id } = req.params;
  const { current_amount, status } = req.body;
  console.log('PUT /api/goals/:id', { id, current_amount, status });
  
  try {
    if (!db) {
      return res.status(500).json({ error: 'Database not initialized' });
    }
    
    await db.run(
      'UPDATE goals SET current_amount = ?, status = ? WHERE id = ?',
      [current_amount, status, id]
    );
    res.json({ message: 'Goal updated.' });
  } catch (err) {
    console.error('Error updating goal:', err);
    res.status(500).json({ error: 'Failed to update goal: ' + err.message });
  }
});

// Serve static files after API routes
const distPath = join(__dirname, 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  
  // For any other route, serve the index.html file (for client-side routing)
  app.get('*', (req, res) => {
    if (!req.url.startsWith('/api/')) {
      if (fs.existsSync(join(distPath, 'index.html'))) {
        res.sendFile(join(distPath, 'index.html'));
      } else {
        res.status(404).send('Not found. The application may not be built yet.');
      }
    } else {
      // This is an API route that wasn't handled
      res.status(404).json({ error: 'API endpoint not found' });
    }
  });
}

// Start the server only after database is initialized
(async () => {
  try {
    console.log('Initializing database before starting server...');
    // Initialize the database connection
    db = await initDB();
    console.log('Database initialized successfully');
    
    // Start server once DB is ready
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
      console.log(`API available at http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
})();

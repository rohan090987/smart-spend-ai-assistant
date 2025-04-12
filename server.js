
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

// Configure CORS
app.use(cors({
  origin: '*', // Allow requests from any origin during development
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());

// Initialize database connection
let db;

// API routes must be defined before static files middleware
const defineApiRoutes = async (database) => {
  // Get all transactions
  app.get('/api/transactions', async (req, res) => {
    try {
      const transactions = await database.all('SELECT * FROM transactions ORDER BY date DESC');
      console.log('Transactions fetched:', transactions.length);
      res.json(transactions);
    } catch (err) {
      console.error('Error fetching transactions:', err);
      res.status(500).json({ error: 'Failed to fetch transactions.' });
    }
  });

  // Add a transaction
  app.post('/api/transactions', async (req, res) => {
    const { name, amount, category, date } = req.body;
    console.log('Adding transaction:', { name, amount, category, date });
    
    try {
      const result = await database.run(
        'INSERT INTO transactions (name, amount, category, date) VALUES (?, ?, ?, ?)',
        [name, amount, category, date || new Date().toISOString()]
      );
      
      // Update the spent amount for the budget category if it exists
      if (category) {
        const budget = await database.get('SELECT * FROM budgets WHERE category = ?', [category]);
        if (budget) {
          // Only update spent if it's an expense (negative amount)
          if (amount < 0) {
            await database.run(
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
      res.status(500).json({ error: 'Failed to add transaction.' });
    }
  });

  // Delete a transaction
  app.delete('/api/transactions/:id', async (req, res) => {
    const { id } = req.params;
    console.log('Deleting transaction:', id);
    
    try {
      // Get transaction details before deletion to update budget
      const transaction = await database.get('SELECT * FROM transactions WHERE id = ?', [id]);
      
      if (!transaction) {
        return res.status(404).json({ error: 'Transaction not found.' });
      }
      
      await database.run('DELETE FROM transactions WHERE id = ?', [id]);
      
      // Update the spent amount for the budget if it exists and was an expense
      if (transaction.category && transaction.amount < 0) {
        await database.run(
          'UPDATE budgets SET spent = spent - ? WHERE category = ?',
          [Math.abs(transaction.amount), transaction.category]
        );
      }
      
      res.json({ message: 'Transaction deleted.' });
    } catch (err) {
      console.error('Error deleting transaction:', err);
      res.status(500).json({ error: 'Failed to delete transaction.' });
    }
  });

  // Get all budgets
  app.get('/api/budgets', async (req, res) => {
    try {
      const budgets = await database.all('SELECT * FROM budgets');
      console.log('Budgets fetched:', budgets.length);
      res.json(budgets);
    } catch (err) {
      console.error('Error fetching budgets:', err);
      res.status(500).json({ error: 'Failed to fetch budgets.' });
    }
  });

  // Add a budget
  app.post('/api/budgets', async (req, res) => {
    const { category, amount } = req.body;
    console.log('Adding budget:', { category, amount });
    
    try {
      // Check if budget already exists for this category
      const existingBudget = await database.get('SELECT * FROM budgets WHERE category = ?', [category]);
      
      if (existingBudget) {
        await database.run(
          'UPDATE budgets SET amount = ? WHERE category = ?',
          [amount, category]
        );
      } else {
        await database.run(
          'INSERT INTO budgets (category, amount, spent) VALUES (?, ?, 0)',
          [category, amount]
        );
      }
      
      res.status(201).json({ message: 'Budget added.' });
    } catch (err) {
      console.error('Error adding budget:', err);
      res.status(500).json({ error: 'Failed to add budget.' });
    }
  });

  // Update a budget
  app.put('/api/budgets/:id', async (req, res) => {
    const { id } = req.params;
    const { category, amount } = req.body;
    console.log('Updating budget:', { id, category, amount });
    
    try {
      await database.run(
        'UPDATE budgets SET category = ?, amount = ? WHERE id = ?',
        [category, amount, id]
      );
      res.json({ message: 'Budget updated.' });
    } catch (err) {
      console.error('Error updating budget:', err);
      res.status(500).json({ error: 'Failed to update budget.' });
    }
  });

  // Delete a budget
  app.delete('/api/budgets/:id', async (req, res) => {
    const { id } = req.params;
    console.log('Deleting budget:', id);
    
    try {
      await database.run('DELETE FROM budgets WHERE id = ?', [id]);
      res.json({ message: 'Budget deleted.' });
    } catch (err) {
      console.error('Error deleting budget:', err);
      res.status(500).json({ error: 'Failed to delete budget.' });
    }
  });

  // Goals API endpoints
  app.get('/api/goals', async (req, res) => {
    try {
      const goals = await database.all('SELECT * FROM goals ORDER BY created_at DESC');
      console.log('Goals fetched:', goals.length);
      res.json(goals);
    } catch (err) {
      console.error('Error fetching goals:', err);
      res.status(500).json({ error: 'Failed to fetch goals.' });
    }
  });

  app.post('/api/goals', async (req, res) => {
    const { description, target_amount, category, deadline } = req.body;
    console.log('Adding goal:', { description, target_amount, category, deadline });
    
    try {
      await database.run(
        'INSERT INTO goals (description, target_amount, current_amount, category, deadline, status) VALUES (?, ?, 0, ?, ?, "In Progress")',
        [description, target_amount, category, deadline]
      );
      res.status(201).json({ message: 'Goal added.' });
    } catch (err) {
      console.error('Error adding goal:', err);
      res.status(500).json({ error: 'Failed to add goal.' });
    }
  });

  // Update goal progress
  app.put('/api/goals/:id', async (req, res) => {
    const { id } = req.params;
    const { current_amount, status } = req.body;
    console.log('Updating goal:', { id, current_amount, status });
    
    try {
      await database.run(
        'UPDATE goals SET current_amount = ?, status = ? WHERE id = ?',
        [current_amount, status, id]
      );
      res.json({ message: 'Goal updated.' });
    } catch (err) {
      console.error('Error updating goal:', err);
      res.status(500).json({ error: 'Failed to update goal.' });
    }
  });
};

// Serve static files after API routes
const serveStaticFiles = () => {
  // Serve static files from the dist directory
  const distPath = join(__dirname, 'dist');
  if (fs.existsSync(distPath)) {
    app.use(express.static(distPath));
  }

  // For any other route, serve the index.html file (for client-side routing)
  app.get('*', (req, res) => {
    if (fs.existsSync(join(distPath, 'index.html'))) {
      res.sendFile(join(distPath, 'index.html'));
    } else {
      res.status(404).send('Not found. The application may not be built yet.');
    }
  });
};

// Start the server
const startServer = async () => {
  try {
    // Initialize the database first
    console.log('Initializing database...');
    db = await initDB();
    console.log('✅ Database connected successfully.');
    
    // Define API routes with the database connection
    await defineApiRoutes(db);
    
    // Serve static files after API routes are defined
    serveStaticFiles();
    
    // Start the server
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
      console.log(`API available at http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer();

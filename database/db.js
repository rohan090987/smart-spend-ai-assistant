
// database/db.js
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dbPath = join(__dirname, 'finance.db');

// Ensure the database directory exists
const ensureDirExists = (dirPath) => {
  try {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      console.log(`Created directory: ${dirPath}`);
    }
  } catch (error) {
    console.error(`Failed to create directory ${dirPath}:`, error);
    throw error;
  }
};

export const initDB = async () => {
  try {
    // Ensure the database directory exists
    ensureDirExists(dirname(dbPath));
    console.log('Initializing database at:', dbPath);
    
    // Enable verbose mode for better debugging
    sqlite3.verbose();
    
    // Check if database file exists
    const dbExists = fs.existsSync(dbPath);
    console.log(`Database file ${dbExists ? 'exists' : 'does not exist'}, will ${dbExists ? 'open' : 'create'} it.`);
    
    // Open the database connection
    const db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
      mode: sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE
    });
    
    console.log('Database connection opened');

    // Enable foreign keys
    await db.exec('PRAGMA foreign_keys = ON;');
    console.log('Foreign keys enabled');

    // Create tables if they don't exist
    console.log('Creating tables if they don\'t exist...');
    
    // Create transactions table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        amount REAL NOT NULL,
        category TEXT,
        date TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Transactions table created or exists');
    
    // Create budgets table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS budgets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        category TEXT NOT NULL UNIQUE,
        amount REAL NOT NULL,
        spent REAL DEFAULT 0,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Budgets table created or exists');
    
    // Create goals table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS goals (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        description TEXT NOT NULL,
        target_amount REAL NOT NULL,
        current_amount REAL DEFAULT 0,
        category TEXT,
        deadline TEXT,
        status TEXT DEFAULT 'In Progress',
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Goals table created or exists');

    console.log('Database schema initialized successfully');
    
    // Check if tables exist by querying them
    const tableCheck = async (tableName) => {
      try {
        const result = await db.all(`SELECT name FROM sqlite_master WHERE type='table' AND name=?`, [tableName]);
        const exists = result.length > 0;
        console.log(`Table ${tableName} check: ${exists ? 'exists' : 'does not exist'}`);
        
        if (exists) {
          const count = await db.get(`SELECT COUNT(*) as count FROM ${tableName}`);
          console.log(`Table ${tableName} has ${count.count} records`);
        }
        
        return exists;
      } catch (err) {
        console.error(`Error checking table ${tableName}:`, err);
        return false;
      }
    };
    
    const transactionsExist = await tableCheck('transactions');
    const budgetsExist = await tableCheck('budgets');
    const goalsExist = await tableCheck('goals');
    
    console.log('Table check results:', { transactionsExist, budgetsExist, goalsExist });
    
    // Set up error event listener
    db.on('error', (err) => {
      console.error('SQLite error event:', err);
    });
    
    return db;
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

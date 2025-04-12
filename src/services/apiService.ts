
const API_BASE = "http://localhost:3001/api";

export interface Transaction {
  id?: number;
  name: string;
  amount: number;
  category: string;
  date?: string;
}

export interface Budget {
  id?: number;
  category: string;
  amount: number;
  spent?: number;
  created_at?: string;
}

export interface Goal {
  id?: number;
  description: string;
  target_amount: number;
  current_amount: number;
  category: string;
  deadline: string;
  status: 'Not Started' | 'In Progress' | 'Completed';
  created_at?: string;
}

export const apiService = {
  // Transaction APIs
  getTransactions: async (): Promise<Transaction[]> => {
    const res = await fetch(`${API_BASE}/transactions`);
    if (!res.ok) throw new Error('Failed to fetch transactions');
    return res.json();
  },
  
  addTransaction: async (tx: Transaction): Promise<{ id: number }> => {
    const res = await fetch(`${API_BASE}/transactions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(tx),
    });
    if (!res.ok) throw new Error('Failed to add transaction');
    return res.json();
  },
  
  deleteTransaction: async (id: number): Promise<void> => {
    const res = await fetch(`${API_BASE}/transactions/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error('Failed to delete transaction');
  },

  // Budget APIs
  getBudgets: async (): Promise<Budget[]> => {
    const res = await fetch(`${API_BASE}/budgets`);
    if (!res.ok) throw new Error('Failed to fetch budgets');
    return res.json();
  },
  
  addBudget: async (budget: Budget): Promise<void> => {
    const res = await fetch(`${API_BASE}/budgets`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(budget),
    });
    if (!res.ok) throw new Error('Failed to add budget');
    return res.json();
  },
  
  updateBudget: async (id: number, budget: Budget): Promise<void> => {
    const res = await fetch(`${API_BASE}/budgets/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(budget),
    });
    if (!res.ok) throw new Error('Failed to update budget');
  },
  
  deleteBudget: async (id: number): Promise<void> => {
    const res = await fetch(`${API_BASE}/budgets/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error('Failed to delete budget');
  },
  
  // Goals APIs
  getGoals: async (): Promise<Goal[]> => {
    const res = await fetch(`${API_BASE}/goals`);
    if (!res.ok) throw new Error('Failed to fetch goals');
    return res.json();
  },
  
  addGoal: async (goal: Omit<Goal, 'id' | 'current_amount' | 'status' | 'created_at'>): Promise<void> => {
    const res = await fetch(`${API_BASE}/goals`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(goal),
    });
    if (!res.ok) throw new Error('Failed to add goal');
    return res.json();
  },
  
  updateGoal: async (id: number, update: Pick<Goal, 'current_amount' | 'status'>): Promise<void> => {
    const res = await fetch(`${API_BASE}/goals/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(update),
    });
    if (!res.ok) throw new Error('Failed to update goal');
  },
};

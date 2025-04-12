
// Determine the appropriate API base URL based on environment
const getApiBaseUrl = () => {
  // Check if we're in development or production
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return "http://localhost:3001/api";
  }
  // For deployed environments, use relative path
  return "/api";
};

const API_BASE = getApiBaseUrl();

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
    try {
      const res = await fetch(`${API_BASE}/transactions`);
      if (!res.ok) throw new Error('Failed to fetch transactions');
      return res.json();
    } catch (error) {
      console.error("Error fetching transactions:", error);
      return [];
    }
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
    try {
      const res = await fetch(`${API_BASE}/budgets`);
      if (!res.ok) throw new Error('Failed to fetch budgets');
      return res.json();
    } catch (error) {
      console.error("Error fetching budgets:", error);
      return [];
    }
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
    try {
      const res = await fetch(`${API_BASE}/goals`);
      if (!res.ok) throw new Error('Failed to fetch goals');
      return res.json();
    } catch (error) {
      console.error("Error fetching goals:", error);
      return [];
    }
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

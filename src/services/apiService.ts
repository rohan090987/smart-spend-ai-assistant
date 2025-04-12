
// Determine the appropriate API base URL based on environment
const getApiBaseUrl = () => {
  // Check if we're in development or production
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return "http://localhost:3001/api";
  }
  // For deployed environments, use absolute path
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
      console.log("Fetching transactions from:", `${API_BASE}/transactions`);
      const res = await fetch(`${API_BASE}/transactions`);
      if (!res.ok) {
        console.error("Error response:", res.status, res.statusText);
        throw new Error(`Failed to fetch transactions: ${res.status}`);
      }
      const data = await res.json();
      console.log("Transactions data received:", data);
      return data;
    } catch (error) {
      console.error("Error fetching transactions:", error);
      throw error;
    }
  },
  
  addTransaction: async (tx: Transaction): Promise<{ id: number }> => {
    try {
      console.log("Adding transaction:", tx);
      const res = await fetch(`${API_BASE}/transactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tx),
      });
      if (!res.ok) throw new Error(`Failed to add transaction: ${res.status}`);
      return res.json();
    } catch (error) {
      console.error("Error adding transaction:", error);
      throw error;
    }
  },
  
  deleteTransaction: async (id: number): Promise<void> => {
    try {
      console.log("Deleting transaction:", id);
      const res = await fetch(`${API_BASE}/transactions/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error(`Failed to delete transaction: ${res.status}`);
    } catch (error) {
      console.error("Error deleting transaction:", error);
      throw error;
    }
  },

  // Budget APIs
  getBudgets: async (): Promise<Budget[]> => {
    try {
      console.log("Fetching budgets from:", `${API_BASE}/budgets`);
      const res = await fetch(`${API_BASE}/budgets`);
      if (!res.ok) {
        console.error("Error response:", res.status, res.statusText);
        throw new Error(`Failed to fetch budgets: ${res.status}`);
      }
      const data = await res.json();
      console.log("Budgets data received:", data);
      return data;
    } catch (error) {
      console.error("Error fetching budgets:", error);
      throw error;
    }
  },
  
  addBudget: async (budget: Budget): Promise<void> => {
    try {
      console.log("Adding budget:", budget);
      const res = await fetch(`${API_BASE}/budgets`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(budget),
      });
      if (!res.ok) throw new Error(`Failed to add budget: ${res.status}`);
      return res.json();
    } catch (error) {
      console.error("Error adding budget:", error);
      throw error;
    }
  },
  
  updateBudget: async (id: number, budget: Budget): Promise<void> => {
    try {
      console.log("Updating budget:", id, budget);
      const res = await fetch(`${API_BASE}/budgets/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(budget),
      });
      if (!res.ok) throw new Error(`Failed to update budget: ${res.status}`);
    } catch (error) {
      console.error("Error updating budget:", error);
      throw error;
    }
  },
  
  deleteBudget: async (id: number): Promise<void> => {
    try {
      console.log("Deleting budget:", id);
      const res = await fetch(`${API_BASE}/budgets/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error(`Failed to delete budget: ${res.status}`);
    } catch (error) {
      console.error("Error deleting budget:", error);
      throw error;
    }
  },
  
  // Goals APIs
  getGoals: async (): Promise<Goal[]> => {
    try {
      console.log("Fetching goals from:", `${API_BASE}/goals`);
      const res = await fetch(`${API_BASE}/goals`);
      if (!res.ok) {
        console.error("Error response:", res.status, res.statusText);
        throw new Error(`Failed to fetch goals: ${res.status}`);
      }
      const data = await res.json();
      console.log("Goals data received:", data);
      return data;
    } catch (error) {
      console.error("Error fetching goals:", error);
      throw error;
    }
  },
  
  addGoal: async (goal: Omit<Goal, 'id' | 'current_amount' | 'status' | 'created_at'>): Promise<void> => {
    try {
      console.log("Adding goal:", goal);
      const res = await fetch(`${API_BASE}/goals`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(goal),
      });
      if (!res.ok) throw new Error(`Failed to add goal: ${res.status}`);
      return res.json();
    } catch (error) {
      console.error("Error adding goal:", error);
      throw error;
    }
  },
  
  updateGoal: async (id: number, update: Pick<Goal, 'current_amount' | 'status'>): Promise<void> => {
    try {
      console.log("Updating goal:", id, update);
      const res = await fetch(`${API_BASE}/goals/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(update),
      });
      if (!res.ok) throw new Error(`Failed to update goal: ${res.status}`);
    } catch (error) {
      console.error("Error updating goal:", error);
      throw error;
    }
  },
};

const API_BASE = "http://localhost:3001/api";

export const apiService = {
  getBudgets: async () => {
    const res = await fetch(`${API_BASE}/budgets`);
    return res.json();
  },
  addBudget: async (budget: { category: string; amount: number }) => {
    const res = await fetch(`${API_BASE}/budgets`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(budget),
    });
    return res.json();
  },
  getTransactions: async () => {
    const res = await fetch(`${API_BASE}/transactions`);
    return res.json();
  },
  addTransaction: async (tx: { description: string; amount: number }) => {
    const res = await fetch(`${API_BASE}/transactions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(tx),
    });
    return res.json();
  },
};

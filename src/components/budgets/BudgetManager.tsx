
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Edit2, Trash2, DollarSign } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface Budget {
  id: string;
  category: string;
  amount: number;
  spent: number;
  color: string;
}

const initialBudgets: Budget[] = [
  {
    id: "b1",
    category: "Food & Groceries",
    amount: 500,
    spent: 320,
    color: "bg-blue-500",
  },
  {
    id: "b2",
    category: "Entertainment",
    amount: 200,
    spent: 180,
    color: "bg-purple-500",
  },
  {
    id: "b3",
    category: "Transportation",
    amount: 300,
    spent: 150,
    color: "bg-green-500",
  },
  {
    id: "b4",
    category: "Utilities",
    amount: 400,
    spent: 350,
    color: "bg-orange-500",
  },
];

const colorOptions = [
  "bg-blue-500",
  "bg-purple-500",
  "bg-green-500",
  "bg-orange-500",
  "bg-pink-500",
  "bg-indigo-500",
  "bg-red-500",
  "bg-teal-500"
];

const BudgetManager = () => {
  const [budgets, setBudgets] = useState<Budget[]>(initialBudgets);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newBudget, setNewBudget] = useState({
    category: "",
    amount: "",
    color: colorOptions[0]
  });

  const handleAddBudget = () => {
    if (newBudget.category && newBudget.amount) {
      const budget: Budget = {
        id: `b${Date.now()}`,
        category: newBudget.category,
        amount: parseFloat(newBudget.amount),
        spent: 0,
        color: newBudget.color
      };
      
      setBudgets([...budgets, budget]);
      setNewBudget({ category: "", amount: "", color: colorOptions[0] });
      setIsAdding(false);
    }
  };

  const handleEditBudget = (budget: Budget) => {
    setEditingId(budget.id);
    setNewBudget({
      category: budget.category,
      amount: budget.amount.toString(),
      color: budget.color
    });
  };

  const handleUpdateBudget = () => {
    if (editingId && newBudget.category && newBudget.amount) {
      const updatedBudgets = budgets.map(budget => 
        budget.id === editingId 
          ? {
              ...budget,
              category: newBudget.category,
              amount: parseFloat(newBudget.amount),
              color: newBudget.color
            } 
          : budget
      );
      
      setBudgets(updatedBudgets);
      setNewBudget({ category: "", amount: "", color: colorOptions[0] });
      setEditingId(null);
    }
  };

  const handleDeleteBudget = (id: string) => {
    const updatedBudgets = budgets.filter(budget => budget.id !== id);
    setBudgets(updatedBudgets);
  };

  const calculateProgress = (spent: number, total: number) => {
    return Math.min(Math.round((spent / total) * 100), 100);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Monthly Budgets</h2>
        {!isAdding && !editingId && (
          <Button onClick={() => setIsAdding(true)} className="gap-1">
            <Plus className="h-4 w-4" /> New Budget
          </Button>
        )}
      </div>

      {(isAdding || editingId) && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? "Edit Budget" : "Create New Budget"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={newBudget.category}
                  onChange={(e) => setNewBudget({ ...newBudget, category: e.target.value })}
                  placeholder="e.g. Food & Groceries"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="amount">Budget Amount</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="amount"
                    type="number"
                    value={newBudget.amount}
                    onChange={(e) => setNewBudget({ ...newBudget, amount: e.target.value })}
                    className="pl-8"
                    placeholder="0.00"
                  />
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label>Color</Label>
                <div className="flex gap-2 flex-wrap">
                  {colorOptions.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className={`w-6 h-6 rounded-full ${color} ${
                        newBudget.color === color ? "ring-2 ring-offset-2 ring-primary" : ""
                      }`}
                      onClick={() => setNewBudget({ ...newBudget, color })}
                    />
                  ))}
                </div>
              </div>
              
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsAdding(false);
                    setEditingId(null);
                    setNewBudget({ category: "", amount: "", color: colorOptions[0] });
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={editingId ? handleUpdateBudget : handleAddBudget}>
                  {editingId ? "Update" : "Create"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {budgets.map((budget) => {
          const progress = calculateProgress(budget.spent, budget.amount);
          
          return (
            <Card key={budget.id} className="overflow-hidden">
              <div className={`h-1 w-full ${budget.color}`} />
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium">{budget.category}</h3>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleEditBudget(budget)}
                      className="p-1 hover:bg-muted rounded-sm"
                    >
                      <Edit2 className="h-4 w-4 text-muted-foreground" />
                    </button>
                    <button
                      onClick={() => handleDeleteBudget(budget.id)}
                      className="p-1 hover:bg-muted rounded-sm"
                    >
                      <Trash2 className="h-4 w-4 text-muted-foreground" />
                    </button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>${budget.spent.toFixed(2)} spent</span>
                    <span>${budget.amount.toFixed(2)} budget</span>
                  </div>
                  
                  <Progress value={progress} className="h-2" />
                  
                  <div className="flex justify-between text-sm">
                    <span>${(budget.amount - budget.spent).toFixed(2)} remaining</span>
                    <span className={progress >= 90 ? "text-red-500" : "text-muted-foreground"}>
                      {progress}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default BudgetManager;

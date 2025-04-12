
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Edit2, Trash2, DollarSign } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { apiService, Budget } from "@/services/apiService";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

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

interface BudgetWithUI extends Budget {
  color: string;
}

const BudgetManager = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentBudget, setCurrentBudget] = useState<BudgetWithUI | null>(null);
  const [newBudget, setNewBudget] = useState({
    category: "",
    amount: "",
    color: colorOptions[0]
  });
  
  const queryClient = useQueryClient();
  
  // Fetch budgets from the API
  const { 
    data: budgets = [], 
    isLoading,
    error 
  } = useQuery({
    queryKey: ['budgets'],
    queryFn: apiService.getBudgets,
    select: (data) => data.map((budget, index) => ({
      ...budget,
      color: colorOptions[index % colorOptions.length]
    })),
  });
  
  // Add budget mutation
  const addBudgetMutation = useMutation({
    mutationFn: apiService.addBudget,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      toast.success("Budget added successfully");
      setIsAddDialogOpen(false);
      setNewBudget({ category: "", amount: "", color: colorOptions[0] });
    },
    onError: () => {
      toast.error("Failed to add budget");
    },
  });
  
  // Update budget mutation
  const updateBudgetMutation = useMutation({
    mutationFn: ({ id, budget }: { id: number, budget: Budget }) => 
      apiService.updateBudget(id, budget),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      toast.success("Budget updated successfully");
      setIsEditDialogOpen(false);
      setCurrentBudget(null);
    },
    onError: () => {
      toast.error("Failed to update budget");
    },
  });
  
  // Delete budget mutation
  const deleteBudgetMutation = useMutation({
    mutationFn: apiService.deleteBudget,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      toast.success("Budget deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete budget");
    },
  });

  const handleAddBudgetClick = () => {
    setNewBudget({
      category: "",
      amount: "",
      color: colorOptions[0]
    });
    setIsAddDialogOpen(true);
  };

  const handleAddBudget = () => {
    if (newBudget.category && newBudget.amount) {
      addBudgetMutation.mutate({
        category: newBudget.category,
        amount: parseFloat(newBudget.amount),
        spent: 0
      });
    }
  };

  const handleEditBudget = (budget: BudgetWithUI) => {
    setCurrentBudget(budget);
    setNewBudget({
      category: budget.category,
      amount: budget.amount.toString(),
      color: budget.color
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateBudget = () => {
    if (currentBudget?.id && newBudget.category && newBudget.amount) {
      updateBudgetMutation.mutate({
        id: currentBudget.id,
        budget: {
          category: newBudget.category,
          amount: parseFloat(newBudget.amount),
          spent: currentBudget.spent
        }
      });
    }
  };

  const handleDeleteBudget = (id: number) => {
    deleteBudgetMutation.mutate(id);
  };

  const calculateProgress = (spent: number = 0, total: number) => {
    return Math.min(Math.round((spent / total) * 100), 100);
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading budgets...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-8">Error loading budgets</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Monthly Budgets</h2>
        <Button onClick={handleAddBudgetClick} className="gap-1">
          <Plus className="h-4 w-4" /> New Budget
        </Button>
      </div>

      {budgets.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground mb-4">No budgets found. Create your first budget to get started.</p>
          <Button onClick={handleAddBudgetClick} variant="outline" className="gap-1">
            <Plus className="h-4 w-4" /> Create Budget
          </Button>
        </Card>
      ) : (
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
                        onClick={() => budget.id && handleDeleteBudget(budget.id)}
                        className="p-1 hover:bg-muted rounded-sm"
                      >
                        <Trash2 className="h-4 w-4 text-muted-foreground" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>${budget.spent?.toFixed(2) || '0.00'} spent</span>
                      <span>${budget.amount.toFixed(2)} budget</span>
                    </div>
                    
                    <Progress value={progress} className="h-2" />
                    
                    <div className="flex justify-between text-sm">
                      <span>${(budget.amount - (budget.spent || 0)).toFixed(2)} remaining</span>
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
      )}

      {/* Add Budget Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Budget</DialogTitle>
          </DialogHeader>
          
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
            
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsAddDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleAddBudget} disabled={addBudgetMutation.isPending}>
                {addBudgetMutation.isPending ? 'Creating...' : 'Create Budget'}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Budget Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Budget</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-category">Category</Label>
              <Input
                id="edit-category"
                value={newBudget.category}
                onChange={(e) => setNewBudget({ ...newBudget, category: e.target.value })}
                placeholder="e.g. Food & Groceries"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="edit-amount">Budget Amount</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="edit-amount"
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
            
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleUpdateBudget} disabled={updateBudgetMutation.isPending}>
                {updateBudgetMutation.isPending ? 'Updating...' : 'Update Budget'}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BudgetManager;

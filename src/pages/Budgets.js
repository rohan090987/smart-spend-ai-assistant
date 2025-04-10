
import React, { useState } from "react";
import Layout from "@/components/layout/Layout";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle, 
  CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { 
  ShoppingBag, 
  Coffee, 
  Utensils, 
  Home, 
  Car, 
  Plus,
  GanttChart,
  Edit,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent, 
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";

// Mock budget data
const initialBudgets = [
  {
    id: "b1",
    name: "Groceries",
    category: "shopping",
    spent: 320,
    budget: 400,
    color: "#3B82F6" // blue
  },
  {
    id: "b2",
    name: "Dining Out",
    category: "dining",
    spent: 250,
    budget: 200,
    color: "#EF4444" // red
  },
  {
    id: "b3",
    name: "Entertainment",
    category: "entertainment",
    spent: 75,
    budget: 150,
    color: "#10B981" // green
  },
  {
    id: "b4",
    name: "Shopping",
    category: "shopping",
    spent: 180,
    budget: 250,
    color: "#F59E0B" // yellow
  },
  {
    id: "b5",
    name: "Transportation",
    category: "transportation",
    spent: 120,
    budget: 150,
    color: "#8B5CF6" // purple
  },
  {
    id: "b6",
    name: "Utilities",
    category: "utilities",
    spent: 195,
    budget: 200,
    color: "#EC4899" // pink
  }
];

const categoryColors = {
  shopping: "#3B82F6",
  dining: "#EF4444",
  housing: "#10B981",
  transportation: "#F59E0B",
  utilities: "#8B5CF6",
  entertainment: "#EC4899",
  income: "#059669",
  food: "#6366F1",
};

const getCategoryIcon = (category) => {
  switch (category) {
    case "shopping":
      return <ShoppingBag className="h-5 w-5" />;
    case "dining":
      return <Utensils className="h-5 w-5" />;
    case "housing":
      return <Home className="h-5 w-5" />;
    case "transportation":
      return <Car className="h-5 w-5" />;
    case "entertainment":
      return <GanttChart className="h-5 w-5" />;
    default:
      return <Coffee className="h-5 w-5" />;
  }
};

const Budgets = () => {
  const [budgets, setBudgets] = useState(initialBudgets);
  const [editingBudget, setEditingBudget] = useState(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [deletingBudgetId, setDeletingBudgetId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "shopping",
    budget: 0
  });

  const handleOpenCreate = () => {
    setFormData({
      name: "",
      category: "shopping",
      budget: 0
    });
    setIsCreateDialogOpen(true);
  };

  const handleOpenEdit = (budget) => {
    setEditingBudget(budget);
    setFormData({
      name: budget.name,
      category: budget.category,
      budget: budget.budget
    });
    setIsEditDialogOpen(true);
  };

  const handleOpenDelete = (id) => {
    setDeletingBudgetId(id);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "budget" ? parseFloat(value) || 0 : value
    }));
  };

  const handleSelectChange = (value) => {
    setFormData(prev => ({
      ...prev,
      category: value
    }));
  };

  const handleCreateBudget = () => {
    if (!formData.name || formData.budget <= 0) {
      toast.error("Please fill in all required fields");
      return;
    }

    const newBudget = {
      id: `b${Date.now()}`,
      name: formData.name,
      category: formData.category,
      spent: 0,
      budget: formData.budget,
      color: categoryColors[formData.category] || "#3B82F6"
    };

    setBudgets(prev => [...prev, newBudget]);
    setIsCreateDialogOpen(false);
    toast.success("Budget created successfully");
  };

  const handleEditBudget = () => {
    if (!editingBudget || !formData.name || formData.budget <= 0) {
      toast.error("Please fill in all required fields");
      return;
    }

    setBudgets(prev => prev.map(budget => 
      budget.id === editingBudget.id 
        ? { 
            ...budget, 
            name: formData.name,
            category: formData.category,
            budget: formData.budget,
            color: categoryColors[formData.category] || budget.color
          } 
        : budget
    ));
    
    setIsEditDialogOpen(false);
    setEditingBudget(null);
    toast.success("Budget updated successfully");
  };

  const handleDeleteBudget = () => {
    if (!deletingBudgetId) return;
    
    setBudgets(prev => prev.filter(budget => budget.id !== deletingBudgetId));
    setDeletingBudgetId(null);
    toast.success("Budget deleted successfully");
  };

  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Budgets</h1>
          <p className="text-muted-foreground">
            Set and track your spending limits
          </p>
        </div>
        <Button onClick={handleOpenCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Create Budget
        </Button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {budgets.map((budget) => {
          const percentage = Math.round((budget.spent / budget.budget) * 100);
          const isOverBudget = budget.spent > budget.budget;
          
          return (
            <Card key={budget.id} className="finance-card overflow-hidden">
              <div className="h-1" style={{ backgroundColor: budget.color }} />
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="p-2 rounded-full" 
                      style={{ backgroundColor: `${budget.color}20` }}
                    >
                      {getCategoryIcon(budget.category)}
                    </div>
                    <CardTitle>{budget.name}</CardTitle>
                  </div>
                  <div 
                    className={cn(
                      "rounded-full px-2 py-1 text-xs font-medium",
                      isOverBudget 
                        ? "bg-red-100 text-finance-red" 
                        : percentage > 80 
                          ? "bg-yellow-100 text-finance-yellow" 
                          : "bg-green-100 text-finance-green"
                    )}
                  >
                    {isOverBudget ? 'Over Budget' : `${percentage}%`}
                  </div>
                </div>
                <CardDescription>Monthly spending limit</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="flex items-center justify-between mb-1">
                  <div className="text-2xl font-bold">
                    ${budget.spent.toFixed(2)}
                    <span className="text-sm font-normal text-muted-foreground ml-1">
                      of ${budget.budget.toFixed(2)}
                    </span>
                  </div>
                </div>
                <Progress 
                  value={Math.min(percentage, 100)} 
                  className={cn(
                    isOverBudget ? "bg-red-100" : "",
                    "bg-muted"
                  )}
                  style={{ 
                    "--progress-value": isOverBudget ? "var(--finance-red)" : budget.color
                  }}
                />
                <div className="mt-1 text-sm text-muted-foreground">
                  {isOverBudget 
                    ? `$${(budget.spent - budget.budget).toFixed(2)} over budget` 
                    : `$${(budget.budget - budget.spent).toFixed(2)} left to spend`}
                </div>
              </CardContent>
              <CardFooter className="pt-1">
                <div className="flex gap-2 w-full">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleOpenEdit(budget)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-finance-red hover:text-destructive hover:border-destructive"
                    onClick={() => handleOpenDelete(budget.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {/* Create Budget Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Budget</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">Budget Name</label>
              <Input
                id="name"
                name="name"
                placeholder="e.g., Groceries"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="category" className="text-sm font-medium">Category</label>
              <Select
                value={formData.category}
                onValueChange={handleSelectChange}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="shopping">Shopping</SelectItem>
                  <SelectItem value="food">Food</SelectItem>
                  <SelectItem value="dining">Dining</SelectItem>
                  <SelectItem value="housing">Housing</SelectItem>
                  <SelectItem value="transportation">Transportation</SelectItem>
                  <SelectItem value="utilities">Utilities</SelectItem>
                  <SelectItem value="entertainment">Entertainment</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label htmlFor="budget" className="text-sm font-medium">Monthly Limit ($)</label>
              <Input
                id="budget"
                name="budget"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={formData.budget || ""}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleCreateBudget}>Create Budget</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Budget Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Budget</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label htmlFor="edit-name" className="text-sm font-medium">Budget Name</label>
              <Input
                id="edit-name"
                name="name"
                placeholder="e.g., Groceries"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="edit-category" className="text-sm font-medium">Category</label>
              <Select
                value={formData.category}
                onValueChange={handleSelectChange}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="shopping">Shopping</SelectItem>
                  <SelectItem value="food">Food</SelectItem>
                  <SelectItem value="dining">Dining</SelectItem>
                  <SelectItem value="housing">Housing</SelectItem>
                  <SelectItem value="transportation">Transportation</SelectItem>
                  <SelectItem value="utilities">Utilities</SelectItem>
                  <SelectItem value="entertainment">Entertainment</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label htmlFor="edit-budget" className="text-sm font-medium">Monthly Limit ($)</label>
              <Input
                id="edit-budget"
                name="budget"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={formData.budget || ""}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleEditBudget}>Save Changes</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingBudgetId} onOpenChange={(open) => !open && setDeletingBudgetId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this budget. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteBudget}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
};

export default Budgets;


import React from "react";
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
import { 
  ShoppingBag, 
  Coffee, 
  Utensils, 
  Home, 
  Car, 
  Plus,
  GanttChart,
  Edit,
  Trash2
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Budget {
  id: string;
  name: string;
  category: string;
  spent: number;
  budget: number;
  color: string;
}

// Mock budget data
const budgets: Budget[] = [
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

const getCategoryIcon = (category: string) => {
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
  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Budgets</h1>
          <p className="text-muted-foreground">
            Set and track your spending limits
          </p>
        </div>
        <Button>
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
                  className={isOverBudget ? "bg-red-100" : ""}
                  style={{ 
                    backgroundColor: isOverBudget ? "" : `${budget.color}20`,
                    "--tw-progress-fill": budget.color
                  } as React.CSSProperties} 
                />
                <div className="mt-1 text-sm text-muted-foreground">
                  {isOverBudget 
                    ? `$${(budget.spent - budget.budget).toFixed(2)} over budget` 
                    : `$${(budget.budget - budget.spent).toFixed(2)} left to spend`}
                </div>
              </CardContent>
              <CardFooter className="pt-1">
                <div className="flex gap-2 w-full">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" className="text-finance-red hover:text-destructive hover:border-destructive">
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </Layout>
  );
};

export default Budgets;


import React from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface BudgetCategory {
  id: string;
  name: string;
  spent: number;
  budget: number;
}

// Mock data for budget categories
const budgetCategories: BudgetCategory[] = [
  {
    id: "b1",
    name: "Groceries",
    spent: 320,
    budget: 400
  },
  {
    id: "b2",
    name: "Dining Out",
    spent: 250,
    budget: 200
  },
  {
    id: "b3",
    name: "Entertainment",
    spent: 75,
    budget: 150
  },
  {
    id: "b4",
    name: "Shopping",
    spent: 180,
    budget: 250
  }
];

export function BudgetProgress() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget Progress</CardTitle>
        <CardDescription>Track your spending against budget</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {budgetCategories.map((category) => {
            const percentage = Math.round((category.spent / category.budget) * 100);
            const isOverBudget = category.spent > category.budget;
            
            return (
              <div key={category.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="font-medium">{category.name}</div>
                  <div className={cn(
                    "text-sm font-medium",
                    isOverBudget ? "text-finance-red" : "text-muted-foreground"
                  )}>
                    ${category.spent} / ${category.budget}
                  </div>
                </div>
                <Progress 
                  value={Math.min(percentage, 100)} 
                  className={isOverBudget ? "bg-finance-red/20" : ""}
                  indicatorClassName={isOverBudget ? "bg-finance-red" : percentage > 80 ? "bg-finance-yellow" : "bg-finance-green"} 
                />
              </div>
            );
          })}
        </div>
        <div className="mt-6 text-center">
          <a href="/budgets" className="text-sm text-primary hover:underline">
            Manage budgets
          </a>
        </div>
      </CardContent>
    </Card>
  );
}

export default BudgetProgress;


import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

// Mock budget data
const budgetCategories = [
  {
    category: "Housing",
    spent: 1200,
    budget: 1500,
    percentage: 80
  },
  {
    category: "Food",
    spent: 450,
    budget: 500,
    percentage: 90
  },
  {
    category: "Transportation",
    spent: 280,
    budget: 300,
    percentage: 93
  },
  {
    category: "Entertainment",
    spent: 150,
    budget: 200,
    percentage: 75
  }
];

const getProgressColor = (percentage) => {
  if (percentage < 70) return "bg-green-500";
  if (percentage < 90) return "bg-yellow-500";
  return "bg-red-500";
};

export function BudgetProgress() {
  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Budget Progress</CardTitle>
        <CardDescription>Track your spending against budget limits</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {budgetCategories.map((item) => (
            <div key={item.category}>
              <div className="flex items-center justify-between mb-1">
                <div className="text-sm font-medium">{item.category}</div>
                <div className="text-sm text-muted-foreground">
                  ${item.spent} / ${item.budget}
                </div>
              </div>
              <Progress 
                value={item.percentage} 
                className="h-2"
                // Remove the indicatorClassName prop which was causing the error
              />
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium">Total Budget</div>
              <div className="text-2xl font-bold">$2,500</div>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium">Spent</div>
              <div className="text-2xl font-bold">$2,080</div>
            </div>
          </div>
          <div className="mt-2">
            <Progress value={83} className="h-2" />
          </div>
          <div className="text-xs text-muted-foreground text-right mt-1">
            83% of budget used
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default BudgetProgress;

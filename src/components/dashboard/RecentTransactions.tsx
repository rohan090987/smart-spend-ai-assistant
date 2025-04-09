
import React from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  ShoppingBag, 
  Coffee, 
  Utensils, 
  Home, 
  Car 
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Transaction {
  id: string;
  name: string;
  category: string;
  amount: number;
  date: string;
}

// Mock data for recent transactions
const recentTransactions: Transaction[] = [
  {
    id: "t1",
    name: "Grocery Store",
    category: "shopping",
    amount: -82.45,
    date: "Today"
  },
  {
    id: "t2",
    name: "Coffee Shop",
    category: "food",
    amount: -4.50,
    date: "Today"
  },
  {
    id: "t3",
    name: "Restaurant",
    category: "dining",
    amount: -36.20,
    date: "Yesterday"
  },
  {
    id: "t4",
    name: "Rent Payment",
    category: "housing",
    amount: -1200,
    date: "Apr 01"
  },
  {
    id: "t5",
    name: "Gas Station",
    category: "transportation",
    amount: -45.67,
    date: "Mar 30"
  }
];

const getCategoryIcon = (category: string) => {
  switch (category) {
    case "shopping":
      return <ShoppingBag className="h-4 w-4" />;
    case "food":
      return <Coffee className="h-4 w-4" />;
    case "dining":
      return <Utensils className="h-4 w-4" />;
    case "housing":
      return <Home className="h-4 w-4" />;
    case "transportation":
      return <Car className="h-4 w-4" />;
    default:
      return <ShoppingBag className="h-4 w-4" />;
  }
};

export function RecentTransactions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
        <CardDescription>Your latest spending activity</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          {recentTransactions.map((transaction) => (
            <div key={transaction.id} className="transaction-item">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full",
                  transaction.amount < 0 ? "bg-red-100" : "bg-green-100"
                )}>
                  {getCategoryIcon(transaction.category)}
                </div>
                <div>
                  <div className="font-medium">{transaction.name}</div>
                  <div className="text-sm text-muted-foreground">{transaction.date}</div>
                </div>
              </div>
              <div className={cn(
                "font-medium",
                transaction.amount < 0 ? "text-finance-red" : "text-finance-green"
              )}>
                {transaction.amount < 0 ? "-" : "+"}${Math.abs(transaction.amount).toFixed(2)}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 text-center">
          <a href="/transactions" className="text-sm text-primary hover:underline">
            View all transactions
          </a>
        </div>
      </CardContent>
    </Card>
  );
}

export default RecentTransactions;

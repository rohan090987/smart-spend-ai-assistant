
import React, { useState } from "react";
import Layout from "@/components/layout/Layout";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue, 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  ShoppingBag, 
  Coffee, 
  Utensils, 
  Home, 
  Car,
  Search,
  Plus,
  Filter
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mock transaction data
const transactions = [
  {
    id: "t1",
    name: "Grocery Store",
    category: "shopping",
    amount: -82.45,
    date: "2023-04-08"
  },
  {
    id: "t2",
    name: "Coffee Shop",
    category: "food",
    amount: -4.50,
    date: "2023-04-08"
  },
  {
    id: "t3",
    name: "Restaurant",
    category: "dining",
    amount: -36.20,
    date: "2023-04-07"
  },
  {
    id: "t4",
    name: "Rent Payment",
    category: "housing",
    amount: -1200,
    date: "2023-04-01"
  },
  {
    id: "t5",
    name: "Gas Station",
    category: "transportation",
    amount: -45.67,
    date: "2023-03-30"
  },
  {
    id: "t6",
    name: "Salary",
    category: "income",
    amount: 3200,
    date: "2023-03-30"
  },
  {
    id: "t7",
    name: "Online Store",
    category: "shopping",
    amount: -65.99,
    date: "2023-03-28"
  },
  {
    id: "t8",
    name: "Movie Tickets",
    category: "entertainment",
    amount: -24.50,
    date: "2023-03-25"
  },
  {
    id: "t9",
    name: "Utility Bill",
    category: "utilities",
    amount: -95.40,
    date: "2023-03-22"
  },
  {
    id: "t10",
    name: "Phone Bill",
    category: "utilities",
    amount: -65.00,
    date: "2023-03-15"
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

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const Transactions = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || transaction.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
          <p className="text-muted-foreground">
            View and manage all your transactions
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Transaction
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Transactions</CardTitle>
          <CardDescription>
            Search and filter your transaction history
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search transactions..."
                className="pl-8 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <div className="w-[180px]">
                <Select 
                  value={categoryFilter} 
                  onValueChange={setCategoryFilter}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="shopping">Shopping</SelectItem>
                    <SelectItem value="food">Food</SelectItem>
                    <SelectItem value="dining">Dining</SelectItem>
                    <SelectItem value="housing">Housing</SelectItem>
                    <SelectItem value="transportation">Transportation</SelectItem>
                    <SelectItem value="utilities">Utilities</SelectItem>
                    <SelectItem value="entertainment">Entertainment</SelectItem>
                    <SelectItem value="income">Income</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="rounded-md border">
            <div className="grid grid-cols-[1fr_auto] sm:grid-cols-[2fr_1fr_auto] font-medium border-b px-4 py-3">
              <div>Transaction</div>
              <div className="hidden sm:block">Date</div>
              <div className="text-right">Amount</div>
            </div>
            <div className="divide-y">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((transaction) => (
                  <div key={transaction.id} className="grid grid-cols-[1fr_auto] sm:grid-cols-[2fr_1fr_auto] px-4 py-3 cursor-pointer hover:bg-muted/50">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "flex h-9 w-9 items-center justify-center rounded-full",
                        transaction.amount < 0 ? "bg-red-100" : "bg-green-100"
                      )}>
                        {getCategoryIcon(transaction.category)}
                      </div>
                      <div>
                        <div className="font-medium">{transaction.name}</div>
                        <div className="text-xs text-muted-foreground capitalize">{transaction.category}</div>
                      </div>
                    </div>
                    <div className="hidden sm:block text-muted-foreground self-center">
                      {formatDate(transaction.date)}
                    </div>
                    <div className={cn(
                      "self-center font-medium",
                      transaction.amount < 0 ? "text-finance-red" : "text-finance-green"
                    )}>
                      {transaction.amount < 0 ? "-" : "+"}${Math.abs(transaction.amount).toFixed(2)}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No transactions found
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Layout>
  );
};

export default Transactions;

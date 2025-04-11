
import React, { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus, ArrowUpDown, ArrowUp, ArrowDown, Filter } from "lucide-react";
import { Card } from "@/components/ui/card";

// Sample transaction data
const sampleTransactions = [
  { 
    id: "t1", 
    description: "Grocery Shopping",
    category: "Food",
    amount: -120.50,
    date: new Date("2025-04-08"),
  },
  {
    id: "t2",
    description: "Salary Deposit",
    category: "Income",
    amount: 2500.00,
    date: new Date("2025-04-05"),
  },
  {
    id: "t3",
    description: "Electric Bill",
    category: "Utilities",
    amount: -95.20,
    date: new Date("2025-04-03"),
  },
  {
    id: "t4",
    description: "Restaurant Dinner",
    category: "Food",
    amount: -65.30,
    date: new Date("2025-04-01"),
  },
  {
    id: "t5",
    description: "Freelance Payment",
    category: "Income",
    amount: 350.00,
    date: new Date("2025-03-29"),
  },
  {
    id: "t6",
    description: "Movie Tickets",
    category: "Entertainment",
    amount: -28.50,
    date: new Date("2025-03-28"),
  },
  {
    id: "t7",
    description: "Gas Station",
    category: "Transportation",
    amount: -45.00,
    date: new Date("2025-03-27"),
  },
];

const TransactionList = () => {
  const [transactions, setTransactions] = useState(sampleTransactions);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc" | null>(null);
  
  // Filter transactions based on search term
  const filteredTransactions = transactions.filter(transaction => 
    transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort transactions by date
  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    if (sortDirection === "asc") {
      return a.date.getTime() - b.date.getTime();
    } else if (sortDirection === "desc") {
      return b.date.getTime() - a.date.getTime();
    }
    return b.date.getTime() - a.date.getTime(); // Default: newest first
  });

  const handleSort = () => {
    if (sortDirection === null) {
      setSortDirection("desc");
    } else if (sortDirection === "desc") {
      setSortDirection("asc");
    } else {
      setSortDirection(null);
    }
  };

  return (
    <Card>
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search transactions..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleSort} className="gap-1">
              {sortDirection === "asc" ? (
                <ArrowUp className="h-4 w-4" />
              ) : sortDirection === "desc" ? (
                <ArrowDown className="h-4 w-4" />
              ) : (
                <ArrowUpDown className="h-4 w-4" />
              )}
              Date
            </Button>
            <Button variant="outline" className="gap-1">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
            <Button className="gap-1">
              <Plus className="h-4 w-4" />
              New Transaction
            </Button>
          </div>
        </div>

        <Table>
          <TableCaption>A list of your recent transactions.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Description</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedTransactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center h-24">
                  No transactions found
                </TableCell>
              </TableRow>
            ) : (
              sortedTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell>{transaction.category}</TableCell>
                  <TableCell>{transaction.date.toLocaleDateString()}</TableCell>
                  <TableCell className={`text-right ${transaction.amount > 0 ? "text-green-600" : "text-red-600"}`}>
                    {transaction.amount > 0 ? "+" : ""}{transaction.amount.toFixed(2)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};

export default TransactionList;

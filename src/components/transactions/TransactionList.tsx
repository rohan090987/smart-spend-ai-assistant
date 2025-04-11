
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
import { Search, Plus, ArrowUpDown, ArrowUp, ArrowDown, Filter, Edit2, Trash2, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

interface Transaction {
  id: string;
  description: string;
  category: string;
  amount: number;
  date: Date;
}

const categories = ["Food", "Entertainment", "Utilities", "Transportation", "Income", "Shopping", "Other"];

// Form schema
const transactionSchema = z.object({
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
  amount: z.string().transform((val) => Number(val)),
  date: z.string().transform((val) => new Date(val))
});

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
  const [transactions, setTransactions] = useState<Transaction[]>(sampleTransactions);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc" | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState<Transaction | null>(null);
  
  const form = useForm({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      description: "",
      category: "Food",
      amount: "0",
      date: new Date().toISOString().split('T')[0]
    }
  });

  const editForm = useForm({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      description: "",
      category: "Food",
      amount: "0",
      date: new Date().toISOString().split('T')[0]
    }
  });

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

  const handleAddTransaction = (data) => {
    const newTransaction: Transaction = {
      id: `t${Date.now()}`,
      description: data.description,
      category: data.category,
      amount: Number(data.amount),
      date: new Date(data.date)
    };
    
    setTransactions([...transactions, newTransaction]);
    setIsAddDialogOpen(false);
    form.reset();
    toast.success("Transaction added successfully");
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setCurrentTransaction(transaction);
    editForm.reset({
      description: transaction.description,
      category: transaction.category,
      amount: transaction.amount.toString(),
      date: transaction.date.toISOString().split('T')[0]
    });
    setIsEditDialogOpen(true);
  };

  const submitEditTransaction = (data) => {
    if (!currentTransaction) return;
    
    const updatedTransactions = transactions.map(t => 
      t.id === currentTransaction.id ? {
        ...t,
        description: data.description,
        category: data.category,
        amount: Number(data.amount),
        date: new Date(data.date)
      } : t
    );
    
    setTransactions(updatedTransactions);
    setIsEditDialogOpen(false);
    setCurrentTransaction(null);
    toast.success("Transaction updated successfully");
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions(transactions.filter(t => t.id !== id));
    toast.success("Transaction deleted successfully");
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
            <Button className="gap-1" onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="h-4 w-4" />
              New Transaction
            </Button>
          </div>
        </div>

        <Table>
          <TableCaption>A list of your transactions.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Description</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedTransactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-24">
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
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleEditTransaction(transaction)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDeleteTransaction(transaction.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add Transaction Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Transaction</DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleAddTransaction)} className="space-y-4">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input placeholder="E.g., Grocery Shopping" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.01" 
                        placeholder="0.00" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button variant="outline" type="button" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Add Transaction</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit Transaction Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Transaction</DialogTitle>
          </DialogHeader>
          
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(submitEditTransaction)} className="space-y-4">
              <FormField
                control={editForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input placeholder="E.g., Grocery Shopping" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={editForm.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={editForm.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.01" 
                        placeholder="0.00" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={editForm.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button variant="outline" type="button" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Save Changes</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default TransactionList;

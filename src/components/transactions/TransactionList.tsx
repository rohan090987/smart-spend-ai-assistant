
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
import { Search, Plus, ArrowUpDown, ArrowUp, ArrowDown, Edit2, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiService, Transaction } from "@/services/apiService";

const transactionSchema = z.object({
  name: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
  amount: z.string().transform((val) => Number(val)),
  date: z.string().transform((val) => val)
});

const TransactionList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc" | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState<Transaction | null>(null);
  
  const queryClient = useQueryClient();

  // Get available categories from budgets
  const { data: budgets = [] } = useQuery({
    queryKey: ['budgets'],
    queryFn: apiService.getBudgets
  });
  
  // Extract unique categories
  const categories = Array.from(new Set(budgets.map(budget => budget.category)));
  
  // Fetch transactions
  const { 
    data: transactions = [], 
    isLoading,
    error 
  } = useQuery({
    queryKey: ['transactions'],
    queryFn: apiService.getTransactions
  });
  
  // Add transaction mutation
  const addTransactionMutation = useMutation({
    mutationFn: apiService.addTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      toast.success("Transaction added successfully");
      setIsAddDialogOpen(false);
      form.reset();
    },
    onError: () => {
      toast.error("Failed to add transaction");
    }
  });
  
  // Delete transaction mutation
  const deleteTransactionMutation = useMutation({
    mutationFn: apiService.deleteTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      toast.success("Transaction deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete transaction");
    }
  });

  const form = useForm({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      name: "",
      category: categories.length > 0 ? categories[0] : "",
      amount: "0",
      date: new Date().toISOString().split('T')[0]
    }
  });

  const editForm = useForm({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      name: "",
      category: categories.length > 0 ? categories[0] : "",
      amount: "0",
      date: new Date().toISOString().split('T')[0]
    }
  });

  // Filter transactions based on search term
  const filteredTransactions = transactions.filter(transaction => 
    transaction.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort transactions by date
  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    if (sortDirection === "asc") {
      return new Date(a.date || "").getTime() - new Date(b.date || "").getTime();
    } else if (sortDirection === "desc") {
      return new Date(b.date || "").getTime() - new Date(a.date || "").getTime();
    }
    return new Date(b.date || "").getTime() - new Date(a.date || "").getTime(); // Default: newest first
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
    addTransactionMutation.mutate({
      name: data.name,
      category: data.category,
      amount: Number(data.amount),
      date: data.date
    });
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setCurrentTransaction(transaction);
    editForm.reset({
      name: transaction.name,
      category: transaction.category,
      amount: transaction.amount.toString(),
      date: transaction.date ? new Date(transaction.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
    });
    setIsEditDialogOpen(true);
  };

  const submitEditTransaction = (data) => {
    if (!currentTransaction?.id) return;
    
    const updatedTransaction = {
      name: data.name,
      category: data.category,
      amount: Number(data.amount),
      date: data.date
    };
    
    // Since we don't have a direct editTransaction endpoint, we'll delete and re-add
    deleteTransactionMutation.mutate(currentTransaction.id, {
      onSuccess: () => {
        addTransactionMutation.mutate(updatedTransaction, {
          onSuccess: () => {
            setIsEditDialogOpen(false);
            setCurrentTransaction(null);
            toast.success("Transaction updated successfully");
          }
        });
      }
    });
  };

  const handleDeleteTransaction = (id: number) => {
    deleteTransactionMutation.mutate(id);
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading transactions...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-8">Error loading transactions</div>;
  }

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
                  <TableCell>{transaction.name}</TableCell>
                  <TableCell>{transaction.category}</TableCell>
                  <TableCell>{new Date(transaction.date || "").toLocaleDateString()}</TableCell>
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
                        onClick={() => transaction.id && handleDeleteTransaction(transaction.id)}
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
                name="name"
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
                        {categories.length > 0 ? (
                          categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="Other">Other</SelectItem>
                        )}
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
                    <FormLabel>Amount (negative for expenses)</FormLabel>
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
                <Button type="submit" disabled={addTransactionMutation.isPending}>
                  {addTransactionMutation.isPending ? 'Adding...' : 'Add Transaction'}
                </Button>
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
                name="name"
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
                        {categories.length > 0 ? (
                          categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="Other">Other</SelectItem>
                        )}
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
                    <FormLabel>Amount (negative for expenses)</FormLabel>
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
                <Button type="submit" disabled={addTransactionMutation.isPending || deleteTransactionMutation.isPending}>
                  Save Changes
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default TransactionList;

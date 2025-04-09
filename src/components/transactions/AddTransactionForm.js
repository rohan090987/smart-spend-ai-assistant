
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { useForm } from "react-hook-form";

function AddTransactionForm({ onSubmit, onCancel }) {
  const [transactionType, setTransactionType] = useState("expense");
  
  const form = useForm({
    defaultValues: {
      name: "",
      amount: "",
      category: "",
      date: new Date().toISOString().split('T')[0]
    }
  });

  const handleSubmit = (data) => {
    // Convert string amount to number and apply sign based on transaction type
    const amount = parseFloat(data.amount);
    const signedAmount = transactionType === "income" ? Math.abs(amount) : -Math.abs(amount);
    
    onSubmit({
      ...data,
      amount: signedAmount,
      date: data.date
    });
    
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="flex gap-4 mb-2">
          <Button
            type="button"
            variant={transactionType === "expense" ? "default" : "outline"}
            className="flex-1"
            onClick={() => setTransactionType("expense")}
          >
            Expense
          </Button>
          <Button
            type="button"
            variant={transactionType === "income" ? "default" : "outline"}
            className="flex-1"
            onClick={() => setTransactionType("income")}
          >
            Income
          </Button>
        </div>
        
        <FormField
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Grocery shopping" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount ($)</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" min="0" placeholder="0.00" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
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
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
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
        
        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Add Transaction</Button>
        </div>
      </form>
    </Form>
  );
}

export default AddTransactionForm;

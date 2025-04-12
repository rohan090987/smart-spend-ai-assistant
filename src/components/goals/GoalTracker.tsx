
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Target, Sparkles, ChevronRight, Zap } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiService, Goal } from "@/services/apiService";
import { Textarea } from "@/components/ui/textarea";
import { fetchAIResponse } from "@/lib/ai";

// Goal form schema
const goalSchema = z.object({
  description: z.string().min(1, "Goal description is required"),
  target_amount: z.string().transform((val) => Number(val)),
  category: z.string().min(1, "Category is required"),
  deadline: z.string().min(1, "Deadline is required"),
});

// Categories for goals
const goalCategories = [
  "Savings", 
  "Debt Payoff", 
  "Emergency Fund", 
  "Vacation", 
  "Education",
  "Home Purchase", 
  "Retirement", 
  "Car Purchase",
  "Wedding",
  "Business"
];

const GoalTracker = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isAiDialogOpen, setIsAiDialogOpen] = useState(false);
  const [goalDescription, setGoalDescription] = useState("");
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const queryClient = useQueryClient();

  const form = useForm({
    resolver: zodResolver(goalSchema),
    defaultValues: {
      description: "",
      target_amount: "",
      category: goalCategories[0],
      deadline: new Date(new Date().setMonth(new Date().getMonth() + 3)).toISOString().split('T')[0],
    }
  });

  // Fetch goals
  const { 
    data: goals = [], 
    isLoading,
    error 
  } = useQuery({
    queryKey: ['goals'],
    queryFn: apiService.getGoals
  });

  // Add goal mutation
  const addGoalMutation = useMutation({
    mutationFn: apiService.addGoal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      toast.success("Goal added successfully");
      setIsAddDialogOpen(false);
      form.reset();
    },
    onError: () => {
      toast.error("Failed to add goal");
    }
  });

  // Update goal progress
  const updateGoalMutation = useMutation({
    mutationFn: ({ id, update }: { id: number, update: Pick<Goal, 'current_amount' | 'status'> }) =>
      apiService.updateGoal(id, update),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      toast.success("Goal progress updated");
    }
  });

  const handleAddGoal = (data) => {
    addGoalMutation.mutate({
      description: data.description,
      targetAmount: Number(data.target_amount),
      category: data.category,
      deadline: data.deadline
    });
  };

  // Calculate progress percentage
  const calculateProgress = (current: number, target: number) => {
    return Math.min(Math.round((current / target) * 100), 100);
  };

  // Update goal progress
  const handleUpdateProgress = (goal: Goal, newAmount: number) => {
    if (!goal.id) return;
    
    const updatedAmount = Math.max(0, Math.min(newAmount, goal.target_amount));
    const newStatus = updatedAmount >= goal.target_amount ? 'Completed' : 'In Progress';
    
    updateGoalMutation.mutate({
      id: goal.id,
      update: {
        current_amount: updatedAmount,
        status: newStatus
      }
    });
  };

  // Analyze goal with AI
  const analyzeGoal = async () => {
    if (!goalDescription.trim()) {
      toast.error("Please enter a goal description");
      return;
    }

    setIsAnalyzing(true);
    
    try {
      const response = await fetchAIResponse(`
        Analyze the following financial goal and provide:
        1. A categorization (Savings, Debt Payoff, Emergency Fund, etc.)
        2. A SMART goal reformulation
        3. 2-3 actionable steps to achieve it
        4. A realistic timeline
        5. Potential challenges and how to overcome them

        Goal: ${goalDescription}
      `);
      
      setAiAnalysis(response);
    } catch (error) {
      toast.error("Failed to analyze goal");
      console.error("AI analysis error:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Apply AI analysis to the form
  const applyAnalysis = () => {
    if (aiAnalysis) {
      // Extract category using regex patterns
      const categoryMatch = aiAnalysis.match(/categorization:?\s*([\w\s]+)/i);
      const category = categoryMatch?.[1]?.trim();
      
      // Find the closest matching category
      const bestCategory = goalCategories.find(c => 
        category?.toLowerCase().includes(c.toLowerCase())
      ) || goalCategories[0];
      
      // Extract SMART goal
      const smartGoalMatch = aiAnalysis.match(/SMART goal[^:]*:?\s*([^.]+)/i);
      const smartGoal = smartGoalMatch?.[1]?.trim() || goalDescription;
      
      form.setValue("description", smartGoal);
      form.setValue("category", bestCategory);
      
      setIsAiDialogOpen(false);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading goals...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-8">Error loading goals</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Financial Goals</h2>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => setIsAiDialogOpen(true)} 
            className="gap-1"
          >
            <Sparkles className="h-4 w-4" /> AI Assist
          </Button>
          <Button onClick={() => setIsAddDialogOpen(true)} className="gap-1">
            <Plus className="h-4 w-4" /> New Goal
          </Button>
        </div>
      </div>

      {goals.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground mb-4">No goals found. Create your first financial goal to get started.</p>
          <Button onClick={() => setIsAddDialogOpen(true)} variant="outline" className="gap-1">
            <Target className="h-4 w-4" /> Create Goal
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {goals.map((goal) => {
            const progress = calculateProgress(goal.current_amount, goal.target_amount);
            const isCompleted = goal.status === 'Completed';
            const deadlineDate = new Date(goal.deadline || "");
            const isOverdue = deadlineDate < new Date() && !isCompleted;
            
            return (
              <Card key={goal.id} className="overflow-hidden">
                <div className={`h-1 w-full ${isCompleted ? "bg-green-500" : isOverdue ? "bg-red-500" : "bg-blue-500"}`} />
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-3">
                        <div className={`mt-1 p-2 rounded-full ${
                          isCompleted ? "bg-green-100" : isOverdue ? "bg-red-100" : "bg-blue-100"
                        }`}>
                          <Target className={`h-5 w-5 ${
                            isCompleted ? "text-green-600" : isOverdue ? "text-red-600" : "text-blue-600"
                          }`} />
                        </div>
                        <div>
                          <h3 className="font-medium text-lg mb-1">{goal.description}</h3>
                          <div className="flex flex-wrap gap-2 mb-2">
                            <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                              {goal.category}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded ${
                              isCompleted ? "bg-green-100 text-green-800" : 
                              isOverdue ? "bg-red-100 text-red-800" : 
                              "bg-yellow-100 text-yellow-800"
                            }`}>
                              {isCompleted ? "Completed" : isOverdue ? "Overdue" : "In Progress"}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Deadline: {new Date(goal.deadline || "").toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 space-y-3">
                        <div className="flex justify-between text-sm">
                          <span>Progress: ${goal.current_amount.toFixed(2)} of ${goal.target_amount.toFixed(2)}</span>
                          <span className={
                            isCompleted ? "text-green-600" : 
                            progress > 75 ? "text-blue-600" : 
                            "text-muted-foreground"
                          }>
                            {progress}%
                          </span>
                        </div>
                        
                        <Progress 
                          value={progress} 
                          className="h-2"
                          indicatorClassName={
                            isCompleted ? "bg-green-500" : 
                            isOverdue ? "bg-red-500" : 
                            "bg-blue-500"
                          }
                        />
                        
                        {!isCompleted && (
                          <div className="flex gap-2 mt-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleUpdateProgress(goal, goal.current_amount + 100)}
                              className="text-xs"
                            >
                              + $100
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleUpdateProgress(goal, goal.current_amount + 500)}
                              className="text-xs"
                            >
                              + $500
                            </Button>
                            <Input 
                              type="number" 
                              className="max-w-[100px] h-8 text-xs"
                              defaultValue={goal.current_amount}
                              onBlur={(e) => {
                                const value = parseFloat(e.target.value);
                                if (!isNaN(value)) {
                                  handleUpdateProgress(goal, value);
                                }
                              }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Add Goal Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Financial Goal</DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleAddGoal)} className="space-y-4">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Goal Description</FormLabel>
                    <FormControl>
                      <Input placeholder="E.g., Save for a vacation" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="target_amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target Amount</FormLabel>
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
                        {goalCategories.map((category) => (
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
                name="deadline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Deadline</FormLabel>
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
                <Button type="submit" disabled={addGoalMutation.isPending}>
                  {addGoalMutation.isPending ? 'Creating...' : 'Create Goal'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* AI Dialog */}
      <Dialog open={isAiDialogOpen} onOpenChange={setIsAiDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-500" />
              Goal Analysis Assistant
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="goal-description">Describe your financial goal</Label>
              <Textarea
                id="goal-description"
                placeholder="E.g., I want to save enough money for a down payment on a house in the next 2 years"
                className="h-24 mt-2"
                value={goalDescription}
                onChange={(e) => setGoalDescription(e.target.value)}
              />
            </div>
            
            {!aiAnalysis && !isAnalyzing && (
              <div className="flex justify-end">
                <Button 
                  onClick={analyzeGoal} 
                  className="gap-1"
                  variant="default"
                  disabled={isAnalyzing}
                >
                  <Zap className="h-4 w-4" />
                  Analyze Goal
                </Button>
              </div>
            )}
            
            {isAnalyzing && (
              <div className="p-4 text-center">
                <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
                <p className="mt-2 text-sm text-muted-foreground">Analyzing your goal...</p>
              </div>
            )}
            
            {aiAnalysis && (
              <div className="space-y-4">
                <div className="bg-muted p-4 rounded-md text-sm whitespace-pre-line">
                  {aiAnalysis}
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setAiAnalysis(null)}>
                    Try Again
                  </Button>
                  <Button onClick={applyAnalysis} className="gap-1">
                    <ChevronRight className="h-4 w-4" />
                    Apply Suggestions
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GoalTracker;


import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Dialog, 
  DialogContent, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus, Target, Calendar, DollarSign } from "lucide-react";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiService, Goal } from "@/services/apiService";

const GoalTracker = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [newGoal, setNewGoal] = useState({
    description: "",
    target_amount: "",
    category: "",
    deadline: ""
  });
  const [updateAmount, setUpdateAmount] = useState("");
  
  const queryClient = useQueryClient();
  
  // Get all categories from existing budgets
  const { data: budgets = [] } = useQuery({
    queryKey: ['budgets'],
    queryFn: apiService.getBudgets
  });
  
  // Extract unique categories from budgets
  const categories = Array.from(new Set(budgets.map(budget => budget.category)));
  
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
      setNewGoal({
        description: "",
        target_amount: "",
        category: "",
        deadline: ""
      });
    },
    onError: (error) => {
      console.error("Error adding goal:", error);
      toast.error("Failed to add goal");
    }
  });
  
  // Update goal mutation
  const updateGoalMutation = useMutation({
    mutationFn: ({ id, update }: { id: number, update: Pick<Goal, 'current_amount' | 'status'> }) => 
      apiService.updateGoal(id, update),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      toast.success("Goal progress updated");
      setIsUpdateDialogOpen(false);
      setSelectedGoal(null);
      setUpdateAmount("");
    },
    onError: (error) => {
      console.error("Error updating goal:", error);
      toast.error("Failed to update goal");
    }
  });

  const handleAddGoal = () => {
    if (!newGoal.description || !newGoal.target_amount || !newGoal.category || !newGoal.deadline) {
      toast.error("Please fill all fields");
      return;
    }
    
    addGoalMutation.mutate({
      description: newGoal.description,
      target_amount: parseFloat(newGoal.target_amount),
      category: newGoal.category,
      deadline: newGoal.deadline
    });
  };

  const handleUpdateGoalProgress = () => {
    if (!selectedGoal || !updateAmount) {
      toast.error("Please enter an amount");
      return;
    }
    
    const currentAmount = parseFloat(updateAmount);
    const newStatus = currentAmount >= selectedGoal.target_amount ? 'Completed' : 'In Progress';
    
    updateGoalMutation.mutate({
      id: selectedGoal.id!,
      update: {
        current_amount: currentAmount,
        status: newStatus
      }
    });
  };

  const calculateProgress = (current: number, target: number) => {
    return Math.min(Math.round((current / target) * 100), 100);
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
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
        <Button onClick={() => setIsAddDialogOpen(true)} className="gap-1">
          <Plus className="h-4 w-4" /> New Goal
        </Button>
      </div>

      {goals.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground mb-4">No financial goals found. Create your first goal to get started.</p>
          <Button onClick={() => setIsAddDialogOpen(true)} variant="outline" className="gap-1">
            <Plus className="h-4 w-4" /> Create Goal
          </Button>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {goals.map((goal) => {
            const progress = calculateProgress(goal.current_amount, goal.target_amount);
            
            return (
              <Card key={goal.id} className="overflow-hidden">
                <div className={`h-1 w-full ${
                  goal.status === 'Completed' ? 'bg-green-500' : 'bg-blue-500'
                }`} />
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{goal.description}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Target:</span>
                    </div>
                    <span>${goal.target_amount.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <div className="flex items-center gap-1">
                      <Target className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Current:</span>
                    </div>
                    <span>${goal.current_amount.toFixed(2)}</span>
                  </div>
                  
                  {goal.deadline && (
                    <div className="flex justify-between text-sm">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Deadline:</span>
                      </div>
                      <span>{formatDate(goal.deadline)}</span>
                    </div>
                  )}
                  
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Progress</span>
                      <span>{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                  
                  <div className="pt-2">
                    <Button
                      onClick={() => {
                        setSelectedGoal(goal);
                        setUpdateAmount(goal.current_amount.toString());
                        setIsUpdateDialogOpen(true);
                      }}
                      variant={goal.status === 'Completed' ? "outline" : "default"}
                      className="w-full"
                    >
                      {goal.status === 'Completed' ? 'Completed' : 'Update Progress'}
                    </Button>
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
            <DialogTitle>Create Financial Goal</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="description">Goal Description</Label>
              <Input
                id="description"
                value={newGoal.description}
                onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                placeholder="e.g. Buy a new car"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="target_amount">Target Amount</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="target_amount"
                  type="number"
                  value={newGoal.target_amount}
                  onChange={(e) => setNewGoal({ ...newGoal, target_amount: e.target.value })}
                  className="pl-8"
                  placeholder="0.00"
                />
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={newGoal.category}
                onValueChange={(value) => setNewGoal({ ...newGoal, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.length > 0 ? (
                    categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))
                  ) : (
                    <>
                      <SelectItem value="Savings">Savings</SelectItem>
                      <SelectItem value="Investment">Investment</SelectItem>
                      <SelectItem value="Debt Payoff">Debt Payoff</SelectItem>
                      <SelectItem value="Major Purchase">Major Purchase</SelectItem>
                      <SelectItem value="Education">Education</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="deadline">Target Date</Label>
              <Input
                id="deadline"
                type="date"
                value={newGoal.deadline}
                onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
              />
            </div>
            
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsAddDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleAddGoal} disabled={addGoalMutation.isPending}>
                {addGoalMutation.isPending ? 'Creating...' : 'Create Goal'}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {/* Update Goal Progress Dialog */}
      <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Goal Progress</DialogTitle>
          </DialogHeader>
          
          {selectedGoal && (
            <div className="space-y-4">
              <p className="font-medium">{selectedGoal.description}</p>
              <p className="text-sm text-muted-foreground">
                Target: ${selectedGoal.target_amount.toFixed(2)}
              </p>
              
              <div className="grid gap-2">
                <Label htmlFor="current_amount">Current Amount Saved</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="current_amount"
                    type="number"
                    value={updateAmount}
                    onChange={(e) => setUpdateAmount(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsUpdateDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleUpdateGoalProgress} disabled={updateGoalMutation.isPending}>
                  {updateGoalMutation.isPending ? 'Updating...' : 'Update Progress'}
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GoalTracker;

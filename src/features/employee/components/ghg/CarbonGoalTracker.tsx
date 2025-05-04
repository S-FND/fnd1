
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { PlusCircle, Target, TrendingUp, Calendar } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "@/hooks/use-toast";
import { CarbonGoal, sampleGoals } from './data/goals';

const formSchema = z.object({
  name: z.string().min(3, {
    message: "Goal name must be at least 3 characters.",
  }),
  description: z.string().optional(),
  targetReduction: z.string().transform((val) => parseInt(val, 10)),
  deadline: z.string().min(1, {
    message: "Please select a deadline.",
  }),
  category: z.enum(['transport', 'home', 'food', 'shopping', 'overall']),
});

const CarbonGoalTracker: React.FC = () => {
  const [goals, setGoals] = useState<CarbonGoal[]>(sampleGoals);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      targetReduction: "10",
      deadline: "",
      category: "overall",
    },
  });

  const getCategoryColor = (category: CarbonGoal['category']) => {
    switch (category) {
      case 'transport': return 'bg-blue-500';
      case 'home': return 'bg-purple-500';
      case 'food': return 'bg-green-500';
      case 'shopping': return 'bg-amber-500';
      default: return 'bg-primary';
    }
  };

  const getCategoryLabel = (category: CarbonGoal['category']) => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };
  
  const getDaysRemaining = (deadline: string) => {
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const newGoal: CarbonGoal = {
      id: Date.now().toString(),
      name: values.name,
      description: values.description,
      targetReduction: values.targetReduction,
      deadline: values.deadline,
      currentProgress: 0,
      category: values.category,
    };
    
    setGoals([...goals, newGoal]);
    setDialogOpen(false);
    form.reset();
    toast({
      title: "Goal created",
      description: "Your carbon reduction goal has been created",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Carbon Reduction Goals</CardTitle>
            <CardDescription>
              Track progress toward your personal emission reduction targets
            </CardDescription>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <PlusCircle className="h-4 w-4" />
                <span>Add Goal</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create New Carbon Goal</DialogTitle>
                <DialogDescription>
                  Set a new personal carbon reduction goal to track your progress.
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Goal Name</FormLabel>
                        <FormControl>
                          <Input placeholder="E.g., Reduce commuting emissions" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description (optional)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="How will you achieve this goal?" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="targetReduction"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Target Reduction %</FormLabel>
                          <FormControl>
                            <Input type="number" min="1" max="100" {...field} />
                          </FormControl>
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
                  </div>
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="overall">Overall Emissions</SelectItem>
                            <SelectItem value="transport">Transportation</SelectItem>
                            <SelectItem value="home">Home Energy</SelectItem>
                            <SelectItem value="food">Food & Diet</SelectItem>
                            <SelectItem value="shopping">Shopping & Lifestyle</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <Button type="submit">Create Goal</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {goals.map((goal) => (
              <div 
                key={goal.id} 
                className="border p-4 rounded-md shadow-sm hover:shadow transition-shadow"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-medium">{goal.name}</h4>
                    {goal.description && (
                      <p className="text-sm text-muted-foreground">{goal.description}</p>
                    )}
                  </div>
                  <Badge className={`${getCategoryColor(goal.category)} hover:${getCategoryColor(goal.category)}`}>
                    {getCategoryLabel(goal.category)}
                  </Badge>
                </div>
                
                <div className="mb-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span>{goal.currentProgress}%</span>
                    <span className="text-primary">{goal.targetReduction}% goal</span>
                  </div>
                  <Progress 
                    value={(goal.currentProgress / goal.targetReduction) * 100} 
                    className="h-2" 
                  />
                </div>
                
                <div className="flex justify-between text-xs text-muted-foreground mt-3">
                  <div className="flex items-center">
                    <Target className="h-3 w-3 mr-1" />
                    <span>{goal.targetReduction}% reduction target</span>
                  </div>
                  <div className="flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    <span>{goal.currentProgress}% progress so far</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>{getDaysRemaining(goal.deadline)} days remaining</span>
                  </div>
                </div>
              </div>
            ))}
            
            {goals.length === 0 && (
              <div className="text-center py-8">
                <Target className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                <h4 className="text-lg font-medium">No goals yet</h4>
                <p className="text-muted-foreground mb-4">
                  Set your first carbon reduction goal to start tracking progress
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => setDialogOpen(true)}
                >
                  Create Your First Goal
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CarbonGoalTracker;

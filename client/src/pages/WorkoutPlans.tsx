import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Edit, Trash2, ArrowRight, Plus, Minus, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { WorkoutPlan } from "@/types";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

// API functions
const getWorkoutPlans = async (): Promise<WorkoutPlan[]> => {
  const response = await axios.get(`${import.meta.env.VITE_API_URL}/workout-plans`);
  return response.data;
};

const createWorkoutPlan = async (plan: Omit<WorkoutPlan, "id" | "_id">) => {
  try {
    // Create a proper payload matching the server's WorkoutPlanSchema
    // Remove the id field completely as MongoDB will generate a new _id
    const { id, _id, ...planWithoutId } = plan as any;
    
    const planData = {
      ...planWithoutId,
      clientId: "000000000000000000000000", // Valid MongoDB ObjectId
      // Ensure exercises have the required fields for the schema
      exercises: plan.exercises.map(ex => ({
        name: ex.name,
        sets: ex.sets || 1,
        reps: ex.reps || 1,
        weight: ex.weight || 0
      }))
    };
    
    console.log("Sending workout plan data:", planData);
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/workout-plans`, planData);
    return response.data;
  } catch (error: any) {
    console.error("API error data:", error.response?.data);
    throw error;
  }
};

const updateWorkoutPlan = async (plan: WorkoutPlan) => {
  try {
    const response = await axios.patch(
      `${import.meta.env.VITE_API_URL}/workout-plans/${plan._id || plan.id}`, 
      plan
    );
    return response.data;
  } catch (error: any) {
    console.error("API error data:", error.response?.data);
    throw error;
  }
};

const deleteWorkoutPlan = async (id: string) => {
  try {
    const response = await axios.delete(`${import.meta.env.VITE_API_URL}/workout-plans/${id}`);
    return response.data;
  } catch (error: any) {
    console.error("API error data:", error.response?.data);
    throw error;
  }
};

const WorkoutPlans = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<WorkoutPlan | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Fetch workout plans
  const { 
    data: plans = [], 
    isLoading,
    error 
  } = useQuery({ 
    queryKey: ['workout-plans'],
    queryFn: getWorkoutPlans
  });

  // Create workout plan mutation
  const createMutation = useMutation({
    mutationFn: createWorkoutPlan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workout-plans'] });
      setIsDialogOpen(false);
      toast({
        title: "Workout plan created",
        description: "New workout plan has been added."
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to create workout plan.",
        variant: "destructive"
      });
      console.error("Create error:", error);
    }
  });

  // Update workout plan mutation
  const updateMutation = useMutation({
    mutationFn: updateWorkoutPlan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workout-plans'] });
      setIsDialogOpen(false);
      toast({
        title: "Workout plan updated",
        description: "Your changes have been saved."
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update workout plan.",
        variant: "destructive"
      });
      console.error("Update error:", error);
    }
  });

  // Delete workout plan mutation
  const deleteMutation = useMutation({
    mutationFn: deleteWorkoutPlan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workout-plans'] });
      toast({
        title: "Workout plan deleted",
        description: "The workout plan has been successfully deleted."
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete workout plan.",
        variant: "destructive"
      });
      console.error("Delete error:", error);
    }
  });

  const handleCreatePlan = () => {
    setCurrentPlan({
      // Don't include 'id' field for new plans
      name: "",
      description: "",
      frequency: 3,
      exercises: [],
      clientId: "000000000000000000000000" // Use a valid ObjectId
    } as WorkoutPlan);
    setIsDialogOpen(true);
  };

  const handleEditPlan = (plan: WorkoutPlan) => {
    setCurrentPlan({ ...plan });
    setIsDialogOpen(true);
  };

  const handleDeletePlan = (id: string) => {
    if (confirm("Are you sure you want to delete this workout plan?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleAddExercise = () => {
    if (!currentPlan) return;
    
    setCurrentPlan({
      ...currentPlan,
      exercises: [
        ...currentPlan.exercises,
        { name: "", sets: 3, reps: 10, weight: 0 }
      ]
    });
  };

  const handleRemoveExercise = (index: number) => {
    if (!currentPlan) return;
    
    const updatedExercises = [...currentPlan.exercises];
    updatedExercises.splice(index, 1);
    
    setCurrentPlan({
      ...currentPlan,
      exercises: updatedExercises
    });
  };

  const handleUpdateExercise = (index: number, field: keyof typeof currentPlan.exercises[0], value: string | number) => {
    if (!currentPlan) return;
    
    const updatedExercises = [...currentPlan.exercises];
    updatedExercises[index] = {
      ...updatedExercises[index],
      [field]: field === 'name' ? value : Number(value)
    };
    
    setCurrentPlan({
      ...currentPlan,
      exercises: updatedExercises
    });
  };

  const handleSavePlan = () => {
    if (!currentPlan?.name) {
      toast({
        title: "Error",
        description: "Plan name is required",
        variant: "destructive"
      });
      return;
    }

    // Make sure at least one exercise is added
    if (currentPlan.exercises.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one exercise",
        variant: "destructive"
      });
      return;
    }

    // Validate that all exercises have names
    const invalidExercises = currentPlan.exercises.filter(ex => !ex.name.trim());
    if (invalidExercises.length > 0) {
      toast({
        title: "Error",
        description: "All exercises must have names",
        variant: "destructive"
      });
      return;
    }

    if (currentPlan._id || plans.some(plan => plan.id === currentPlan.id)) {
      // Update existing plan
      updateMutation.mutate(currentPlan);
    } else {
      // Create new plan
      createMutation.mutate(currentPlan);
    }
  };

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Failed to load workout plans</h2>
          <p className="text-muted-foreground">Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Workout Plans</h1>
          <p className="text-muted-foreground">Create and manage exercise routines for your clients.</p>
        </div>
        <Button onClick={handleCreatePlan}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create New Plan
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading workout plans...</span>
        </div>
      ) : plans.length === 0 ? (
        <Card className="border-dashed border-2">
          <CardContent className="flex flex-col items-center gap-4 py-8">
            <p className="text-center text-muted-foreground">No workout plans created yet. Click the button above to create your first plan.</p>
            <Button onClick={handleCreatePlan}>Create Your First Workout Plan</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {plans.map((plan) => (
            <Card key={plan._id || plan.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle>{plan.name}</CardTitle>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-muted-foreground text-sm mb-4">{plan.description}</p>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm">Frequency: {plan.frequency}x per week</span>
                  <span className="text-sm font-medium">Exercises: {plan.exercises.length}</span>
                </div>
                <div className="space-y-2">
                  {plan.exercises.slice(0, 3).map((exercise, i) => (
                    <div key={i} className="text-xs bg-slate-50 p-2 rounded flex justify-between">
                      <span>{exercise.name}</span>
                      <span>{exercise.sets} x {exercise.reps} {exercise.weight ? `@ ${exercise.weight}kg` : ''}</span>
                    </div>
                  ))}
                  {plan.exercises.length > 3 && (
                    <p className="text-xs text-center text-muted-foreground">
                      +{plan.exercises.length - 3} more exercises
                    </p>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-4 pb-4">
                <div className="flex space-x-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => handleEditPlan(plan)}
                    disabled={updateMutation.isPending}
                  >
                    <Edit className="h-4 w-4 mr-1" /> Edit
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="text-red-500 hover:text-red-600" 
                    onClick={() => handleDeletePlan(plan._id || plan.id)}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4 mr-1" /> Delete
                  </Button>
                </div>
                <Button size="sm" variant="ghost">
                  View Details <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {currentPlan && (currentPlan._id || plans.some(plan => plan.id === currentPlan.id))
                ? "Edit Workout Plan" 
                : "Create Workout Plan"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                className="col-span-3"
                value={currentPlan?.name || ""}
                onChange={(e) => setCurrentPlan(prev => 
                  prev ? { ...prev, name: e.target.value } : null
                )}
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                className="col-span-3"
                value={currentPlan?.description || ""}
                onChange={(e) => setCurrentPlan(prev => 
                  prev ? { ...prev, description: e.target.value } : null
                )}
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="frequency" className="text-right">
                Weekly Frequency
              </Label>
              <Input
                id="frequency"
                type="number"
                className="col-span-3"
                min="1" 
                max="7"
                value={currentPlan?.frequency || 3}
                onChange={(e) => setCurrentPlan(prev => 
                  prev ? { ...prev, frequency: Number(e.target.value) } : null
                )}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 mt-2">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Exercises</h3>
                <Button 
                  type="button" 
                  size="sm" 
                  onClick={handleAddExercise}
                >
                  <Plus className="h-4 w-4 mr-1" /> Add Exercise
                </Button>
              </div>
              
              {currentPlan?.exercises.length === 0 && (
                <p className="text-center text-muted-foreground py-4">
                  No exercises added yet. Click 'Add Exercise' to start.
                </p>
              )}
              
              {currentPlan?.exercises.map((exercise, index) => (
                <div key={index} className="grid grid-cols-12 gap-2 items-center border p-2 rounded-md">
                  <div className="col-span-4">
                    <Label htmlFor={`exercise-${index}`} className="text-xs">
                      Exercise Name
                    </Label>
                    <Input
                      id={`exercise-${index}`}
                      value={exercise.name}
                      onChange={(e) => handleUpdateExercise(index, 'name', e.target.value)}
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor={`sets-${index}`} className="text-xs">
                      Sets
                    </Label>
                    <Input
                      id={`sets-${index}`}
                      type="number"
                      min="1"
                      value={exercise.sets}
                      onChange={(e) => handleUpdateExercise(index, 'sets', e.target.value)}
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor={`reps-${index}`} className="text-xs">
                      Reps
                    </Label>
                    <Input
                      id={`reps-${index}`}
                      type="number"
                      min="1"
                      value={exercise.reps}
                      onChange={(e) => handleUpdateExercise(index, 'reps', e.target.value)}
                    />
                  </div>
                  <div className="col-span-3">
                    <Label htmlFor={`weight-${index}`} className="text-xs">
                      Weight (kg)
                    </Label>
                    <Input
                      id={`weight-${index}`}
                      type="number"
                      min="0"
                      value={exercise.weight || 0}
                      onChange={(e) => handleUpdateExercise(index, 'weight', e.target.value)}
                    />
                  </div>
                  <div className="col-span-1 flex items-end justify-center">
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      className="h-10 w-10 p-0 text-red-500"
                      onClick={() => handleRemoveExercise(index)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              type="button" 
              onClick={handleSavePlan}
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {createMutation.isPending || updateMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WorkoutPlans;

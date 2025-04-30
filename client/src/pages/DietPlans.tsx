import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Edit, Trash2, ArrowRight, Plus, Trash, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { DietPlan as BaseDietPlan } from "@/types";

// Extend DietPlan to include _id property and clientId
interface DietPlan extends BaseDietPlan {
  _id?: string;
  clientId?: string;
}
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

// API functions
const getDietPlans = async (): Promise<DietPlan[]> => {
  const response = await axios.get(`${import.meta.env.VITE_API_URL}/diet-plans`);
  return response.data;
};

const createDietPlan = async (plan: Omit<DietPlan, "id" | "_id"> & {id?: string, _id?: string}) => {
  try {
    // Create a proper payload matching the server's DietPlanSchema
    // Remove the id field completely as MongoDB will generate a new _id
    const { id, _id, ...planWithoutId } = plan;
    
    const planData = {
      ...planWithoutId,
      clientId: "000000000000000000000000", // Valid MongoDB ObjectId
    };
    
    console.log("Sending diet plan data:", planData);
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/diet-plans`, planData);
    return response.data;
  } catch (error: any) {
    console.error("API error data:", error.response?.data);
    throw error;
  }
};

const updateDietPlan = async (plan: DietPlan) => {
  try {
    const response = await axios.patch(
      `${import.meta.env.VITE_API_URL}/diet-plans/${plan._id || plan.id}`, 
      plan
    );
    return response.data;
  } catch (error: any) {
    console.error("API error data:", error.response?.data);
    throw error;
  }
};

const deleteDietPlan = async (id: string) => {
  try {
    const response = await axios.delete(`${import.meta.env.VITE_API_URL}/diet-plans/${id}`);
    return response.data;
  } catch (error: any) {
    console.error("API error data:", error.response?.data);
    throw error;
  }
};

const DietPlans = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<DietPlan | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Fetch diet plans
  const { 
    data: plans = [], 
    isLoading,
    error 
  } = useQuery({ 
    queryKey: ['diet-plans'],
    queryFn: getDietPlans
  });

  // Create diet plan mutation
  const createMutation = useMutation({
    mutationFn: createDietPlan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['diet-plans'] });
      setIsDialogOpen(false);
      toast({
        title: "Diet plan created",
        description: "New diet plan has been added."
      });
    },
    onError: (error: Error & { response?: { data?: { message?: string } } }) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to create diet plan.",
        variant: "destructive"
      });
      console.error("Create error:", error);
    }
  });

  // Update diet plan mutation
  const updateMutation = useMutation({
    mutationFn: updateDietPlan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['diet-plans'] });
      setIsDialogOpen(false);
      toast({
        title: "Diet plan updated",
        description: "Your changes have been saved."
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: "Failed to update diet plan.",
        variant: "destructive"
      });
      console.error("Update error:", error);
    }
  });

  // Delete diet plan mutation
  const deleteMutation = useMutation({
    mutationFn: deleteDietPlan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['diet-plans'] });
      toast({
        title: "Diet plan deleted",
        description: "The diet plan has been successfully deleted."
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete diet plan.",
        variant: "destructive"
      });
      console.error("Delete error:", error);
    }
  });

  const handleCreatePlan = () => {
    setCurrentPlan({
      id: "",  // Include empty id for type compatibility
      name: "",
      description: "",
      dailyCalories: 2000,
      macros: { protein: 30, carbs: 40, fats: 30 },
      meals: [{ name: "", description: "" }],
      clientId: "000000000000000000000000" // Use a valid ObjectId
    });
    setIsDialogOpen(true);
  };

  const handleEditPlan = (plan: DietPlan) => {
    setCurrentPlan({ ...plan });
    setIsDialogOpen(true);
  };

  const handleDeletePlan = (id: string) => {
    if (confirm("Are you sure you want to delete this diet plan?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleAddMeal = () => {
    if (!currentPlan) return;
    
    setCurrentPlan({
      ...currentPlan,
      meals: [
        ...currentPlan.meals,
        { name: "", description: "" }
      ]
    });
  };

  const handleRemoveMeal = (index: number) => {
    if (!currentPlan || currentPlan.meals.length <= 1) return;
    
    const updatedMeals = [...currentPlan.meals];
    updatedMeals.splice(index, 1);
    
    setCurrentPlan({
      ...currentPlan,
      meals: updatedMeals
    });
  };

  const handleUpdateMeal = (index: number, field: keyof typeof currentPlan.meals[0], value: string) => {
    if (!currentPlan) return;
    
    const updatedMeals = [...currentPlan.meals];
    updatedMeals[index] = {
      ...updatedMeals[index],
      [field]: value
    };
    
    setCurrentPlan({
      ...currentPlan,
      meals: updatedMeals
    });
  };

  const handleUpdateMacro = (macro: keyof typeof currentPlan.macros, value: number) => {
    if (!currentPlan) return;
    
    setCurrentPlan({
      ...currentPlan,
      macros: {
        ...currentPlan.macros,
        [macro]: value
      }
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

    // Make sure at least one meal is added
    if (currentPlan.meals.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one meal",
        variant: "destructive"
      });
      return;
    }

    // Validate that all meals have names
    const invalidMeals = currentPlan.meals.filter(meal => !meal.name.trim());
    if (invalidMeals.length > 0) {
      toast({
        title: "Error",
        description: "All meals must have names",
        variant: "destructive"
      });
      return;
    }

    // Validate macros sum to 100%
    const macroSum = currentPlan.macros.protein + currentPlan.macros.carbs + currentPlan.macros.fats;
    if (macroSum !== 100) {
      toast({
        title: "Error",
        description: "Macronutrient percentages must sum to 100%",
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
          <h2 className="text-xl font-semibold mb-2">Failed to load diet plans</h2>
          <p className="text-muted-foreground">Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Diet Plans</h1>
          <p className="text-muted-foreground">Create and manage nutrition plans for your clients.</p>
        </div>
        <Button onClick={handleCreatePlan}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create New Plan
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading diet plans...</span>
        </div>
      ) : plans.length === 0 ? (
        <Card className="border-dashed border-2">
          <CardContent className="flex flex-col items-center gap-4 py-8">
            <p className="text-center text-muted-foreground">No diet plans created yet. Click the button above to create your first plan.</p>
            <Button onClick={handleCreatePlan}>Create Your First Diet Plan</Button>
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
                <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                  <div className="bg-slate-100 p-2 rounded-md">
                    <p className="text-xs text-muted-foreground">Calories</p>
                    <p className="font-bold">{plan.dailyCalories}</p>
                  </div>
                  <div className="bg-slate-100 p-2 rounded-md">
                    <p className="text-xs text-muted-foreground">Protein</p>
                    <p className="font-bold">{plan.macros.protein}%</p>
                  </div>
                  <div className="bg-slate-100 p-2 rounded-md">
                    <p className="text-xs text-muted-foreground">Carbs/Fat</p>
                    <p className="font-bold">{plan.macros.carbs}/{plan.macros.fats}</p>
                  </div>
                </div>
                <p className="text-sm font-medium">Meals: {plan.meals.length}</p>
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
                ? "Edit Diet Plan" 
                : "Create Diet Plan"}
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
              <Label htmlFor="calories" className="text-right">
                Daily Calories
              </Label>
              <Input
                id="calories"
                type="number"
                className="col-span-3"
                min="500"
                max="10000"
                value={currentPlan?.dailyCalories || 2000}
                onChange={(e) => setCurrentPlan(prev => 
                  prev ? { ...prev, dailyCalories: Number(e.target.value) } : null
                )}
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">
                Macros (%)
              </Label>
              <div className="col-span-3 grid grid-cols-3 gap-2">
                <div>
                  <Label htmlFor="protein" className="text-xs">Protein</Label>
                  <Input
                    id="protein"
                    type="number"
                    min="0"
                    max="100"
                    value={currentPlan?.macros.protein || 30}
                    onChange={(e) => handleUpdateMacro('protein', Number(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="carbs" className="text-xs">Carbs</Label>
                  <Input
                    id="carbs"
                    type="number"
                    min="0"
                    max="100"
                    value={currentPlan?.macros.carbs || 40}
                    onChange={(e) => handleUpdateMacro('carbs', Number(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="fats" className="text-xs">Fats</Label>
                  <Input
                    id="fats"
                    type="number"
                    min="0"
                    max="100"
                    value={currentPlan?.macros.fats || 30}
                    onChange={(e) => handleUpdateMacro('fats', Number(e.target.value))}
                  />
                </div>
              </div>
              {currentPlan && (
                <p className={`col-start-2 col-span-3 text-sm ${
                  currentPlan.macros.protein + currentPlan.macros.carbs + currentPlan.macros.fats === 100 
                  ? 'text-green-600' 
                  : 'text-red-500'
                }`}>
                  Total: {currentPlan.macros.protein + currentPlan.macros.carbs + currentPlan.macros.fats}% 
                  {currentPlan.macros.protein + currentPlan.macros.carbs + currentPlan.macros.fats !== 100 && 
                    ' (must sum to 100%)'}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4 mt-2">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Meals</h3>
                <Button 
                  type="button" 
                  size="sm" 
                  onClick={handleAddMeal}
                >
                  <Plus className="h-4 w-4 mr-1" /> Add Meal
                </Button>
              </div>
              
              {currentPlan?.meals.map((meal, index) => (
                <div key={index} className="grid gap-4 border p-4 rounded-md relative">
                  {currentPlan.meals.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 h-8 w-8 p-0"
                      onClick={() => handleRemoveMeal(index)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  )}
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor={`meal-name-${index}`} className="text-right">
                      Name
                    </Label>
                    <Input
                      id={`meal-name-${index}`}
                      className="col-span-3"
                      placeholder="e.g. Breakfast"
                      value={meal.name}
                      onChange={(e) => handleUpdateMeal(index, 'name', e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor={`meal-description-${index}`} className="text-right">
                      Description
                    </Label>
                    <Textarea
                      id={`meal-description-${index}`}
                      className="col-span-3"
                      placeholder="Meal details..."
                      value={meal.description}
                      onChange={(e) => handleUpdateMeal(index, 'description', e.target.value)}
                    />
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

export default DietPlans;

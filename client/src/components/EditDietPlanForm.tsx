import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash } from "lucide-react";
import { toast } from "sonner";
import { Client, DietPlan } from "@/types";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";

const mealSchema = z.object({
  name: z.string().min(1, { message: "Meal name is required" }),
  description: z.string().min(1, { message: "Meal description is required" }),
});

const dietPlanFormSchema = z.object({
  name: z.string().min(1, { message: "Plan name is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  dailyCalories: z.number().min(500, { message: "Must be at least 500" }).max(10000, { message: "Must not exceed 10,000" }),
  macros: z.object({
    protein: z.number().min(0, { message: "Must be at least 0" }).max(100, { message: "Must not exceed 100" }),
    carbs: z.number().min(0, { message: "Must be at least 0" }).max(100, { message: "Must not exceed 100" }),
    fats: z.number().min(0, { message: "Must be at least 0" }).max(100, { message: "Must not exceed 100" }),
  }).refine(data => {
    const sum = data.protein + data.carbs + data.fats;
    return sum === 100;
  }, {
    message: "Macros must sum to 100%",
    path: ["protein"], // highlights the first field
  }),
  meals: z.array(mealSchema).min(1, { message: "At least one meal is required" }),
});

type DietPlanFormValues = z.infer<typeof dietPlanFormSchema>;

interface EditDietPlanFormProps {
  client: Client;
  onSuccess: (updatedDietPlan: DietPlan) => void;
  onCancel: () => void;
}

const EditDietPlanForm = ({ client, onSuccess, onCancel }: EditDietPlanFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const existingDietPlan = client.dietPlan;
  
  const defaultValues: DietPlanFormValues = existingDietPlan ? {
    name: existingDietPlan.name,
    description: existingDietPlan.description,
    dailyCalories: existingDietPlan.dailyCalories,
    macros: {
      protein: existingDietPlan.macros.protein,
      carbs: existingDietPlan.macros.carbs,
      fats: existingDietPlan.macros.fats,
    },
    meals: existingDietPlan.meals,
  } : {
    name: "",
    description: "",
    dailyCalories: 2000,
    macros: {
      protein: 30,
      carbs: 40,
      fats: 30,
    },
    meals: [
      { name: "Breakfast", description: "" }
    ]
  };

  const form = useForm<DietPlanFormValues>({
    resolver: zodResolver(dietPlanFormSchema),
    defaultValues,
  });

  const { fields, append, remove } = form.control._formValues.meals || [];
  
  const addMeal = () => {
    const currentMeals = form.getValues("meals") || [];
    form.setValue("meals", [...currentMeals, { name: "", description: "" }]);
  };

  const removeMeal = (index: number) => {
    const currentMeals = form.getValues("meals") || [];
    if (currentMeals.length > 1) {
      const updatedMeals = [...currentMeals];
      updatedMeals.splice(index, 1);
      form.setValue("meals", updatedMeals);
    } else {
      toast.error("At least one meal is required");
    }
  };

  const onSubmit = (data: DietPlanFormValues) => {
    setIsSubmitting(true);
    
    try {
      const updatedDietPlan: DietPlan = {
        id: existingDietPlan?.id || `diet-${Date.now()}`,
        name: data.name,
        description: data.description,
        dailyCalories: data.dailyCalories,
        macros: data.macros,
        meals: data.meals,
      };
      
      setTimeout(() => {
        toast.success("Diet plan updated successfully");
        onSuccess(updatedDietPlan);
        setIsSubmitting(false);
      }, 500);
    } catch (error) {
      toast.error("Failed to update diet plan");
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Plan Name</FormLabel>
              <FormControl>
                <Input placeholder="Diet plan name" {...field} />
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
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Description of the diet plan..."
                  className="min-h-[80px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="dailyCalories"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Daily Calories</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="Daily calorie target" 
                  {...field} 
                  onChange={(e) => field.onChange(Number(e.target.value))}
                  value={field.value}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <div className="font-medium">Macronutrient Distribution</div>
          <div className="grid grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="macros.protein"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Protein (%)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min="0" 
                      max="100" 
                      {...field} 
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      value={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="macros.carbs"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Carbs (%)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min="0" 
                      max="100" 
                      {...field} 
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      value={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="macros.fats"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fats (%)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min="0" 
                      max="100" 
                      {...field} 
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      value={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormDescription className="text-xs">
            Macronutrient percentages should sum to 100%
          </FormDescription>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="font-medium">Meals</div>
            <Button type="button" variant="outline" size="sm" onClick={addMeal}>
              <Plus className="h-4 w-4 mr-1" /> Add Meal
            </Button>
          </div>

          {form.watch("meals")?.map((meal, index) => (
            <div key={index} className="p-4 border rounded-md relative">
              {form.watch("meals").length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 h-8 w-8 p-0"
                  onClick={() => removeMeal(index)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              )}
              <div className="grid gap-4">
                <FormField
                  control={form.control}
                  name={`meals.${index}.name`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meal Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Breakfast" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`meals.${index}.description`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Meal details..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end space-x-2">
          <Button variant="outline" type="button" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Diet Plan"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EditDietPlanForm;

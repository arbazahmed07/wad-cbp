
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Client, Goal, GoalType, GoalStatus } from "@/types";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
} from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const goalFormSchema = z.object({
  type: z.nativeEnum(GoalType),
  description: z.string().min(1, { message: "Description is required" }),
  targetDate: z.date({
    required_error: "Target date is required",
  }),
  startValue: z.string().optional(),
  targetValue: z.string().optional(),
  unit: z.string().optional(),
});

type GoalFormValues = z.infer<typeof goalFormSchema>;

interface AddGoalFormProps {
  client: Client;
  onSuccess: (newGoal: Goal) => void;
  onCancel: () => void;
}

const AddGoalForm = ({ client, onSuccess, onCancel }: AddGoalFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Default to a date one month from now
  const defaultDate = new Date();
  defaultDate.setMonth(defaultDate.getMonth() + 1);
  
  const form = useForm<GoalFormValues>({
    resolver: zodResolver(goalFormSchema),
    defaultValues: {
      type: GoalType.WEIGHT_LOSS,
      description: "",
      targetDate: defaultDate,
      startValue: "",
      targetValue: "",
      unit: "",
    },
  });

  // Monitor changes to goal type to suggest appropriate units
  const goalType = form.watch("type");

  // Update unit based on goal type
  const suggestUnit = (type: GoalType) => {
    switch(type) {
      case GoalType.WEIGHT_LOSS:
      case GoalType.MUSCLE_GAIN:
        return "kg";
      case GoalType.ENDURANCE:
        return "mins";
      case GoalType.FLEXIBILITY:
        return "cm";
      default:
        return "";
    }
  };

  // Reset fields when goal type changes
  const handleGoalTypeChange = (value: GoalType) => {
    const suggestedUnit = suggestUnit(value);
    form.setValue("unit", suggestedUnit);
  };

  const onSubmit = (data: GoalFormValues) => {
    setIsSubmitting(true);
    
    try {
      // In a real app, we would make an API call here
      const newGoal: Goal = {
        id: `goal-${Date.now()}`,
        clientId: client.id,
        type: data.type,
        description: data.description,
        targetDate: data.targetDate,
        status: GoalStatus.NOT_STARTED,
        progress: 0,
        startValue: data.startValue ? Number(data.startValue) : undefined,
        currentValue: data.startValue ? Number(data.startValue) : undefined,
        targetValue: data.targetValue ? Number(data.targetValue) : undefined,
        unit: data.unit || suggestUnit(data.type),
      };
      
      setTimeout(() => {
        toast.success("Goal added successfully");
        onSuccess(newGoal);
        setIsSubmitting(false);
      }, 500);
    } catch (error) {
      toast.error("Failed to add goal");
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Goal Type</FormLabel>
              <Select 
                onValueChange={(value) => {
                  field.onChange(value);
                  handleGoalTypeChange(value as GoalType);
                }}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a goal type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.values(GoalType).map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                  placeholder="Describe the goal..."
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
          name="targetDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Target Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="startValue"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Value</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Start value" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="targetValue"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Target Value</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Target value" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="unit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Unit</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. kg, cm, mins" {...field} />
                </FormControl>
                <FormDescription>
                  Unit for measuring progress
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end space-x-2">
          <Button variant="outline" type="button" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Adding..." : "Add Goal"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AddGoalForm;

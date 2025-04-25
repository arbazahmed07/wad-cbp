import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Client, CheckIn } from "@/types";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const checkInFormSchema = z.object({
  date: z.date({
    required_error: "A date is required",
  }),
  duration: z.number().min(5, { message: "Duration must be at least 5 minutes" }).max(120, { message: "Duration must not exceed 120 minutes" }),
  notes: z.string().optional(),
});

type CheckInFormValues = z.infer<typeof checkInFormSchema>;

interface ScheduleCheckInFormProps {
  client: Client;
  onSuccess: (newCheckIn: CheckIn) => void;
  onCancel: () => void;
}

const ScheduleCheckInForm = ({ client, onSuccess, onCancel }: ScheduleCheckInFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Default to a date one week from now
  const defaultDate = new Date();
  defaultDate.setDate(defaultDate.getDate() + 7);
  
  const form = useForm<CheckInFormValues>({
    resolver: zodResolver(checkInFormSchema),
    defaultValues: {
      date: defaultDate,
      duration: 30,
      notes: "",
    },
  });

  const onSubmit = (data: CheckInFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Ensure date is a proper Date object
      const checkInDate = new Date(data.date);
      
      // In a real app, we would make an API call here
      const newCheckIn: CheckIn = {
        id: `checkin-${Date.now()}`,
        clientId: client._id || client.id, // Use MongoDB _id if available
        clientName: `${client.firstName} ${client.lastName}`,
        date: checkInDate,
        status: "scheduled",
        notes: data.notes || "",
        duration: data.duration,
      };
      
      setTimeout(() => {
        toast.success("Check-in scheduled successfully");
        onSuccess(newCheckIn);
        setIsSubmitting(false);
      }, 500);
    } catch (error) {
      toast.error("Failed to schedule check-in");
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Check-in Date</FormLabel>
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
        
        <FormField
          control={form.control}
          name="duration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Duration (minutes)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={5}
                  max={120}
                  placeholder="30"
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Any specific topics to cover..."
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          <Button variant="outline" type="button" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Scheduling..." : "Schedule Check-in"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ScheduleCheckInForm;

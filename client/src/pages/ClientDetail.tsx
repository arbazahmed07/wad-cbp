import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { mockClients } from "@/data/mockData";
import { format } from "date-fns";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  User, 
  Mail, 
  Phone, 
  CalendarDays, 
  Ruler, 
  Weight,
  Goal as GoalIcon,
  ChevronLeft,
  Edit,
  FileText,
  Utensils,
  CalendarCheck
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { goalStatusColors, goalTypeColors } from "@/data/mockData";
import ProgressChart from "@/components/ProgressChart";
import EditClientForm from "@/components/EditClientForm";
import ScheduleCheckInForm from "@/components/ScheduleCheckInForm";
import AddGoalForm from "@/components/AddGoalForm";
import EditDietPlanForm from "@/components/EditDietPlanForm";
import { Client, CheckIn, Goal, DietPlan } from "@/types";

import { useQuery } from "@tanstack/react-query";
import { getClient } from "@/api"; // Fixed import path - importing from main API file

const ClientDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [client, setClient] = useState<Client | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const [isEditingClient, setIsEditingClient] = useState(false);
  const [isSchedulingCheckIn, setIsSchedulingCheckIn] = useState(false);
  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [isEditingDietPlan, setIsEditingDietPlan] = useState(false);

  // Use React Query to fetch client data
  const { data: clientData, isLoading: isClientLoading, error: clientError } = useQuery({
    queryKey: ['client', id],
    queryFn: () => getClient(id!),
    enabled: !!id,
  });

  // Update local state when query data changes
  useEffect(() => {
    if (clientData) {
      // Convert string dates to Date objects
      const processedClient = {
        ...clientData,
        dateOfBirth: clientData.dateOfBirth ? new Date(clientData.dateOfBirth) : undefined,
        joinDate: clientData.joinDate ? new Date(clientData.joinDate) : new Date(),
        nextCheckIn: clientData.nextCheckIn ? new Date(clientData.nextCheckIn) : undefined,
        goals: clientData.goals?.map(goal => ({
          ...goal,
          targetDate: goal.targetDate ? new Date(goal.targetDate) : undefined
        })) || [],
        progressEntries: clientData.progressEntries?.map(entry => ({
          ...entry,
          date: new Date(entry.date)
        })) || []
      };
      setClient(processedClient);
      setIsLoading(false);
    }
  }, [clientData]);

  // Handle error from query
  useEffect(() => {
    if (clientError) {
      setError(clientError as Error);
      setIsLoading(false);
    }
  }, [clientError]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <p>Loading client details...</p>
      </div>
    );
  }

  if (error || !client) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <h2 className="text-2xl font-bold mb-2">Client Not Found</h2>
        <p className="text-gray-500 mb-4">The client you're looking for doesn't exist</p>
        <Button asChild>
          <a href="/clients">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Clients
          </a>
        </Button>
      </div>
    );
  }

  const handleUpdateClient = (updatedClient: Client) => {
    setClient(updatedClient);
    setIsEditingClient(false);
  };

  const handleScheduleCheckIn = (newCheckIn: CheckIn) => {
    setClient({
      ...client,
      nextCheckIn: newCheckIn.date
    });
    setIsSchedulingCheckIn(false);
  };

  const handleAddGoal = (newGoal: Goal) => {
    setClient({
      ...client,
      goals: [...client.goals, newGoal]
    });
    setIsAddingGoal(false);
  };

  const handleUpdateDietPlan = (updatedDietPlan: DietPlan) => {
    setClient({
      ...client,
      dietPlan: updatedDietPlan
    });
    setIsEditingDietPlan(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <a href="/clients">
              <ChevronLeft className="h-4 w-4" />
            </a>
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">{client.firstName} {client.lastName}</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsEditingClient(true)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Client
          </Button>
          <Button onClick={() => setIsSchedulingCheckIn(true)}>
            <CalendarCheck className="mr-2 h-4 w-4" />
            Schedule Check-In
          </Button>
        </div>
      </div>

      {/* Client Summary */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Client Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center mb-6">
              <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 text-2xl font-bold mb-4">
                {client.firstName.charAt(0)}{client.lastName.charAt(0)}
              </div>
              <h2 className="text-xl font-semibold">{client.firstName} {client.lastName}</h2>
              <p className="text-gray-500">Member since {format(client.joinDate, "MMM d, yyyy")}</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-gray-400" />
                <span>{client.email}</span>
              </div>

              {client.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span>{client.phone}</span>
                </div>
              )}

              {client.dateOfBirth && (
                <div className="flex items-center gap-3">
                  <CalendarDays className="h-4 w-4 text-gray-400" />
                  <span>
                    {format(new Date(client.dateOfBirth), "MMM d, yyyy")} 
                    ({new Date().getFullYear() - new Date(client.dateOfBirth).getFullYear()} years)
                  </span>
                </div>
              )}

              {client.height && (
                <div className="flex items-center gap-3">
                  <Ruler className="h-4 w-4 text-gray-400" />
                  <span>{client.height} cm</span>
                </div>
              )}

              {client.currentWeight && (
                <div className="flex items-center gap-3">
                  <Weight className="h-4 w-4 text-gray-400" />
                  <span>
                    {client.currentWeight} kg
                    {client.initialWeight && client.initialWeight !== client.currentWeight && (
                      <span className="text-sm text-gray-500 ml-2">
                        (Initial: {client.initialWeight} kg)
                      </span>
                    )}
                  </span>
                </div>
              )}
            </div>

            {client.nextCheckIn && (
              <div className="mt-6 pt-4 border-t">
                <h3 className="font-medium mb-2">Next Check-In</h3>
                <div className="bg-blue-50 text-blue-700 px-4 py-3 rounded-md flex justify-between items-center">
                  <div className="flex items-center">
                    <CalendarCheck className="h-5 w-5 mr-2" />
                    <span className="font-medium">{format(new Date(client.nextCheckIn), "MMM d, yyyy")}</span>
                  </div>
                  <Badge variant="outline">
                    {Math.ceil((new Date(client.nextCheckIn).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days left
                  </Badge>
                </div>
              </div>
            )}

          </CardContent>
        </Card>

        <div className="md:col-span-2 space-y-6">
          {/* Goals */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Goals</CardTitle>
                  <CardDescription>Client's fitness objectives</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={() => setIsAddingGoal(true)}>
                  <GoalIcon className="mr-2 h-4 w-4" />
                  Add Goal
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {client.goals.length > 0 ? (
                <div className="space-y-4">
                  {client.goals.map(goal => (
                    <div key={goal.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <Badge className={goalTypeColors[goal.type]}>
                            {goal.type}
                          </Badge>
                          <h3 className="font-semibold mt-2">{goal.description}</h3>
                        </div>
                        <Badge variant={goal.status === "Completed" ? "default" : "outline"}>
                          {goal.status}
                        </Badge>
                      </div>

                      <div className="mt-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">Progress</span>
                          <span>{goal.progress}%</span>
                        </div>
                        <div className="goal-progress">
                          <div 
                            className={`goal-progress-bar ${goalStatusColors[goal.status]}`} 
                            style={{ width: `${goal.progress}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-3 gap-2 text-sm text-gray-600">
                        {goal.targetDate && (
                          <div>
                            <div className="font-medium">Target Date</div>
                            <div>{format(goal.targetDate, "MMM d, yyyy")}</div>
                          </div>
                        )}

                        {goal.startValue !== undefined && (
                          <div>
                            <div className="font-medium">Starting</div>
                            <div>{goal.startValue} {goal.unit}</div>
                          </div>
                        )}

                        {goal.targetValue !== undefined && (
                          <div>
                            <div className="font-medium">Target</div>
                            <div>{goal.targetValue} {goal.unit}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500">
                  <GoalIcon className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                  <h3 className="text-lg font-medium mb-1">No goals set</h3>
                  <p className="text-sm">Add goals to track this client's progress</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Diet & Workout */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center">
                    <Utensils className="mr-2 h-5 w-5" /> Diet Plan
                  </CardTitle>
                  <Button variant="outline" size="sm" onClick={() => setIsEditingDietPlan(true)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {client.dietPlan ? (
                  <div>
                    <h3 className="font-semibold mb-1">{client.dietPlan.name}</h3>
                    <p className="text-sm text-gray-600 mb-4">{client.dietPlan.description}</p>
                    
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="bg-blue-50 p-3 rounded-md text-center">
                        <div className="text-xs text-gray-500">Calories</div>
                        <div className="font-bold">{client.dietPlan.dailyCalories}</div>
                      </div>
                      <div className="bg-blue-50 p-3 rounded-md text-center">
                        <div className="text-xs text-gray-500">Protein</div>
                        <div className="font-bold">{client.dietPlan.macros.protein}%</div>
                      </div>
                      <div className="bg-blue-50 p-3 rounded-md text-center">
                        <div className="text-xs text-gray-500">Carbs</div>
                        <div className="font-bold">{client.dietPlan.macros.carbs}%</div>
                      </div>
                    </div>
                    
                    <div className="text-sm">
                      {client.dietPlan.meals.map((meal, index) => (
                        <div key={index} className="mb-2 last:mb-0">
                          <div className="font-medium">{meal.name}</div>
                          <div className="text-gray-600">{meal.description}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    <p>No diet plan assigned</p>
                    <Button variant="outline" size="sm" className="mt-2" onClick={() => setIsEditingDietPlan(true)}>
                      Assign Diet Plan
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center">
                    <FileText className="mr-2 h-5 w-5" /> Workout Plan
                  </CardTitle>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {client.workoutPlan ? (
                  <div>
                    <h3 className="font-semibold mb-1">{client.workoutPlan.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{client.workoutPlan.description}</p>
                    <p className="text-sm mb-4">
                      <span className="font-medium">Frequency:</span> {client.workoutPlan.frequency}x weekly
                    </p>
                    
                    <h4 className="font-medium text-sm mb-2">Key Exercises</h4>
                    <div className="space-y-2">
                      {client.workoutPlan.exercises.map((exercise, index) => (
                        <div key={index} className="flex justify-between text-sm border-b pb-1 last:border-0">
                          <div>{exercise.name}</div>
                          <div className="text-gray-600">{exercise.sets} × {exercise.reps}{exercise.weight ? ` @ ${exercise.weight}kg` : ''}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    <p>No workout plan assigned</p>
                    <Button variant="outline" size="sm" className="mt-2">
                      Assign Workout Plan
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Progress Tracking */}
      <Card>
        <CardHeader>
          <CardTitle>Progress Tracking</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="charts" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="charts">Charts</TabsTrigger>
              <TabsTrigger value="entries">Progress Entries</TabsTrigger>
            </TabsList>
            <TabsContent value="charts">
              <div className="grid md:grid-cols-2 gap-6">
                <ProgressChart 
                  entries={client.progressEntries} 
                  metric="weight"
                  title="Weight Progression" 
                  color="#3B82F6"
                />
                <ProgressChart 
                  entries={client.progressEntries} 
                  metric="bodyFat"
                  title="Body Fat %" 
                  color="#10B981"
                />
              </div>
            </TabsContent>
            <TabsContent value="entries">
              <div className="rounded-md border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="py-3 px-4 text-left">Date</th>
                      <th className="py-3 px-4 text-left">Weight</th>
                      <th className="py-3 px-4 text-left">Body Fat</th>
                      <th className="py-3 px-4 text-left hidden md:table-cell">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {client.progressEntries
                      .sort((a, b) => b.date.getTime() - a.date.getTime())
                      .map(entry => (
                      <tr key={entry.id} className="border-b last:border-0">
                        <td className="py-3 px-4">{format(entry.date, "MMM d, yyyy")}</td>
                        <td className="py-3 px-4">{entry.weight} kg</td>
                        <td className="py-3 px-4">{entry.bodyFat}%</td>
                        <td className="py-3 px-4 hidden md:table-cell">{entry.notes}</td>
                      </tr>
                    ))}

                  </tbody>
                </table>
              </div>

              <div className="mt-4 flex justify-end">
                <Button variant="outline">
                  Add Progress Entry
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Edit Client Dialog */}
      <Dialog open={isEditingClient} onOpenChange={setIsEditingClient}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Client</DialogTitle>
            <DialogDescription>Make changes to client information below.</DialogDescription>
          </DialogHeader>
          <EditClientForm
            client={client}
            onSuccess={handleUpdateClient}
            onCancel={() => setIsEditingClient(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Schedule Check-In Dialog */}
      <Dialog open={isSchedulingCheckIn} onOpenChange={setIsSchedulingCheckIn}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Schedule Check-In</DialogTitle>
            <DialogDescription>Set a date for the next check-in with this client.</DialogDescription>
          </DialogHeader>
          <ScheduleCheckInForm
            client={client}
            onSuccess={handleScheduleCheckIn}
            onCancel={() => setIsSchedulingCheckIn(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Add Goal Dialog */}
      <Dialog open={isAddingGoal} onOpenChange={setIsAddingGoal}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Goal</DialogTitle>
            <DialogDescription>Create a new fitness goal for this client.</DialogDescription>
          </DialogHeader>
          <AddGoalForm
            client={client}
            onSuccess={handleAddGoal}
            onCancel={() => setIsAddingGoal(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Diet Plan Dialog */}
      <Dialog open={isEditingDietPlan} onOpenChange={setIsEditingDietPlan}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{client.dietPlan ? "Edit Diet Plan" : "Create Diet Plan"}</DialogTitle>
            <DialogDescription>
              {client.dietPlan ? "Make changes to this client's diet plan." : "Create a new diet plan for this client."}
            </DialogDescription>
          </DialogHeader>
          <EditDietPlanForm
            client={client}
            onSuccess={handleUpdateDietPlan}
            onCancel={() => setIsEditingDietPlan(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClientDetail;

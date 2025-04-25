
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ClientCard from "@/components/ClientCard";
import StatCard from "@/components/StatCard";
import { mockClients } from "@/data/mockData";
import { Users, UserCheck, Clock, Goal } from "lucide-react";
import { format } from "date-fns";

const Dashboard = () => {
  // Calculate some statistics for the dashboard
  const totalClients = mockClients.length;
  
  const activeGoals = mockClients.reduce((count, client) => 
    count + client.goals.filter(goal => goal.status === "In Progress").length, 0);
  
  const upcomingCheckIns = mockClients.filter(client => 
    client.nextCheckIn && client.nextCheckIn >= new Date() && 
    client.nextCheckIn <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  ).length;
  
  const recentProgressUpdates = mockClients.reduce((count, client) => {
    const recentEntries = client.progressEntries.filter(entry => 
      entry.date >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));
    return count + recentEntries.length;
  }, 0);

  // Get next check-ins
  const upcomingCheckInsList = mockClients
    .filter(client => client.nextCheckIn && client.nextCheckIn >= new Date())
    .sort((a, b) => a.nextCheckIn!.getTime() - b.nextCheckIn!.getTime())
    .slice(0, 5);

  // Get recent clients
  const recentClients = [...mockClients]
    .sort((a, b) => b.joinDate.getTime() - a.joinDate.getTime())
    .slice(0, 4);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your client management system.</p>
      </div>

      {/* Stats Section */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Total Clients" 
          value={totalClients}
          icon={<Users className="h-4 w-4" />}
          trend="up"
        />
        <StatCard 
          title="Active Goals" 
          value={activeGoals}
          icon={<Goal className="h-4 w-4" />}
        />
        <StatCard 
          title="Upcoming Check-ins" 
          value={upcomingCheckIns}
          icon={<Clock className="h-4 w-4" />}
          description="Next 7 days"
        />
        <StatCard 
          title="Recent Progress Updates" 
          value={recentProgressUpdates}
          icon={<UserCheck className="h-4 w-4" />}
          description="Last 7 days"
          trend="up"
        />
      </div>

      {/* Recent Clients and Upcoming Check-ins */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-semibold">Recent Clients</h2>
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            {recentClients.map(client => (
              <ClientCard key={client.id} client={client} />
            ))}
          </div>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Check-ins</CardTitle>
              <CardDescription>Next scheduled client reviews</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingCheckInsList.map(client => (
                  <div key={client.id} className="flex justify-between items-center border-b pb-3 last:border-0 last:pb-0">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-100 text-blue-500 rounded-full flex items-center justify-center mr-3">
                        {client.firstName.charAt(0) + client.lastName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium">{client.firstName} {client.lastName}</p>
                        <p className="text-sm text-gray-500">{client.goals[0]?.type || "No goal set"}</p>
                      </div>
                    </div>
                    <div className="text-sm font-medium text-gray-600">
                      {format(client.nextCheckIn!, "MMM d")}
                    </div>
                  </div>
                ))}

                {upcomingCheckInsList.length === 0 && (
                  <p className="text-gray-500 text-center py-4">No upcoming check-ins scheduled</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

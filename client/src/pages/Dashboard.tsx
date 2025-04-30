import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Activity,
  Calendar,
  ClipboardList,
  UserPlus,
  User
} from "lucide-react";
import { Button } from '@/components/ui/button';
import { getDashboardStats, getRecentClients } from '@/api';
import { format } from 'date-fns';
import { getClientId } from '@/utils/idUtils';

export default function Dashboard() {
  // Fetch dashboard stats
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: getDashboardStats
  });

  // Fetch recent clients
  const { data: recentClients, isLoading: clientsLoading } = useQuery({
    queryKey: ['recentClients'],
    queryFn: getRecentClients
  });

  const isLoading = statsLoading || clientsLoading;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your client management system.</p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-[60vh]">
          <p>Loading dashboard data...</p>
        </div>
      ) : (
        <>
          {/* Stats Section */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
                <User className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.totalClients || 0}</div>
                <p className="text-xs text-muted-foreground">Active client roster</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">New Clients</CardTitle>
                <UserPlus className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.newClients || 0}</div>
                <p className="text-xs text-muted-foreground">In the last 30 days</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Upcoming Check-ins</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.upcomingCheckIns?.length || 0}</div>
                <p className="text-xs text-muted-foreground">Scheduled check-ins</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.activityCount || 0}</div>
                <p className="text-xs text-muted-foreground">Updates in the last 7 days</p>
              </CardContent>
            </Card>
          </div>

          {/* Upcoming Check-ins */}
          <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Upcoming Check-ins</CardTitle>
                <CardDescription>Next 5 scheduled client check-ins</CardDescription>
              </CardHeader>
              <CardContent>
                {stats?.upcomingCheckIns && stats.upcomingCheckIns.length > 0 ? (
                  <div className="space-y-4">
                    {stats.upcomingCheckIns.map((checkIn) => (
                      <div key={checkIn._id} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{checkIn.clientId.firstName} {checkIn.clientId.lastName}</p>
                          <p className="text-sm text-muted-foreground">{checkIn.notes || "No notes"}</p>
                        </div>
                        <div className="text-sm text-right">
                          {format(new Date(checkIn.date), "MMM d, yyyy")}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No upcoming check-ins</p>
                )}
              </CardContent>
            </Card>

            {/* Recent Clients */}
            <Card className="col-span-1">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Recent Clients</CardTitle>
                  <CardDescription>New client sign-ups</CardDescription>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <a href="/clients">View All</a>
                </Button>
              </CardHeader>
              <CardContent>
                {recentClients && recentClients.length > 0 ? (
                  <div className="space-y-4">
                    {recentClients.map((client) => (
                      <div key={getClientId(client)} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center">
                            <span className="font-medium text-slate-600">
                              {client.firstName?.[0]}{client.lastName?.[0]}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium">{client.firstName} {client.lastName}</p>
                            <p className="text-sm text-muted-foreground">{client.email}</p>
                          </div>
                        </div>
                        <div className="text-right text-sm">
                          <a 
                            href={`/clients/${getClientId(client)}`} 
                            className="text-blue-500 hover:underline"
                          >
                            View
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No recent clients</p>
                )}
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}

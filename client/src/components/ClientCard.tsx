import { Card, CardContent } from "@/components/ui/card";
import { Client } from "@/types";
import { format } from "date-fns";
import { User } from "lucide-react";
import { Link } from "react-router-dom";

interface ClientCardProps {
  client: Client;
}

const ClientCard = ({ client }: ClientCardProps) => {
  // Calculate progress for primary goal (assuming first goal is primary)
  const primaryGoal = Array.isArray(client.goals) && client.goals.length > 0 ? client.goals[0] : null;
  const progressPercentage = primaryGoal?.progress || 0;
  
  // Use client id
  const clientId = client.id;

  return (
    <Link to={`/clients/${clientId}`}>
      <Card className="hover:shadow-md transition-shadow duration-200">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="client-avatar">
              {client.image ? (
                <img src={client.image} alt={`${client.firstName} ${client.lastName}`} className="w-full h-full object-cover" />
              ) : (
                <User className="h-8 w-8 text-gray-400" />
              )}
            </div>
            
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{client.firstName} {client.lastName}</h3>
              <p className="text-gray-600 text-sm">{client.email}</p>
              
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">
                    {primaryGoal ? primaryGoal.type : "No goals set"}
                  </span>
                  <span className="font-medium">{progressPercentage}%</span>
                </div>
                <div className="goal-progress">
                  <div 
                    className="goal-progress-bar bg-gymspark-primary" 
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="mt-4 flex justify-between text-sm text-gray-500">
                <div>Member since: {format(client.joinDate, "MMM d, yyyy")}</div>
                {client.nextCheckIn && (
                  <div>Next check-in: {format(client.nextCheckIn, "MMM d")}</div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ClientCard;

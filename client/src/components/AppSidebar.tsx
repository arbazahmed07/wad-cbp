
import { 
  Sidebar, 
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader
} from "@/components/ui/sidebar";
import { Link } from "react-router-dom";
import { Users, User, FileText, Utensils, Clock } from "lucide-react";

const AppSidebar = () => {
  // Menu items for the sidebar
  const menuItems = [
    {
      title: "Dashboard",
      url: "/",
      icon: Users
    },
    {
      title: "Clients",
      url: "/clients",
      icon: User
    },
    {
      title: "Diet Plans",
      url: "/diet-plans",
      icon: Utensils
    },
    {
      title: "Workout Plans",
      url: "/workout-plans",
      icon: FileText
    },
    {
      title: "Check-ins",
      url: "/check-ins",
      icon: Clock
    }
  ];

  return (
    <Sidebar>
      <SidebarHeader className="flex items-center justify-center py-3">
        <div className="flex items-center space-x-2">
          <div className="bg-gymspark-primary text-white h-8 w-8 rounded-md flex items-center justify-center font-bold text-xl">
            G
          </div>
          <span className="font-bold text-xl">GymSpark</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url} className="flex items-center">
                      <item.icon className="mr-2 h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;


import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "./AppSidebar";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <div className="h-14 border-b flex items-center px-4 md:px-6 bg-white shadow-sm">
            <SidebarTrigger />
            <div className="ml-4 font-semibold text-lg">GymSpark CRM</div>
          </div>
          <main className="flex-1 p-4 md:p-6 bg-gray-50">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Layout;

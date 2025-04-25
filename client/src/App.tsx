
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Clients from "./pages/Clients";
import ClientDetail from "./pages/ClientDetail";
import DietPlans from "./pages/DietPlans";
import WorkoutPlans from "./pages/WorkoutPlans";
import CheckIns from "./pages/CheckIns";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipPrimitive.Provider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout><Dashboard /></Layout>} />
          <Route path="/clients" element={<Layout><Clients /></Layout>} />
          <Route path="/clients/:id" element={<Layout><ClientDetail /></Layout>} />
          <Route path="/diet-plans" element={<Layout><DietPlans /></Layout>} />
          <Route path="/workout-plans" element={<Layout><WorkoutPlans /></Layout>} />
          <Route path="/check-ins" element={<Layout><CheckIns /></Layout>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipPrimitive.Provider>
  </QueryClientProvider>
);

export default App;

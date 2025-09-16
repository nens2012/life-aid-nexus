import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import PeriodTracker from "./pages/PeriodTracker";
import HealthScanner from "./pages/HealthScanner";
import WellnessPlanner from "./pages/WellnessPlanner";
import DoctorConsultation from "./pages/DoctorConsultation";
import Appointments from "./pages/Appointments";
import NotFound from "./pages/NotFound";
import UserOnboarding from "./components/UserOnboarding";
import ErrorBoundary from "./components/ErrorBoundary";
import { useUserContext } from "./hooks/useUserContext";

const queryClient = new QueryClient();

const AppContent = () => {
  const { isFirstTimeUser } = useUserContext();
  const [showOnboarding, setShowOnboarding] = useState(isFirstTimeUser);

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
  };

  return (
    <>
      <Layout>
        <Routes>
          <Route path="/" element={
            <ErrorBoundary>
              <Dashboard />
            </ErrorBoundary>
          } />
          <Route path="/period-tracker" element={
            <ErrorBoundary>
              <PeriodTracker />
            </ErrorBoundary>
          } />
          <Route path="/health-scanner" element={
            <ErrorBoundary>
              <HealthScanner />
            </ErrorBoundary>
          } />
          <Route path="/planner" element={
            <ErrorBoundary>
              <WellnessPlanner />
            </ErrorBoundary>
          } />
          <Route path="/consultation" element={
            <ErrorBoundary>
              <DoctorConsultation />
            </ErrorBoundary>
          } />
          <Route path="/appointments" element={
            <ErrorBoundary>
              <Appointments />
            </ErrorBoundary>
          } />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
      
      {showOnboarding && (
        <UserOnboarding onComplete={handleOnboardingComplete} />
      )}
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light" storageKey="wellnesswave-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;

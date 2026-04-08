import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { EventProvider } from "@/context/EventContext";
import { RegistrationProvider } from "@/context/RegistrationContext";
import { FeedbackProvider } from "@/context/FeedbackContext";
import Navbar from "@/components/Navbar";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import EventListing from "./pages/EventListing";
import CreateEvent from "./pages/CreateEvent";
import EventDetail from "./pages/EventDetail";
import ManageParticipants from "./pages/ManageParticipants";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <EventProvider>
            <RegistrationProvider>
              <FeedbackProvider>
                <Navbar />
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/events" element={<EventListing />} />
                  <Route path="/events/:id" element={<EventDetail />} />
                  <Route path="/create-event" element={<CreateEvent />} />
                  <Route path="/manage/:id" element={<ManageParticipants />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </FeedbackProvider>
            </RegistrationProvider>
          </EventProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

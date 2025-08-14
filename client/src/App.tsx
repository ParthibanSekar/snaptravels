import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import ModernBackground from "@/components/ui/modern-background";
import Header from "@/components/Header";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Landing from "./pages/landing";
import Home from "./pages/home";
import FlightsPage from "./pages/flights/index";
import FlightSearchResults from "./pages/flights/search";
import ManageBooking from "./pages/flights/manage-booking";
import HotelsPage from "./pages/search/hotels";
import HotelSearchResults from "./pages/hotels/search";
import TrainsPage from "./pages/search/trains";
import TrainSearchResults from "./pages/trains/search";
import BusesPage from "./pages/search/buses";
import BusSearchResults from "./pages/buses/search";
import BookingConfirmation from "./pages/booking/confirmation";
import PassengerDetails from "./pages/booking/passenger-details";
import PaymentPage from "./pages/booking/payment";
import Profile from "./pages/profile";
import TravelGuide from "./pages/travel-guide";
import NotFound from "./pages/not-found";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      <Route path="/" component={isLoading || !isAuthenticated ? Landing : Home} />
      <Route path="/flights" component={FlightsPage} />
      <Route path="/flights/search" component={FlightSearchResults} />
      <Route path="/flights/manage" component={ManageBooking} />
      <Route path="/hotels" component={HotelsPage} />
      <Route path="/hotels/search" component={HotelSearchResults} />
      <Route path="/trains" component={TrainsPage} />
      <Route path="/trains/search" component={TrainSearchResults} />
      <Route path="/buses" component={BusesPage} />
      <Route path="/buses/search" component={BusSearchResults} />
      <Route path="/travel-guide" component={TravelGuide} />
      <Route path="/booking/passenger-details" component={PassengerDetails} />
      <Route path="/booking/payment" component={PaymentPage} />
      <Route path="/booking/confirmation" component={BookingConfirmation} />
      {isAuthenticated && (
        <>
          <Route path="/profile" component={Profile} />
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <div className="theme-container relative min-h-screen">
            <Header />
            <main className="relative z-10">
              <Router />
            </main>
          </div>
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;

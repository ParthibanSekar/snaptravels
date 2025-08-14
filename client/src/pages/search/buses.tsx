import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";

import type { Bus, BusSearch } from "@shared/schema";
import { Bus as BusIcon, Clock, IndianRupee } from "lucide-react";

export default function BusSearch() {
  const [location, navigate] = useLocation();
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  
  const [searchParams, setSearchParams] = useState<BusSearch>({
    from: "",
    to: "",
    journeyDate: "",
    passengers: 1
  });

  const [hasSearched, setHasSearched] = useState(false);

  const searchMutation = useMutation({
    mutationFn: async (search: BusSearch) => {
      const response = await apiRequest("POST", "/api/buses/search", search);
      return response.json();
    },
    onSuccess: (data) => {
      setHasSearched(true);
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Search Failed",
        description: "Failed to search buses. Please try again.",
        variant: "destructive",
      });
    },
  });

  const bookingMutation = useMutation({
    mutationFn: async (busId: string) => {
      const bookingData = {
        travelType: "bus" as const,
        busId,
        passengerDetails: { passengers: searchParams.passengers },
        totalAmount: "800", // This would be calculated based on bus price
        travelDate: new Date(searchParams.journeyDate),
        status: "pending" as const,
      };
      const response = await apiRequest("POST", "/api/bookings", bookingData);
      return response.json();
    },
    onSuccess: (booking) => {
      toast({
        title: "Booking Successful",
        description: "Your bus ticket has been booked successfully!",
      });
      navigate(`/booking/confirmation/${booking.id}`);
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Please Login",
          description: "You need to login to book bus tickets.",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Booking Failed",
        description: "Failed to book bus ticket. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSearch = () => {
    if (!searchParams.from || !searchParams.to || !searchParams.journeyDate) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    searchMutation.mutate(searchParams);
  };

  const handleBook = (busId: string) => {
    if (!isAuthenticated) {
      toast({
        title: "Please Login",
        description: "You need to login to book bus tickets.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
    bookingMutation.mutate(busId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BusIcon className="w-6 h-6 text-snap-orange" />
              Search Buses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="from">From</Label>
                <Input
                  id="from"
                  placeholder="Bangalore"
                  value={searchParams.from}
                  onChange={(e) => setSearchParams({ ...searchParams, from: e.target.value })}
                  data-testid="input-from"
                />
              </div>
              <div>
                <Label htmlFor="to">To</Label>
                <Input
                  id="to"
                  placeholder="Chennai"
                  value={searchParams.to}
                  onChange={(e) => setSearchParams({ ...searchParams, to: e.target.value })}
                  data-testid="input-to"
                />
              </div>
              <div>
                <Label htmlFor="journey">Journey Date</Label>
                <Input
                  id="journey"
                  type="date"
                  value={searchParams.journeyDate}
                  onChange={(e) => setSearchParams({ ...searchParams, journeyDate: e.target.value })}
                  data-testid="input-journey"
                />
              </div>
              <div>
                <Label htmlFor="passengers">Passengers</Label>
                <Select
                  value={searchParams.passengers.toString()}
                  onValueChange={(value) => setSearchParams({ ...searchParams, passengers: parseInt(value) })}
                >
                  <SelectTrigger data-testid="select-passengers">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Passenger</SelectItem>
                    <SelectItem value="2">2 Passengers</SelectItem>
                    <SelectItem value="3">3 Passengers</SelectItem>
                    <SelectItem value="4">4+ Passengers</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="mt-4">
              <Button 
                onClick={handleSearch} 
                className="bg-snap-orange hover:bg-orange-600"
                disabled={searchMutation.isPending}
                data-testid="button-search"
              >
                {searchMutation.isPending ? "Searching..." : "Search Buses"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Search Results */}
        {hasSearched && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Available Buses</h2>
            
            {searchMutation.isPending ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i}>
                    <CardContent className="p-6">
                      <Skeleton className="h-24 w-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : searchMutation.data && searchMutation.data.length > 0 ? (
              <div className="space-y-4">
                {searchMutation.data.map((bus: Bus) => (
                  <Card key={bus.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-6 mb-4">
                            <div>
                              <h3 className="text-lg font-semibold">{bus.operatorName}</h3>
                              <Badge variant="outline" className="mt-1">
                                {bus.busType}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-8">
                              <div className="text-center">
                                <p className="text-lg font-semibold">
                                  {new Date(bus.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                                <p className="text-sm text-gray-600">Departure</p>
                              </div>
                              <div className="flex-1 text-center">
                                <Clock className="w-5 h-5 mx-auto mb-1 text-gray-400" />
                                <p className="text-sm text-gray-600">{Math.floor(bus.duration / 60)}h {bus.duration % 60}m</p>
                              </div>
                              <div className="text-center">
                                <p className="text-lg font-semibold">
                                  {new Date(bus.arrivalTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                                <p className="text-sm text-gray-600">Arrival</p>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-600">{bus.availableSeats} seats available</span>
                            <span className="text-sm text-gray-600">Total seats: {bus.totalSeats}</span>
                          </div>
                        </div>
                        <div className="text-right ml-6">
                          <div className="flex items-center justify-end gap-1 mb-2">
                            <IndianRupee className="w-5 h-5" />
                            <span className="text-2xl font-bold text-snap-orange">
                              {bus.price}
                            </span>
                          </div>
                          <Button
                            onClick={() => handleBook(bus.id)}
                            className="bg-snap-blue hover:bg-blue-700"
                            disabled={bookingMutation.isPending}
                            data-testid={`button-book-${bus.id}`}
                          >
                            {bookingMutation.isPending ? "Booking..." : "Book Now"}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-gray-600">No buses found for your search criteria.</p>
                  <p className="text-sm text-gray-500 mt-2">Try adjusting your search parameters.</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

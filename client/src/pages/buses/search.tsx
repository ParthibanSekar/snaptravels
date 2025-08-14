import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, ArrowRight, User, Calendar, Bus } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

interface BusService {
  id: string;
  operatorName: string;
  busType: string;
  fromDestinationId: string;
  toDestinationId: string;
  departureTime: string;
  arrivalTime: string;
  duration: number;
  price: string;
  availableSeats: number;
  totalSeats: number;
  createdAt: string;
}

interface SearchParams {
  from: string;
  to: string;
  journeyDate: string;
  passengers: number;
}

export default function BusSearchResults() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { theme } = useTheme();
  const [buses, setBuses] = useState<BusService[]>([]);
  const [searchParams, setSearchParams] = useState<SearchParams | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const from = urlParams.get('from');
    const to = urlParams.get('to');
    const journeyDate = urlParams.get('journeyDate');
    const passengers = parseInt(urlParams.get('passengers') || '1');

    if (from && to && journeyDate) {
      const params = { from, to, journeyDate, passengers };
      setSearchParams(params);
      searchBuses(params);
    } else {
      setIsLoading(false);
    }
  }, []);

  const searchMutation = useMutation({
    mutationFn: async (params: SearchParams) => {
      const response = await apiRequest("POST", "/api/buses/search", params);
      return response.json();
    },
    onSuccess: (data) => {
      setBuses(data);
      setIsLoading(false);
    },
    onError: (error) => {
      console.error("Bus search error:", error);
      toast({
        title: "Search Failed",
        description: "Unable to search buses. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    },
  });

  const searchBuses = (params: SearchParams) => {
    setIsLoading(true);
    searchMutation.mutate(params);
  };

  const handleBookBus = (bus: BusService) => {
    const bookingParams = new URLSearchParams({
      type: 'bus',
      busId: bus.id,
      operatorName: bus.operatorName,
      busType: bus.busType,
      from: searchParams?.from || '',
      to: searchParams?.to || '',
      journeyDate: searchParams?.journeyDate || '',
      passengers: searchParams?.passengers.toString() || '1',
      departureTime: bus.departureTime,
      arrivalTime: bus.arrivalTime,
      price: bus.price,
    });
    setLocation(`/booking/passenger-details?${bookingParams.toString()}`);
  };

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getBusTypeColor = (busType: string) => {
    const typeColors: { [key: string]: string } = {
      'AC': 'bg-blue-100 text-blue-800',
      'Non-AC': 'bg-gray-100 text-gray-800',
      'Sleeper': 'bg-purple-100 text-purple-800',
      'Semi-Sleeper': 'bg-green-100 text-green-800',
      'Luxury': 'bg-yellow-100 text-yellow-800'
    };
    return typeColors[busType] || 'bg-gray-100 text-gray-800';
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <div className="space-y-2">
                    <div className="h-5 bg-gray-200 rounded w-32"></div>
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                  </div>
                  <div className="h-8 bg-gray-200 rounded w-20"></div>
                  <div className="h-10 bg-gray-200 rounded w-24"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!searchParams) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">No search parameters found</h2>
          <p className="text-gray-600 mb-4">Please perform a bus search to see results.</p>
          <Button onClick={() => setLocation('/')} data-testid="button-home">
            Go to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search Summary */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2" data-testid="text-search-title">
          Buses from {searchParams.from} to {searchParams.to}
        </h1>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span data-testid="text-search-date">{formatDate(searchParams.journeyDate)}</span>
          </div>
          <div className="flex items-center gap-1">
            <User className="h-4 w-4" />
            <span data-testid="text-passengers-count">{searchParams.passengers} Passengers</span>
          </div>
        </div>
      </div>

      {/* Results */}
      {buses.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold mb-2">No buses found</h3>
          <p className="text-gray-600 mb-4">Try adjusting your search criteria or dates.</p>
          <Button onClick={() => setLocation('/')} data-testid="button-new-search">
            New Search
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {buses.map((bus) => (
            <Card key={bus.id} className={`transition-shadow hover:shadow-lg ${
              theme === 'future' ? 'bg-black/40 backdrop-blur-xl border-purple-500/30' : ''
            }`} data-testid={`card-bus-${bus.id}`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  {/* Bus Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Bus className="h-5 w-5 text-gray-600" />
                      <h3 className="text-lg font-bold" data-testid={`text-operator-name-${bus.id}`}>
                        {bus.operatorName}
                      </h3>
                      <Badge className={getBusTypeColor(bus.busType)} data-testid={`badge-bus-type-${bus.id}`}>
                        {bus.busType}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600">
                      <span data-testid={`text-total-seats-${bus.id}`}>Total: {bus.totalSeats} seats</span>
                    </div>
                  </div>

                  {/* Time and Route */}
                  <div className="flex items-center gap-6 flex-1 justify-center">
                    <div className="text-center">
                      <div className="text-2xl font-bold" data-testid={`text-departure-time-${bus.id}`}>
                        {formatTime(bus.departureTime)}
                      </div>
                      <div className="text-sm text-gray-600" data-testid={`text-from-city-${bus.id}`}>
                        {searchParams.from}
                      </div>
                    </div>

                    <div className="flex flex-col items-center gap-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="h-4 w-4" />
                        <span data-testid={`text-duration-${bus.id}`}>{formatDuration(bus.duration)}</span>
                      </div>
                      <ArrowRight className="h-5 w-5 text-gray-400" />
                    </div>

                    <div className="text-center">
                      <div className="text-2xl font-bold" data-testid={`text-arrival-time-${bus.id}`}>
                        {formatTime(bus.arrivalTime)}
                      </div>
                      <div className="text-sm text-gray-600" data-testid={`text-to-city-${bus.id}`}>
                        {searchParams.to}
                      </div>
                    </div>
                  </div>

                  {/* Price and Booking */}
                  <div className="text-right flex-1">
                    <div className="text-2xl font-bold mb-2" data-testid={`text-price-${bus.id}`}>
                      ₹{parseInt(bus.price).toLocaleString('en-IN')}
                    </div>
                    <div className="text-sm text-gray-600 mb-3">
                      <span className={bus.availableSeats > 5 ? "text-green-600" : "text-amber-600"}>
                        {bus.availableSeats > 0 ? `${bus.availableSeats} seats available` : 'Sold out'}
                      </span>
                    </div>
                    <Button 
                      onClick={() => handleBookBus(bus)}
                      className="bg-orange-600 hover:bg-orange-700 text-white px-8"
                      disabled={bus.availableSeats === 0}
                      data-testid={`button-book-bus-${bus.id}`}
                    >
                      {bus.availableSeats > 0 ? 'Book Now' : 'Sold Out'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
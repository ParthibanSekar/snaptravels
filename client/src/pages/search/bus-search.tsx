import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { MapPin, Clock, Calendar, Users, ArrowRight, Bus, Zap, Wifi, Car } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface BusResult {
  id: string;
  operatorName: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
  availableSeats: number;
  totalSeats: number;
  busType: string;
  durationMinutes: number;
  fromDestination: {
    name: string;
    city: string;
    state: string;
  };
  toDestination: {
    name: string;
    city: string;
    state: string;
  };
}

interface SearchParams {
  from?: string;
  to?: string;
  date?: string;
  passengers?: string;
}

export default function BusSearch() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useState<SearchParams>({});
  const [searchEnabled, setSearchEnabled] = useState(false);

  // Parse URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const params: SearchParams = {
      from: urlParams.get('from') || '',
      to: urlParams.get('to') || '',
      date: urlParams.get('date') || '',
      passengers: urlParams.get('passengers') || '1'
    };
    
    console.log("=== BUS SEARCH DEBUG ===");
    console.log("URL params:", params);
    
    setSearchParams(params);
    
    // Enable search if we have basic required parameters
    if (params.from && params.to && params.date) {
      setSearchEnabled(true);
      console.log("Search enabled:", true);
    }
  }, []);

  // Bus search query
  const { data: buses = [], isLoading, error } = useQuery({
    queryKey: ["/api/buses/search", searchParams],
    queryFn: async () => {
      if (!searchEnabled) return [];
      
      const requestBody = {
        from: searchParams.from,
        to: searchParams.to,
        departureDate: searchParams.date,
        passengers: parseInt(searchParams.passengers || '1')
      };
      
      console.log("Request body:", requestBody);
      
      const response = await apiRequest("POST", "/api/buses/search", requestBody);
      console.log("Bus search SUCCESS! Results count:", response.length);
      if (response.length > 0) {
        console.log("First bus sample:", response[0]);
      }
      return response as BusResult[];
    },
    enabled: searchEnabled
  });

  const bookingMutation = useMutation({
    mutationFn: async (bus: BusResult) => {
      return apiRequest("POST", "/api/bookings/bus/create", {
        bus,
        date: searchParams.date,
        passengers: parseInt(searchParams.passengers || '1')
      });
    },
    onSuccess: (data: any) => {
      toast({
        title: "Booking Initiated",
        description: "Redirecting to checkout...",
      });
      setLocation(`/booking/bus/${data.bookingId}`);
    },
    onError: (error: any) => {
      toast({
        title: "Booking Failed",
        description: error.message || "Failed to initiate booking",
        variant: "destructive",
      });
    },
  });

  const handleBookNow = (bus: BusResult) => {
    bookingMutation.mutate(bus);
  };

  const formatTime = (dateTimeString: string) => {
    return new Date(dateTimeString).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getBusTypeColor = (busType: string) => {
    const typeMap: { [key: string]: string } = {
      'AC Sleeper': 'bg-blue-500/20 text-blue-400',
      'AC Semi-Sleeper': 'bg-green-500/20 text-green-400',
      'AC Seater': 'bg-purple-500/20 text-purple-400',
      'Non-AC Sleeper': 'bg-gray-500/20 text-gray-400',
      'Non-AC Seater': 'bg-orange-500/20 text-orange-400'
    };
    return typeMap[busType] || 'bg-gray-500/20 text-gray-400';
  };

  const getBusTypeIcon = (busType: string) => {
    if (busType.includes('AC')) {
      return <Zap className="w-4 h-4" />;
    }
    return <Bus className="w-4 h-4" />;
  };

  if (!searchEnabled) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">No Search Parameters</h1>
          <p className="text-white/70 mb-6">Please start a bus search from the home page.</p>
          <Link href="/">
            <Button className="modern-button">Go to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-white/70">Searching for buses...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Search Error</h1>
          <p className="text-white/70 mb-6">Failed to search buses. Please try again.</p>
          <Link href="/">
            <Button className="modern-button">Go Back</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Search Summary */}
        <div className="glass p-6 rounded-2xl mb-8">
          <div className="flex flex-wrap items-center gap-4 text-white">
            <div className="flex items-center gap-2">
              <Bus className="w-5 h-5 text-cyan-400" />
              <span className="font-medium">{searchParams.from} → {searchParams.to}</span>
            </div>
            <Separator orientation="vertical" className="h-6" />
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-400" />
              <span>{searchParams.date}</span>
            </div>
            <Separator orientation="vertical" className="h-6" />
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-400" />
              <span>{searchParams.passengers} passenger{parseInt(searchParams.passengers || '1') > 1 ? 's' : ''}</span>
            </div>
          </div>
        </div>

        {/* Results Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="heading-lg text-white">
            {buses.length} Buses Found
          </h1>
          <Link href="/">
            <Button variant="outline" className="glass">
              Modify Search
            </Button>
          </Link>
        </div>

        {/* Bus Results */}
        <div className="space-y-4">
          {buses.map((bus: BusResult) => (
            <Card key={bus.id} className="glass hover:bg-white/10 transition-all duration-300 group">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                  {/* Bus Info */}
                  <div className="flex-1">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Operator Details */}
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 p-2 rounded-lg">
                            <Bus className="w-6 h-6 text-cyan-400" />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">
                              {bus.operatorName}
                            </h3>
                          </div>
                        </div>
                        <Badge className={`${getBusTypeColor(bus.busType)} border-0`}>
                          <div className="flex items-center gap-1">
                            {getBusTypeIcon(bus.busType)}
                            {bus.busType}
                          </div>
                        </Badge>
                      </div>

                      {/* Route & Timing */}
                      <div>
                        <div className="space-y-3">
                          {/* Departure */}
                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <div className="text-2xl font-bold text-white">
                                {formatTime(bus.departureTime)}
                              </div>
                              <div className="text-sm text-gray-400">
                                {bus.fromDestination.city}
                              </div>
                            </div>
                            <ArrowRight className="w-5 h-5 text-gray-400" />
                            <div>
                              <div className="text-2xl font-bold text-white">
                                {formatTime(bus.arrivalTime)}
                              </div>
                              <div className="text-sm text-gray-400">
                                {bus.toDestination.city}
                              </div>
                            </div>
                          </div>
                          {/* Duration */}
                          <div className="flex items-center gap-2 text-sm text-gray-400">
                            <Clock className="w-4 h-4" />
                            <span>{formatDuration(bus.durationMinutes)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Seats & Pricing */}
                      <div className="lg:text-right">
                        <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 p-4 rounded-xl border border-cyan-500/20">
                          <div className="mb-3">
                            <div className="text-2xl font-bold text-white">
                              ₹{bus.price.toLocaleString()}
                            </div>
                            <div className="text-sm text-gray-400">
                              per person
                            </div>
                          </div>
                          <div className="text-sm text-gray-400 mb-4">
                            <span className="text-emerald-400">{bus.availableSeats}</span>/{bus.totalSeats} seats available
                          </div>
                          <Button 
                            className="w-full modern-button"
                            onClick={() => handleBookNow(bus)}
                            disabled={bookingMutation.isPending}
                            data-testid={`button-book-bus-${bus.id}`}
                          >
                            {bookingMutation.isPending ? (
                              <div className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                Booking...
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                Book Now
                                <ArrowRight className="w-4 h-4" />
                              </div>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {buses.length === 0 && (
          <div className="text-center py-12">
            <div className="glass p-8 rounded-2xl max-w-md mx-auto">
              <h3 className="text-xl font-bold text-white mb-3">No Buses Found</h3>
              <p className="text-gray-400 mb-6">
                No buses available for your search criteria. Try adjusting your dates or destinations.
              </p>
              <Link href="/">
                <Button className="modern-button">
                  Search Again
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
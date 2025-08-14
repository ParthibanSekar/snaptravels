import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { MapPin, Clock, Calendar, Users, ArrowRight, Train, Zap, Wifi } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface TrainResult {
  id: string;
  trainNumber: string;
  trainName: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
  availableSeats: number;
  seatClass: string;
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
  class?: string;
}

export default function TrainSearch() {
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
      passengers: urlParams.get('passengers') || '1',
      class: urlParams.get('class') || 'sleeper'
    };
    
    console.log("=== TRAIN SEARCH DEBUG ===");
    console.log("URL params:", params);
    
    setSearchParams(params);
    
    // Enable search if we have basic required parameters
    if (params.from && params.to && params.date) {
      setSearchEnabled(true);
      console.log("Search enabled:", true);
    }
  }, []);

  // Train search query
  const { data: trains = [], isLoading, error } = useQuery({
    queryKey: ["/api/trains/search", searchParams],
    queryFn: async () => {
      if (!searchEnabled) return [];
      
      const requestBody = {
        from: searchParams.from,
        to: searchParams.to,
        departureDate: searchParams.date,
        passengers: parseInt(searchParams.passengers || '1'),
        seatClass: searchParams.class || 'sleeper'
      };
      
      console.log("Request body:", requestBody);
      
      const response = await apiRequest("POST", "/api/trains/search", requestBody);
      console.log("Train search SUCCESS! Results count:", response.length);
      if (response.length > 0) {
        console.log("First train sample:", response[0]);
      }
      return response as TrainResult[];
    },
    enabled: searchEnabled
  });

  const bookingMutation = useMutation({
    mutationFn: async (train: TrainResult) => {
      return apiRequest("POST", "/api/bookings/train/create", {
        train,
        date: searchParams.date,
        passengers: parseInt(searchParams.passengers || '1'),
        seatClass: searchParams.class
      });
    },
    onSuccess: (data: any) => {
      toast({
        title: "Booking Initiated",
        description: "Redirecting to checkout...",
      });
      setLocation(`/booking/train/${data.bookingId}`);
    },
    onError: (error: any) => {
      toast({
        title: "Booking Failed",
        description: error.message || "Failed to initiate booking",
        variant: "destructive",
      });
    },
  });

  const handleBookNow = (train: TrainResult) => {
    bookingMutation.mutate(train);
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

  const getSeatClassDisplay = (seatClass: string) => {
    const classMap: { [key: string]: { name: string; color: string } } = {
      'sleeper': { name: 'Sleeper (SL)', color: 'bg-blue-500/20 text-blue-400' },
      'ac3': { name: 'AC 3 Tier', color: 'bg-green-500/20 text-green-400' },
      'ac2': { name: 'AC 2 Tier', color: 'bg-purple-500/20 text-purple-400' },
      'ac1': { name: 'AC 1st Class', color: 'bg-amber-500/20 text-amber-400' },
      'economy': { name: 'Economy', color: 'bg-gray-500/20 text-gray-400' },
      'business': { name: 'Business', color: 'bg-cyan-500/20 text-cyan-400' }
    };
    return classMap[seatClass] || { name: seatClass, color: 'bg-gray-500/20 text-gray-400' };
  };

  if (!searchEnabled) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">No Search Parameters</h1>
          <p className="text-white/70 mb-6">Please start a train search from the home page.</p>
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
          <p className="text-white/70">Searching for trains...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Search Error</h1>
          <p className="text-white/70 mb-6">Failed to search trains. Please try again.</p>
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
              <Train className="w-5 h-5 text-cyan-400" />
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
            <Separator orientation="vertical" className="h-6" />
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-emerald-400" />
              <span>{getSeatClassDisplay(searchParams.class || 'sleeper').name}</span>
            </div>
          </div>
        </div>

        {/* Results Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="heading-lg text-white">
            {trains.length} Trains Found
          </h1>
          <Link href="/">
            <Button variant="outline" className="glass">
              Modify Search
            </Button>
          </Link>
        </div>

        {/* Train Results */}
        <div className="space-y-4">
          {trains.map((train: TrainResult) => {
            const seatClassInfo = getSeatClassDisplay(train.seatClass);
            return (
              <Card key={train.id} className="glass hover:bg-white/10 transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                    {/* Train Info */}
                    <div className="flex-1">
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Train Details */}
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 p-2 rounded-lg">
                              <Train className="w-6 h-6 text-cyan-400" />
                            </div>
                            <div>
                              <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">
                                {train.trainName}
                              </h3>
                              <p className="text-sm text-gray-400">#{train.trainNumber}</p>
                            </div>
                          </div>
                          <Badge className={`${seatClassInfo.color} border-0`}>
                            {seatClassInfo.name}
                          </Badge>
                        </div>

                        {/* Route & Timing */}
                        <div>
                          <div className="space-y-3">
                            {/* Departure */}
                            <div className="flex items-center gap-3">
                              <div className="text-right">
                                <div className="text-2xl font-bold text-white">
                                  {formatTime(train.departureTime)}
                                </div>
                                <div className="text-sm text-gray-400">
                                  {train.fromDestination.city}
                                </div>
                              </div>
                              <ArrowRight className="w-5 h-5 text-gray-400" />
                              <div>
                                <div className="text-2xl font-bold text-white">
                                  {formatTime(train.arrivalTime)}
                                </div>
                                <div className="text-sm text-gray-400">
                                  {train.toDestination.city}
                                </div>
                              </div>
                            </div>
                            {/* Duration */}
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                              <Clock className="w-4 h-4" />
                              <span>{formatDuration(train.durationMinutes)}</span>
                            </div>
                          </div>
                        </div>

                        {/* Seats & Pricing */}
                        <div className="lg:text-right">
                          <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 p-4 rounded-xl border border-cyan-500/20">
                            <div className="mb-3">
                              <div className="text-2xl font-bold text-white">
                                ₹{train.price.toLocaleString()}
                              </div>
                              <div className="text-sm text-gray-400">
                                per person
                              </div>
                            </div>
                            <div className="text-sm text-gray-400 mb-4">
                              <span className="text-emerald-400">{train.availableSeats}</span> seats available
                            </div>
                            <Button 
                              className="w-full modern-button"
                              onClick={() => handleBookNow(train)}
                              disabled={bookingMutation.isPending}
                              data-testid={`button-book-train-${train.id}`}
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
            );
          })}
        </div>

        {/* No Results */}
        {trains.length === 0 && (
          <div className="text-center py-12">
            <div className="glass p-8 rounded-2xl max-w-md mx-auto">
              <h3 className="text-xl font-bold text-white mb-3">No Trains Found</h3>
              <p className="text-gray-400 mb-6">
                No trains available for your search criteria. Try adjusting your dates or destinations.
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
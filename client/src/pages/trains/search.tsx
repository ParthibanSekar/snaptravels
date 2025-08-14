import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, ArrowRight, User, Calendar } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

interface Train {
  id: string;
  trainNumber: string;
  trainName: string;
  fromDestinationId: string;
  toDestinationId: string;
  departureTime: string;
  arrivalTime: string;
  duration: number;
  price: string;
  seatClass: string;
  availableSeats: number;
  createdAt: string;
}

interface SearchParams {
  from: string;
  to: string;
  journeyDate: string;
  seatClass: string;
}

export default function TrainSearchResults() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { theme } = useTheme();
  const [trains, setTrains] = useState<Train[]>([]);
  const [searchParams, setSearchParams] = useState<SearchParams | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const from = urlParams.get('from');
    const to = urlParams.get('to');
    const journeyDate = urlParams.get('journeyDate');
    const seatClass = urlParams.get('seatClass') || 'sleeper';

    if (from && to && journeyDate) {
      const params = { from, to, journeyDate, seatClass };
      setSearchParams(params);
      searchTrains(params);
    } else {
      setIsLoading(false);
    }
  }, []);

  const searchMutation = useMutation({
    mutationFn: async (params: SearchParams) => {
      const response = await apiRequest("POST", "/api/trains/search", params);
      return response.json();
    },
    onSuccess: (data) => {
      setTrains(data);
      setIsLoading(false);
    },
    onError: (error) => {
      console.error("Train search error:", error);
      toast({
        title: "Search Failed",
        description: "Unable to search trains. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    },
  });

  const searchTrains = (params: SearchParams) => {
    setIsLoading(true);
    searchMutation.mutate(params);
  };

  const handleBookTrain = (train: Train) => {
    const bookingParams = new URLSearchParams({
      type: 'train',
      trainId: train.id,
      trainNumber: train.trainNumber,
      trainName: train.trainName,
      from: searchParams?.from || '',
      to: searchParams?.to || '',
      journeyDate: searchParams?.journeyDate || '',
      seatClass: train.seatClass,
      departureTime: train.departureTime,
      arrivalTime: train.arrivalTime,
      price: train.price,
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

  const getSeatClassLabel = (seatClass: string) => {
    const classLabels: { [key: string]: string } = {
      'sleeper': 'Sleeper',
      'ac3': '3A',
      'ac2': '2A',
      'ac1': '1A'
    };
    return classLabels[seatClass] || seatClass;
  };

  const getSeatClassColor = (seatClass: string) => {
    const classColors: { [key: string]: string } = {
      'sleeper': 'bg-gray-100 text-gray-800',
      'ac3': 'bg-blue-100 text-blue-800',
      'ac2': 'bg-green-100 text-green-800',
      'ac1': 'bg-purple-100 text-purple-800'
    };
    return classColors[seatClass] || 'bg-gray-100 text-gray-800';
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
          <p className="text-gray-600 mb-4">Please perform a train search to see results.</p>
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
          Trains from {searchParams.from} to {searchParams.to}
        </h1>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span data-testid="text-search-date">{formatDate(searchParams.journeyDate)}</span>
          </div>
          <div className="flex items-center gap-1">
            <User className="h-4 w-4" />
            <span data-testid="text-seat-class">{getSeatClassLabel(searchParams.seatClass)}</span>
          </div>
        </div>
      </div>

      {/* Results */}
      {trains.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold mb-2">No trains found</h3>
          <p className="text-gray-600 mb-4">Try adjusting your search criteria or dates.</p>
          <Button onClick={() => setLocation('/')} data-testid="button-new-search">
            New Search
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {trains.map((train) => (
            <Card key={train.id} className={`transition-shadow hover:shadow-lg ${
              theme === 'future' ? 'bg-black/40 backdrop-blur-xl border-purple-500/30' : ''
            }`} data-testid={`card-train-${train.id}`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  {/* Train Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold" data-testid={`text-train-number-${train.id}`}>
                        {train.trainNumber}
                      </h3>
                      <Badge className={getSeatClassColor(train.seatClass)} data-testid={`badge-class-${train.id}`}>
                        {getSeatClassLabel(train.seatClass)}
                      </Badge>
                    </div>
                    <p className="text-gray-600 mb-3" data-testid={`text-train-name-${train.id}`}>
                      {train.trainName}
                    </p>
                  </div>

                  {/* Time and Route */}
                  <div className="flex items-center gap-6 flex-1 justify-center">
                    <div className="text-center">
                      <div className="text-2xl font-bold" data-testid={`text-departure-time-${train.id}`}>
                        {formatTime(train.departureTime)}
                      </div>
                      <div className="text-sm text-gray-600" data-testid={`text-from-city-${train.id}`}>
                        {searchParams.from}
                      </div>
                    </div>

                    <div className="flex flex-col items-center gap-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="h-4 w-4" />
                        <span data-testid={`text-duration-${train.id}`}>{formatDuration(train.duration)}</span>
                      </div>
                      <ArrowRight className="h-5 w-5 text-gray-400" />
                    </div>

                    <div className="text-center">
                      <div className="text-2xl font-bold" data-testid={`text-arrival-time-${train.id}`}>
                        {formatTime(train.arrivalTime)}
                      </div>
                      <div className="text-sm text-gray-600" data-testid={`text-to-city-${train.id}`}>
                        {searchParams.to}
                      </div>
                    </div>
                  </div>

                  {/* Price and Booking */}
                  <div className="text-right flex-1">
                    <div className="text-2xl font-bold mb-2" data-testid={`text-price-${train.id}`}>
                      ₹{parseInt(train.price).toLocaleString('en-IN')}
                    </div>
                    <div className="text-sm text-gray-600 mb-3">
                      <span className={train.availableSeats > 10 ? "text-green-600" : "text-amber-600"}>
                        {train.availableSeats > 0 ? `${train.availableSeats} seats available` : 'Waitlist'}
                      </span>
                    </div>
                    <Button 
                      onClick={() => handleBookTrain(train)}
                      className="bg-green-600 hover:bg-green-700 text-white px-8"
                      disabled={train.availableSeats === 0}
                      data-testid={`button-book-train-${train.id}`}
                    >
                      {train.availableSeats > 0 ? 'Book Now' : 'Join Waitlist'}
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
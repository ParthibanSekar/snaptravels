import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Plane, Clock, MapPin, Calendar, Users, Star, Filter, ArrowRight, ArrowLeft } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface FlightResult {
  id: string;
  flightNumber: string;
  airline: {
    name: string;
    code: string;
    logoUrl?: string;
  };
  fromDestination: {
    name: string;
    city: string;
  };
  toDestination: {
    name: string;
    city: string;
  };
  departureTime: string;
  arrivalTime: string;
  price: string;
  availableSeats: number;
  duration: number;
  seatClass: string;
}

export default function FlightSearchResults() {
  const [location, setLocation] = useLocation();
  const { isModernTheme } = useTheme();
  
  // Use window.location.search to get query parameters since wouter's location doesn't include them
  const searchParams = new URLSearchParams(window.location.search);
  
  const from = searchParams.get('from') || '';
  const to = searchParams.get('to') || '';
  const date = searchParams.get('date') || '';
  const passengers = searchParams.get('passengers') || '1';
  
  console.log('=== URL PARSING DEBUG ===');
  console.log('Wouter location:', location);
  console.log('Window location search:', window.location.search);
  console.log('Parsed search params:', { from, to, date, passengers });

  // Force a valid date if none provided
  const searchDate = date || '2025-08-10';
  const [sortBy, setSortBy] = useState('price');
  const [filterBy, setFilterBy] = useState('all');

  const { data: flights = [], isLoading, error } = useQuery({
    queryKey: ['/api/flights/search', { from, to, date: searchDate, passengers }],
    queryFn: async () => {
      console.log('=== FLIGHT SEARCH DEBUG ===');
      console.log('URL params:', { from, to, date: searchDate, passengers });
      console.log('Search enabled:', !!(from && to && searchDate));
      
      const requestBody = {
        from,
        to,
        departureDate: searchDate,
        passengers: parseInt(passengers),
        seatClass: 'economy'
      };
      console.log('Request body:', requestBody);
      
      try {
        const response = await apiRequest('POST', '/api/flights/search', requestBody);
        const data = await response.json() as FlightResult[];
        console.log('Flight search SUCCESS! Results count:', data.length);
        console.log('First flight sample:', data[0]);
        return data;
      } catch (err) {
        console.error('Flight search ERROR:', err);
        throw err;
      }
    },
    enabled: !!(from && to && searchDate),
  });

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString('en-IN', {
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

  const handleBookNow = (flight: FlightResult) => {
    console.log('Book Now clicked for flight:', flight.id);
    
    // Store flight details in sessionStorage for the booking flow
    const flightData = {
      ...flight,
      searchParams: { from, to, date: searchDate, passengers }
    };
    
    console.log('Storing flight data:', flightData);
    sessionStorage.setItem('selectedFlight', JSON.stringify(flightData));
    
    // Navigate to booking page
    console.log('Navigating to passenger details...');
    setLocation('/booking/passenger-details');
  };

  if (!from || !to) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="container-main py-8">
          <div className="booking-card text-center">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Plane className="w-10 h-10 text-blue-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Flight Search</h1>
            <p className="text-gray-600 mb-8">Please provide search parameters to find flights</p>
            <button 
              onClick={() => window.history.back()}
              className="booking-button"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Search
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("min-h-screen pt-16", isModernTheme ? "bg-gradient-modern" : "bg-gray-50")}>
      <div className="container-main py-6">
        {/* Header */}
        <div className={cn("booking-card mb-6", isModernTheme && "search-form")}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setLocation('/')}
                className={cn("booking-button-secondary flex items-center", isModernTheme && "btn-secondary")}
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Modify Search
              </button>
              <div>
                <h1 className={cn("text-2xl font-bold mb-1", isModernTheme ? "text-white" : "text-gray-900")}>
                  {from} → {to}
                </h1>
                <div className={cn("flex items-center space-x-4 text-sm", isModernTheme ? "text-purple-300" : "text-gray-600")}>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    {new Date(searchDate).toLocaleDateString('en-IN', { 
                      weekday: 'short',
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </div>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-2" />
                    {passengers} Passenger{passengers !== '1' ? 's' : ''}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <p className="text-gray-600 text-sm">Found</p>
              <p className="text-2xl font-bold text-gray-900">{flights.length} Flights</p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap justify-between items-center p-4 bg-gray-50 rounded-lg border">
            <div className="flex items-center space-x-4">
              <Filter className="w-5 h-5 text-gray-600" />
              <span className="text-gray-700 font-medium">Sort by:</span>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="modern-input-small"
              >
                <option value="price">Price: Low to High</option>
                <option value="duration">Duration</option>
                <option value="departure">Departure Time</option>
              </select>
            </div>
            <div className="text-gray-600 text-sm">
              {flights.length > 0 ? `${flights.length} flights found` : 'Searching...'}
            </div>
          </div>
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="booking-card animate-pulse">
                <div className="bg-gray-200 h-32 rounded-lg"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="booking-card text-center py-12">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Plane className="w-10 h-10 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Search Error</h2>
            <p className="text-gray-600 mb-8">
              Unable to search flights. Please check your connection and try again.
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="booking-button"
            >
              Try Again
            </button>
          </div>
        ) : flights.length === 0 ? (
          <div className="booking-card text-center py-12">
            <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Plane className="w-10 h-10 text-yellow-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No Flights Found</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              We couldn't find any flights for your search. Try adjusting your dates or destinations.
            </p>
            <button 
              onClick={() => window.history.back()}
              className="booking-button"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Modify Search
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {flights.map((flight, index) => (
              <div
                key={flight.id}
                className={cn("booking-card hover:shadow-lg transition-shadow group cursor-pointer", isModernTheme && "card")}
                data-testid={`flight-result-${flight.id}`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                  {/* Airline Info */}
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Plane className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className={cn("text-lg font-semibold", isModernTheme ? "text-white" : "text-gray-900")}>
                        {flight.airline.name}
                      </h3>
                      <p className={cn("text-sm", isModernTheme ? "text-purple-300" : "text-gray-600")}>
                        {flight.flightNumber} • {flight.seatClass}
                      </p>
                    </div>
                  </div>

                  {/* Flight Details */}
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                    {/* Departure */}
                    <div className="text-center">
                      <div className={cn("text-2xl font-bold mb-1", isModernTheme ? "text-white" : "text-gray-900")}>
                        {formatTime(flight.departureTime)}
                      </div>
                      <div className={cn("text-sm mb-1", isModernTheme ? "text-purple-300" : "text-gray-600")}>
                        {flight.fromDestination.city}
                      </div>
                      <div className={cn("text-xs", isModernTheme ? "text-purple-400" : "text-gray-500")}>
                        {flight.fromDestination.name}
                      </div>
                    </div>

                    {/* Duration */}
                    <div className="text-center relative">
                      <div className="flex items-center justify-center mb-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <div className="flex-1 h-px bg-gray-300 mx-3"></div>
                        <Plane className="w-4 h-4 text-blue-500" />
                        <div className="flex-1 h-px bg-gray-300 mx-3"></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      </div>
                      <div className={cn("text-sm font-medium", isModernTheme ? "text-white" : "text-gray-700")}>
                        {formatDuration(flight.duration)}
                      </div>
                      <div className={cn("text-xs", isModernTheme ? "text-purple-400" : "text-gray-500")}>Non-stop</div>
                    </div>

                    {/* Arrival */}
                    <div className="text-center">
                      <div className={cn("text-2xl font-bold mb-1", isModernTheme ? "text-white" : "text-gray-900")}>
                        {formatTime(flight.arrivalTime)}
                      </div>
                      <div className={cn("text-sm mb-1", isModernTheme ? "text-purple-300" : "text-gray-600")}>
                        {flight.toDestination.city}
                      </div>
                      <div className={cn("text-xs", isModernTheme ? "text-purple-400" : "text-gray-500")}>
                        {flight.toDestination.name}
                      </div>
                    </div>
                  </div>

                  {/* Price & Book */}
                  <div className="text-center lg:text-right">
                    <div className={cn("text-3xl font-bold mb-2", isModernTheme ? "text-purple-300" : "text-blue-600")}>
                      ₹{parseInt(flight.price).toLocaleString()}
                    </div>
                    <div className={cn("text-sm mb-4", isModernTheme ? "text-purple-400" : "text-gray-600")}>
                      {flight.availableSeats} seats left
                    </div>
                    <button 
                      className={cn("booking-button w-full lg:w-auto px-8", isModernTheme && "btn-primary")}
                      onClick={() => handleBookNow(flight)}
                      data-testid={`button-book-${flight.id}`}
                    >
                      Book Now
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </button>
                  </div>
                </div>

                {/* Rating & Features */}
                <div className={cn("flex items-center justify-between mt-6 pt-6 border-t", isModernTheme ? "border-purple-800/30" : "border-gray-200")}>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className={cn("text-sm font-medium", isModernTheme ? "text-white" : "text-gray-700")}>4.{Math.floor(Math.random() * 9) + 1}</span>
                    </div>
                    <div className={cn("flex space-x-3 text-xs", isModernTheme ? "text-purple-300" : "text-gray-600")}>
                      <span>✓ Free Wi-Fi</span>
                      <span>✓ Meals</span>
                      <span>✓ Entertainment</span>
                    </div>
                  </div>
                  <div className={cn("text-xs", isModernTheme ? "text-purple-400" : "text-gray-500")}>
                    Last booked 2 hours ago
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
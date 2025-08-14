import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/contexts/ThemeContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Plane, 
  MapPin, 
  Calendar as CalendarIcon, 
  Users, 
  Search, 
  TrendingUp,
  Star,
  ArrowRight,
  Clock,
  Zap,
  Shield,
  Heart
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface Destination {
  id: string;
  name: string;
  city: string;
  code: string;
}

interface PopularRoute {
  id: string;
  from: string;
  to: string;
  fromCode: string;
  toCode: string;
  price: number;
  duration: string;
  airlines: string[];
}

interface FlightDeal {
  id: string;
  destination: string;
  from: string;
  price: number;
  originalPrice: number;
  savings: number;
  validUntil: string;
  image: string;
}

export default function FlightsPage() {
  const [location, setLocation] = useLocation();
  const { user, isAuthenticated } = useAuth();

// Indian cities data for autocomplete
const INDIAN_CITIES = [
  { name: "Delhi", code: "DEL", fullName: "Delhi (Indira Gandhi International)" },
  { name: "Mumbai", code: "BOM", fullName: "Mumbai (Chhatrapati Shivaji)" },
  { name: "Bangalore", code: "BLR", fullName: "Bangalore (Kempegowda International)" },
  { name: "Chennai", code: "MAA", fullName: "Chennai (Anna International)" },
  { name: "Kolkata", code: "CCU", fullName: "Kolkata (Netaji Subhas Chandra Bose)" },
  { name: "Hyderabad", code: "HYD", fullName: "Hyderabad (Rajiv Gandhi International)" },
  { name: "Pune", code: "PNQ", fullName: "Pune (Pune Airport)" },
  { name: "Ahmedabad", code: "AMD", fullName: "Ahmedabad (Sardar Vallabhbhai Patel)" },
  { name: "Goa", code: "GOI", fullName: "Goa (Dabolim Airport)" },
  { name: "Kochi", code: "COK", fullName: "Kochi (Cochin International)" },
  { name: "Jaipur", code: "JAI", fullName: "Jaipur (Sanganer Airport)" },
  { name: "Lucknow", code: "LKO", fullName: "Lucknow (Chaudhary Charan Singh)" },
  { name: "Chandigarh", code: "IXC", fullName: "Chandigarh Airport" },
  { name: "Thiruvananthapuram", code: "TRV", fullName: "Thiruvananthapuram (Trivandrum)" },
  { name: "Bhubaneswar", code: "BBI", fullName: "Bhubaneswar (Biju Patnaik)" },
  { name: "Indore", code: "IDR", fullName: "Indore (Devi Ahilyabai Holkar)" },
  { name: "Coimbatore", code: "CJB", fullName: "Coimbatore (Coimbatore International)" },
  { name: "Nagpur", code: "NAG", fullName: "Nagpur (Dr. Babasaheb Ambedkar)" },
  { name: "Vadodara", code: "BDQ", fullName: "Vadodara Airport" },
  { name: "Visakhapatnam", code: "VTZ", fullName: "Visakhapatnam Airport" }
];

// Autocomplete Input Component with unique ID handling
const AutocompleteInput = ({ 
  value, 
  onChange, 
  placeholder, 
  className,
  testId,
  cities = INDIAN_CITIES,
  id
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  className?: string;
  testId: string;
  cities?: typeof INDIAN_CITIES;
  id: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filteredCities, setFilteredCities] = useState<typeof INDIAN_CITIES>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value.length > 0) {
      const filtered = cities.filter(city => 
        city.name.toLowerCase().includes(value.toLowerCase()) ||
        city.code.toLowerCase().includes(value.toLowerCase()) ||
        city.fullName.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredCities(filtered);
    } else {
      setFilteredCities([]);
      setIsOpen(false);
    }
  }, [value, cities]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current && 
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    if (newValue.length > 0) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  };

  const handleInputFocus = () => {
    if (value.length > 0 && filteredCities.length > 0) {
      setIsOpen(true);
    }
  };

  const selectCity = (city: typeof INDIAN_CITIES[0], event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    onChange(city.name);
    setIsOpen(false);
    if (inputRef.current) {
      inputRef.current.blur();
    }
  };

  return (
    <div ref={containerRef} className="relative" data-autocomplete-id={id} style={{ zIndex: 1000000 }}>
      <div className="relative">
        <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
        <Input
          ref={inputRef}
          value={value}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          placeholder={placeholder}
          className={cn("pl-10 h-12", className)}
          data-testid={testId}
          autoComplete="off"
        />
      </div>
      
      {isOpen && filteredCities.length > 0 && (
        <div 
          ref={dropdownRef}
          className="absolute top-full left-0 w-full bg-white border border-gray-200 rounded-md shadow-xl max-h-60 overflow-y-auto mt-1 autocomplete-dropdown"
          style={{ 
            zIndex: 2147483647,
            minWidth: '300px',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
          }}
          data-dropdown-for={id}
        >
          {filteredCities.slice(0, 8).map((city) => (
            <div
              key={`${id}-${city.code}`}
              className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 autocomplete-item"
              onMouseDown={(e) => selectCity(city, e)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">{city.name}</div>
                  <div className="text-sm text-gray-500">{city.fullName}</div>
                </div>
                <div className="text-sm font-mono text-gray-400">{city.code}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
  
  // Search form state
  const [fromCity, setFromCity] = useState("");
  const [toCity, setToCity] = useState("");
  const [departureDate, setDepartureDate] = useState<Date>();
  const [returnDate, setReturnDate] = useState<Date>();
  const [passengers, setPassengers] = useState("1");
  const [tripType, setTripType] = useState("oneway");
  
  // Validation state
  const [errors, setErrors] = useState<{
    fromCity?: string;
    toCity?: string;
    departureDate?: string;
    returnDate?: string;
    general?: string;
  }>({});
  const [seatClass, setSeatClass] = useState("economy");

  // Fetch destinations for autocomplete
  const { data: destinations = [] } = useQuery({
    queryKey: ['/api/destinations'],
  });

  // Popular routes data
  const popularRoutes: PopularRoute[] = [
    {
      id: "1",
      from: "Delhi",
      to: "Mumbai", 
      fromCode: "DEL",
      toCode: "BOM",
      price: 4500,
      duration: "2h 15m",
      airlines: ["IndiGo", "Air India", "Vistara"]
    },
    {
      id: "2", 
      from: "Bangalore",
      to: "Chennai",
      fromCode: "BLR", 
      toCode: "MAA",
      price: 3200,
      duration: "1h 30m",
      airlines: ["SpiceJet", "IndiGo"]
    },
    {
      id: "3",
      from: "Mumbai",
      to: "Goa", 
      fromCode: "BOM",
      toCode: "GOI",
      price: 5800,
      duration: "1h 45m",
      airlines: ["Vistara", "IndiGo"]
    },
    {
      id: "4",
      from: "Delhi", 
      to: "Jaipur",
      fromCode: "DEL",
      toCode: "JAI", 
      price: 2900,
      duration: "1h 20m",
      airlines: ["SpiceJet", "Air India"]
    }
  ];

  // Flight deals data
  const flightDeals: FlightDeal[] = [
    {
      id: "1",
      destination: "Goa",
      from: "Delhi",
      price: 4999,
      originalPrice: 7500,
      savings: 2501,
      validUntil: "2025-08-15",
      image: "/images/destinations/goa.jpg"
    },
    {
      id: "2", 
      destination: "Kerala",
      from: "Mumbai",
      price: 6299,
      originalPrice: 9200,
      savings: 2901,
      validUntil: "2025-08-20",
      image: "/images/destinations/kochi.jpg"
    },
    {
      id: "3",
      destination: "Rajasthan", 
      from: "Bangalore",
      price: 5699,
      originalPrice: 8100,
      savings: 2401,
      validUntil: "2025-08-18",
      image: "/images/destinations/jaipur.jpg"
    }
  ];

  const validateForm = () => {
    const newErrors: typeof errors = {};
    
    // Validate From City
    if (!fromCity.trim()) {
      newErrors.fromCity = "Please select departure city";
    } else if (!INDIAN_CITIES.find(city => city.name.toLowerCase() === fromCity.toLowerCase())) {
      newErrors.fromCity = "Please select a valid Indian city";
    }
    
    // Validate To City
    if (!toCity.trim()) {
      newErrors.toCity = "Please select destination city";
    } else if (!INDIAN_CITIES.find(city => city.name.toLowerCase() === toCity.toLowerCase())) {
      newErrors.toCity = "Please select a valid Indian city";
    }
    
    // Validate same city
    if (fromCity && toCity && fromCity.toLowerCase() === toCity.toLowerCase()) {
      newErrors.general = "Departure and destination cities cannot be the same";
    }
    
    // Validate Departure Date
    if (!departureDate) {
      newErrors.departureDate = "Please select departure date";
    } else if (departureDate < new Date(new Date().setHours(0, 0, 0, 0))) {
      newErrors.departureDate = "Departure date cannot be in the past";
    }
    
    // Validate Return Date for round trip
    if (tripType === "roundtrip") {
      if (!returnDate) {
        newErrors.returnDate = "Please select return date for round trip";
      } else if (departureDate && returnDate < departureDate) {
        newErrors.returnDate = "Return date must be after departure date";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSearch = () => {
    if (!validateForm()) {
      return;
    }

    const searchParams = new URLSearchParams({
      from: fromCity,
      to: toCity,
      date: format(departureDate!, 'yyyy-MM-dd'),
      passengers,
      class: "economy",
      type: tripType
    });

    if (tripType === "roundtrip" && returnDate) {
      searchParams.append('returnDate', format(returnDate, 'yyyy-MM-dd'));
    }

    setLocation(`/flights/search?${searchParams.toString()}`);
  };

  const handlePopularRouteClick = (route: PopularRoute) => {
    const searchParams = new URLSearchParams({
      from: route.from,
      to: route.to,
      date: format(new Date(), 'yyyy-MM-dd'),
      passengers: "1",
      class: "economy",
      type: "oneway"
    });

    setLocation(`/flights/search?${searchParams.toString()}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Hero Section with Search */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div className="container-main py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Find Your Perfect Flight
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Search and compare flights across India with the best prices and convenient schedules
            </p>
          </div>

          {/* Search Form */}
          <Card className="max-w-6xl mx-auto shadow-2xl">
            <CardContent className="p-8 bg-white rounded-lg">
              {/* Trip Type Selector */}
              <div className="flex gap-4 mb-8">
                <Button
                  variant={tripType === "oneway" ? "default" : "outline"}
                  onClick={() => {
                    setTripType("oneway");
                    setReturnDate(undefined);
                  }}
                  className="flex-1 h-12"
                  data-testid="button-oneway"
                >
                  One Way
                </Button>
                <Button
                  variant={tripType === "roundtrip" ? "default" : "outline"}
                  onClick={() => setTripType("roundtrip")}
                  className="flex-1 h-12"
                  data-testid="button-roundtrip"
                >
                  Round Trip
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8" style={{ isolation: 'auto' }}>
                {/* From City */}
                <div className="space-y-2">
                  <Label htmlFor="from" className="text-gray-700 font-medium">From</Label>
                  <AutocompleteInput
                    id="from-city"
                    value={fromCity}
                    onChange={(value) => {
                      setFromCity(value);
                      if (errors.fromCity) {
                        setErrors(prev => ({ ...prev, fromCity: undefined }));
                      }
                    }}
                    placeholder="Delhi, Mumbai, Bangalore..."
                    testId="input-from-city"
                    className={errors.fromCity ? "border-red-500 focus:border-red-500" : ""}
                  />
                  {errors.fromCity && (
                    <p className="text-sm text-red-600" data-testid="error-from-city">{errors.fromCity}</p>
                  )}
                </div>

                {/* To City */}
                <div className="space-y-2">
                  <Label htmlFor="to" className="text-gray-700 font-medium">To</Label>
                  <AutocompleteInput
                    id="to-city"
                    value={toCity}
                    onChange={(value) => {
                      setToCity(value);
                      if (errors.toCity) {
                        setErrors(prev => ({ ...prev, toCity: undefined }));
                      }
                    }}
                    placeholder="Goa, Chennai, Kolkata..."
                    testId="input-to-city"
                    className={errors.toCity ? "border-red-500 focus:border-red-500" : ""}
                  />
                  {errors.toCity && (
                    <p className="text-sm text-red-600" data-testid="error-to-city">{errors.toCity}</p>
                  )}
                </div>

                {/* Departure Date */}
                <div className="space-y-2">
                  <Label className="text-gray-700 font-medium">Departure</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal h-12",
                          !departureDate && "text-muted-foreground",
                          errors.departureDate && "border-red-500"
                        )}
                        data-testid="button-departure-date"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {departureDate ? format(departureDate, "dd MMM yyyy") : "Choose departure date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 z-[9999]" align="start" side="bottom" sideOffset={5}>
                      <Calendar
                        mode="single"
                        selected={departureDate}
                        onSelect={(date) => {
                          setDepartureDate(date);
                          if (errors.departureDate) {
                            setErrors(prev => ({ ...prev, departureDate: undefined }));
                          }
                        }}
                        disabled={(date) => date < new Date()}
                        defaultMonth={new Date(new Date().setDate(new Date().getDate() + 7))}
                        initialFocus
                        showOutsideDays={false}
                        fixedWeeks
                      />
                    </PopoverContent>
                  </Popover>
                  {errors.departureDate && (
                    <p className="text-sm text-red-600" data-testid="error-departure-date">{errors.departureDate}</p>
                  )}
                </div>

                {/* Return Date (if round trip) */}
                {tripType === "roundtrip" && (
                  <div className="space-y-2">
                    <Label className="text-gray-700 font-medium">Return</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal h-12",
                            !returnDate && "text-muted-foreground",
                            errors.returnDate && "border-red-500"
                          )}
                          data-testid="button-return-date"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {returnDate ? format(returnDate, "dd MMM yyyy") : "Choose return date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 z-[9999]" align="start" side="bottom" sideOffset={5}>
                        <Calendar
                          mode="single"
                          selected={returnDate}
                          onSelect={(date) => {
                            setReturnDate(date);
                            if (errors.returnDate) {
                              setErrors(prev => ({ ...prev, returnDate: undefined }));
                            }
                          }}
                          disabled={(date) => date < (departureDate || new Date())}
                          defaultMonth={departureDate ? new Date(departureDate.getTime() + 3 * 24 * 60 * 60 * 1000) : new Date(new Date().setDate(new Date().getDate() + 10))}
                          initialFocus
                          showOutsideDays={false}
                          fixedWeeks
                        />
                      </PopoverContent>
                    </Popover>
                    {errors.returnDate && (
                      <p className="text-sm text-red-600" data-testid="error-return-date">{errors.returnDate}</p>
                    )}
                  </div>
                )}
              </div>

              {/* General Error Message */}
              {errors.general && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-600" data-testid="error-general">{errors.general}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                {/* Passengers */}
                <div className="space-y-2">
                  <Label className="text-gray-700 font-medium">Passengers</Label>
                  <Select value={passengers} onValueChange={setPassengers}>
                    <SelectTrigger className="h-12" data-testid="select-passengers">
                      <Users className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="Select passengers" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 Passenger</SelectItem>
                      <SelectItem value="2">2 Passengers</SelectItem>
                      <SelectItem value="3">3 Passengers</SelectItem>
                      <SelectItem value="4">4 Passengers</SelectItem>
                      <SelectItem value="5">5+ Passengers</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Class */}
                <div className="space-y-2">
                  <Label className="text-gray-700 font-medium">Class</Label>
                  <Select value="economy" onValueChange={() => {}}>
                    <SelectTrigger className="h-12" data-testid="select-class">
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="economy">Economy</SelectItem>
                      <SelectItem value="premium">Premium Economy</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                      <SelectItem value="first">First Class</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Search Button */}
                <div className="flex items-end">
                  <Button
                    onClick={handleSearch}
                    size="lg"
                    className="w-full h-12 text-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white btn-primary"
                    data-testid="button-search-flights"
                  >
                    <Search className="w-5 h-5 mr-2" />
                    Search Flights
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="container-main py-16">
        {/* Popular Routes */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Popular Routes</h2>
              <p className="text-gray-600">Most searched domestic destinations</p>
            </div>
            <TrendingUp className="w-8 h-8 text-blue-600" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularRoutes.map((route) => (
              <Card
                key={route.id}
                className="hover:shadow-lg transition-shadow cursor-pointer group"
                onClick={() => handlePopularRouteClick(route)}
                data-testid={`popular-route-${route.id}`}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-lg font-semibold text-gray-900">
                      {route.from} → {route.to}
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Starting from</span>
                      <span className="text-2xl font-bold text-blue-600">₹{route.price.toLocaleString()}</span>
                    </div>
                    
                    <div className="flex items-center text-gray-600">
                      <Clock className="w-4 h-4 mr-2" />
                      <span className="text-sm">{route.duration}</span>
                    </div>
                    
                    <div className="flex flex-wrap gap-1">
                      {route.airlines.slice(0, 2).map((airline, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {airline}
                        </Badge>
                      ))}
                      {route.airlines.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{route.airlines.length - 2}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Flight Deals */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Limited Time Deals</h2>
              <p className="text-gray-600">Exclusive offers on popular destinations</p>
            </div>
            <Zap className="w-8 h-8 text-yellow-500" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {flightDeals.map((deal) => (
              <Card key={deal.id} className="overflow-hidden hover:shadow-xl transition-shadow group">
                <div className="relative h-48">
                  <img
                    src={deal.image}
                    alt={deal.destination}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-red-500 hover:bg-red-600">
                      Save ₹{deal.savings.toLocaleString()}
                    </Badge>
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{deal.destination}</h3>
                  <p className="text-gray-600 mb-4">from {deal.from}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-2xl font-bold text-blue-600">₹{deal.price.toLocaleString()}</span>
                      <span className="text-gray-500 line-through ml-2">₹{deal.originalPrice.toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-600 mb-4">
                    Valid until {new Date(deal.validUntil).toLocaleDateString()}
                  </div>
                  
                  <Button className="w-full" data-testid={`button-deal-${deal.id}`}>
                    Book Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Features */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose SnapTravels?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Experience seamless flight booking with our advanced features and competitive prices
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center p-8">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Secure Booking</h3>
              <p className="text-gray-600">
                Your transactions are protected with bank-level security and encryption
              </p>
            </Card>

            <Card className="text-center p-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Star className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Best Prices</h3>
              <p className="text-gray-600">
                Compare prices across airlines and get the best deals on your flights
              </p>
            </Card>

            <Card className="text-center p-8">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">24/7 Support</h3>
              <p className="text-gray-600">
                Our customer support team is available round the clock to assist you
              </p>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
}
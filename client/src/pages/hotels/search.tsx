import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, Wifi, Car, Coffee, Dumbbell, Calendar, Users } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

interface Hotel {
  id: string;
  name: string;
  description: string;
  address: string;
  imageUrl: string;
  destinationId: string;
  rating: string;
  pricePerNight: string;
  amenities: string[];
  availableRooms: number;
  totalRooms: number;
  createdAt: string;
}

interface SearchParams {
  destination: string;
  checkInDate: string;
  checkOutDate: string;
  guests: number;
  rooms: number;
}

export default function HotelSearchResults() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { theme } = useTheme();
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [searchParams, setSearchParams] = useState<SearchParams | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const destination = urlParams.get('destination');
    const checkInDate = urlParams.get('checkInDate');
    const checkOutDate = urlParams.get('checkOutDate');
    const guests = parseInt(urlParams.get('guests') || '1');
    const rooms = parseInt(urlParams.get('rooms') || '1');

    if (destination && checkInDate && checkOutDate) {
      const params = { destination, checkInDate, checkOutDate, guests, rooms };
      setSearchParams(params);
      searchHotels(params);
    } else {
      setIsLoading(false);
    }
  }, []);

  const searchMutation = useMutation({
    mutationFn: async (params: SearchParams) => {
      const response = await apiRequest("POST", "/api/hotels/search", params);
      return response.json();
    },
    onSuccess: (data) => {
      setHotels(data);
      setIsLoading(false);
    },
    onError: (error) => {
      console.error("Hotel search error:", error);
      toast({
        title: "Search Failed",
        description: "Unable to search hotels. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    },
  });

  const searchHotels = (params: SearchParams) => {
    setIsLoading(true);
    searchMutation.mutate(params);
  };

  const handleBookHotel = (hotel: Hotel) => {
    const bookingParams = new URLSearchParams({
      type: 'hotel',
      hotelId: hotel.id,
      hotelName: hotel.name,
      checkInDate: searchParams?.checkInDate || '',
      checkOutDate: searchParams?.checkOutDate || '',
      guests: searchParams?.guests.toString() || '1',
      rooms: searchParams?.rooms.toString() || '1',
      pricePerNight: hotel.pricePerNight,
    });
    setLocation(`/booking/passenger-details?${bookingParams.toString()}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const calculateNights = () => {
    if (!searchParams) return 0;
    const checkIn = new Date(searchParams.checkInDate);
    const checkOut = new Date(searchParams.checkOutDate);
    const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getAmenityIcon = (amenity: string) => {
    const amenityLower = amenity.toLowerCase();
    if (amenityLower.includes('wifi') || amenityLower.includes('internet')) return <Wifi className="h-4 w-4" />;
    if (amenityLower.includes('parking') || amenityLower.includes('valet')) return <Car className="h-4 w-4" />;
    if (amenityLower.includes('restaurant') || amenityLower.includes('dining')) return <Coffee className="h-4 w-4" />;
    if (amenityLower.includes('gym') || amenityLower.includes('fitness')) return <Dumbbell className="h-4 w-4" />;
    return null;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <div className="w-48 h-32 bg-gray-200 rounded-lg"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                  </div>
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
          <p className="text-gray-600 mb-4">Please perform a hotel search to see results.</p>
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
        <h1 className="text-3xl font-bold mb-2" data-testid="text-search-title">Hotels in {searchParams.destination}</h1>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span data-testid="text-search-dates">
              {formatDate(searchParams.checkInDate)} - {formatDate(searchParams.checkOutDate)}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span data-testid="text-search-guests">{searchParams.guests} Guests, {searchParams.rooms} Rooms</span>
          </div>
          <span data-testid="text-nights-count">{calculateNights()} nights</span>
        </div>
      </div>

      {/* Results */}
      {hotels.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold mb-2">No hotels found</h3>
          <p className="text-gray-600 mb-4">Try adjusting your search criteria or dates.</p>
          <Button onClick={() => setLocation('/')} data-testid="button-new-search">
            New Search
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {hotels.map((hotel) => (
            <Card key={hotel.id} className={`overflow-hidden transition-shadow hover:shadow-lg ${
              theme === 'future' ? 'bg-black/40 backdrop-blur-xl border-purple-500/30' : ''
            }`} data-testid={`card-hotel-${hotel.id}`}>
              <CardContent className="p-0">
                <div className="flex gap-0">
                  {/* Hotel Image */}
                  <div className="w-72 h-56 flex-shrink-0">
                    {hotel.imageUrl ? (
                      <img
                        src={hotel.imageUrl}
                        alt={hotel.name}
                        className="w-full h-full object-cover"
                        data-testid={`img-hotel-${hotel.id}`}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                        <MapPin className="h-12 w-12 text-blue-500" />
                      </div>
                    )}
                  </div>

                  {/* Hotel Details */}
                  <div className="flex-1 p-6">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-xl font-bold mb-1" data-testid={`text-hotel-name-${hotel.id}`}>
                          {hotel.name}
                        </h3>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-medium" data-testid={`text-hotel-rating-${hotel.id}`}>
                              {hotel.rating}
                            </span>
                          </div>
                          <span className="text-sm text-gray-600">|</span>
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <MapPin className="h-3 w-3" />
                            <span data-testid={`text-hotel-address-${hotel.id}`}>{hotel.address}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold" data-testid={`text-hotel-price-${hotel.id}`}>
                          ₹{parseInt(hotel.pricePerNight).toLocaleString('en-IN')}
                        </div>
                        <div className="text-sm text-gray-600">per night</div>
                        <div className="text-sm text-gray-600">
                          Total: ₹{(parseInt(hotel.pricePerNight) * calculateNights()).toLocaleString('en-IN')}
                        </div>
                      </div>
                    </div>

                    {/* Hotel Description */}
                    {hotel.description && (
                      <p className="text-gray-600 mb-3 line-clamp-2" data-testid={`text-hotel-description-${hotel.id}`}>
                        {hotel.description}
                      </p>
                    )}

                    {/* Amenities */}
                    {hotel.amenities && hotel.amenities.length > 0 && (
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-2">
                          {hotel.amenities.slice(0, 6).map((amenity, index) => (
                            <Badge key={index} variant="secondary" className="text-xs" data-testid={`badge-amenity-${hotel.id}-${index}`}>
                              <div className="flex items-center gap-1">
                                {getAmenityIcon(amenity)}
                                <span>{amenity}</span>
                              </div>
                            </Badge>
                          ))}
                          {hotel.amenities.length > 6 && (
                            <Badge variant="outline" className="text-xs">
                              +{hotel.amenities.length - 6} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Availability */}
                    <div className="flex items-center justify-between">
                      <div className="text-sm">
                        <span className={hotel.availableRooms > 5 ? "text-green-600" : "text-amber-600"}>
                          {hotel.availableRooms > 0 ? `${hotel.availableRooms} rooms available` : 'Limited availability'}
                        </span>
                      </div>
                      <Button 
                        onClick={() => handleBookHotel(hotel)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-8"
                        data-testid={`button-book-hotel-${hotel.id}`}
                      >
                        Book Now
                      </Button>
                    </div>
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
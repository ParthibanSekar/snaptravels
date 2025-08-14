import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { MapPin, Star, Wifi, Car, Utensils, Waves, Calendar, Users, Clock, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";


interface Hotel {
  id: string;
  name: string;
  address: string;
  rating: number;
  pricePerNight: number;
  amenities: string[];
  imageUrl: string;
  description: string;
  availableRooms: number;
  totalRooms: number;
  destination: {
    name: string;
    city: string;
    state: string;
  };
}

interface SearchParams {
  location?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: string;
  rooms?: string;
}

export default function HotelSearch() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useState<SearchParams>({});
  const [searchEnabled, setSearchEnabled] = useState(false);

  // Parse URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const params: SearchParams = {
      location: urlParams.get('location') || '',
      checkIn: urlParams.get('checkIn') || '',
      checkOut: urlParams.get('checkOut') || '',
      guests: urlParams.get('guests') || '2',
      rooms: urlParams.get('rooms') || '1'
    };
    
    setSearchParams(params);
    
    // Enable search if we have basic required parameters
    if (params.location && params.checkIn && params.checkOut) {
      setSearchEnabled(true);
    }
  }, []);

  // Hotel search query
  const { data: hotels = [], isLoading, error } = useQuery({
    queryKey: ["/api/hotels/search", searchParams],
    queryFn: async () => {
      if (!searchEnabled) return [];
      
      const response = await apiRequest("POST", "/api/hotels/search", {
        location: searchParams.location,
        checkInDate: searchParams.checkIn,
        checkOutDate: searchParams.checkOut,
        guests: parseInt(searchParams.guests || '2'),
        rooms: parseInt(searchParams.rooms || '1')
      });
      return response as unknown as Hotel[];
    },
    enabled: searchEnabled
  });

  const bookingMutation = useMutation({
    mutationFn: async (hotel: Hotel) => {
      return apiRequest("POST", "/api/bookings/hotel/create", {
        hotel,
        checkIn: searchParams.checkIn,
        checkOut: searchParams.checkOut,
        guests: parseInt(searchParams.guests || '2'),
        rooms: parseInt(searchParams.rooms || '1')
      });
    },
    onSuccess: (data: any) => {
      toast({
        title: "Booking Initiated",
        description: "Redirecting to checkout...",
      });
      setLocation(`/booking/hotel/${data.bookingId}`);
    },
    onError: (error: any) => {
      toast({
        title: "Booking Failed",
        description: error.message || "Failed to initiate booking",
        variant: "destructive",
      });
    },
  });

  const handleBookNow = (hotel: Hotel) => {
    bookingMutation.mutate(hotel);
  };

  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case 'wifi': return <Wifi className="w-4 h-4" />;
      case 'pool': return <Waves className="w-4 h-4" />;
      case 'restaurant': return <Utensils className="w-4 h-4" />;
      case 'parking': return <Car className="w-4 h-4" />;
      default: return <MapPin className="w-4 h-4" />;
    }
  };

  const calculateNights = () => {
    if (!searchParams.checkIn || !searchParams.checkOut) return 1;
    const checkIn = new Date(searchParams.checkIn);
    const checkOut = new Date(searchParams.checkOut);
    const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (!searchEnabled) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">No Search Parameters</h1>
          <p className="text-gray-600 mb-6">Please start a hotel search from the home page.</p>
          <Link href="/">
            <button className="booking-button">Go to Home</button>
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Searching for hotels...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Search Error</h1>
          <p className="text-gray-600 mb-6">Failed to search hotels. Please try again.</p>
          <Link href="/">
            <button className="booking-button">Go Back</button>
          </Link>
        </div>
      </div>
    );
  }

  const nights = calculateNights();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-main py-8">
        {/* Search Summary */}
        <div className="search-results-header">
          <div className="flex flex-wrap items-center gap-4 text-gray-700">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 hotel-accent" />
              <span className="font-medium">{searchParams.location}</span>
            </div>
            <div className="text-gray-400">•</div>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gray-500" />
              <span>{searchParams.checkIn} → {searchParams.checkOut}</span>
            </div>
            <div className="text-gray-400">•</div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-gray-500" />
              <span>{searchParams.guests} guests, {searchParams.rooms} room{parseInt(searchParams.rooms || '1') > 1 ? 's' : ''}</span>
            </div>
            <div className="text-gray-400">•</div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-gray-500" />
              <span>{nights} night{nights > 1 ? 's' : ''}</span>
            </div>
          </div>
        </div>

        {/* Results Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="heading-lg">
            {hotels.length} Hotels Found
          </h1>
          <Link href="/">
            <button className="booking-button-secondary">
              Modify Search
            </button>
          </Link>
        </div>

        {/* Hotel Results */}
        <div className="space-y-4">
          {hotels.map((hotel: Hotel) => (
            <div key={hotel.id} className="booking-card group">
              <div className="p-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Hotel Image */}
                  <div className="lg:w-80 h-48 lg:h-56 rounded-lg overflow-hidden">
                    <img
                      src={hotel.imageUrl}
                      alt={hotel.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Hotel Details */}
                  <div className="flex-1">
                    <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
                      <div className="flex-1">
                        {/* Hotel Name & Rating */}
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {hotel.name}
                          </h3>
                          <div className="rating-badge">
                            <Star className="w-3 h-3 inline mr-1" />
                            {hotel.rating}
                          </div>
                        </div>

                        {/* Location */}
                        <div className="flex items-center gap-2 mb-3">
                          <MapPin className="w-4 h-4 text-gray-500" />
                          <span className="text-muted">{hotel.destination.city}, {hotel.destination.state}</span>
                        </div>

                        {/* Description */}
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {hotel.description}
                        </p>

                        {/* Amenities */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {hotel.amenities.slice(0, 6).map((amenity, index) => (
                            <span key={index} className="amenity-tag">
                              <div className="flex items-center gap-1">
                                {getAmenityIcon(amenity)}
                                {amenity}
                              </div>
                            </span>
                          ))}
                          {hotel.amenities.length > 6 && (
                            <span className="amenity-tag">
                              +{hotel.amenities.length - 6} more
                            </span>
                          )}
                        </div>

                        {/* Availability */}
                        <div className="text-small">
                          <span className="text-green-600 font-medium">{hotel.availableRooms}</span> rooms available
                        </div>
                      </div>

                      {/* Pricing & Booking */}
                      <div className="lg:text-right lg:min-w-48">
                        <div className="bg-gray-50 p-4 rounded-lg border">
                          <div className="text-right mb-3">
                            <div className="price-display">
                              ₹{(hotel.pricePerNight * nights).toLocaleString()}
                            </div>
                            <div className="text-small">
                              ₹{hotel.pricePerNight.toLocaleString()}/night × {nights} night{nights > 1 ? 's' : ''}
                            </div>
                          </div>
                          <button 
                            className="w-full booking-button"
                            onClick={() => handleBookNow(hotel)}
                            disabled={bookingMutation.isPending}
                            data-testid={`button-book-hotel-${hotel.id}`}
                          >
                            {bookingMutation.isPending ? (
                              <div className="flex items-center justify-center gap-2">
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                Booking...
                              </div>
                            ) : (
                              <div className="flex items-center justify-center gap-2">
                                Book Now
                                <ArrowRight className="w-4 h-4" />
                              </div>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {hotels.length === 0 && (
          <div className="text-center py-12">
            <div className="booking-card p-8 max-w-md mx-auto">
              <h3 className="text-xl font-bold text-gray-900 mb-3">No Hotels Found</h3>
              <p className="text-gray-600 mb-6">
                No hotels available for your search criteria. Try adjusting your dates or location.
              </p>
              <Link href="/">
                <button className="booking-button">
                  Search Again
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
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

import type { Hotel, HotelSearch } from "@shared/schema";
import { Building, Star, IndianRupee, MapPin } from "lucide-react";

export default function HotelSearch() {
  const [location, navigate] = useLocation();
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  
  const [searchParams, setSearchParams] = useState<HotelSearch>({
    destination: "",
    checkInDate: "",
    checkOutDate: "",
    guests: 2,
    rooms: 1
  });

  const [hasSearched, setHasSearched] = useState(false);

  const searchMutation = useMutation({
    mutationFn: async (search: HotelSearch) => {
      const response = await apiRequest("POST", "/api/hotels/search", search);
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
        description: "Failed to search hotels. Please try again.",
        variant: "destructive",
      });
    },
  });

  const bookingMutation = useMutation({
    mutationFn: async (hotelId: string) => {
      const bookingData = {
        travelType: "hotel" as const,
        hotelId,
        passengerDetails: { guests: searchParams.guests, rooms: searchParams.rooms },
        totalAmount: "8000", // This would be calculated based on hotel price and nights
        travelDate: new Date(searchParams.checkInDate),
        checkInDate: new Date(searchParams.checkInDate),
        checkOutDate: new Date(searchParams.checkOutDate),
        status: "pending" as const,
      };
      const response = await apiRequest("POST", "/api/bookings", bookingData);
      return response.json();
    },
    onSuccess: (booking) => {
      toast({
        title: "Booking Successful",
        description: "Your hotel has been booked successfully!",
      });
      navigate(`/booking/confirmation/${booking.id}`);
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Please Login",
          description: "You need to login to book hotels.",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Booking Failed",
        description: "Failed to book hotel. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSearch = () => {
    if (!searchParams.destination || !searchParams.checkInDate || !searchParams.checkOutDate) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    searchMutation.mutate(searchParams);
  };

  const handleBook = (hotelId: string) => {
    if (!isAuthenticated) {
      toast({
        title: "Please Login",
        description: "You need to login to book hotels.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
    bookingMutation.mutate(hotelId);
  };

  const calculateNights = () => {
    if (searchParams.checkInDate && searchParams.checkOutDate) {
      const checkIn = new Date(searchParams.checkInDate);
      const checkOut = new Date(searchParams.checkOutDate);
      const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
    return 1;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="w-6 h-6 text-snap-orange" />
              Search Hotels
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div>
                <Label htmlFor="destination">Destination</Label>
                <Input
                  id="destination"
                  placeholder="Goa, India"
                  value={searchParams.destination}
                  onChange={(e) => setSearchParams({ ...searchParams, destination: e.target.value })}
                  data-testid="input-destination"
                />
              </div>
              <div>
                <Label htmlFor="checkin">Check-in Date</Label>
                <Input
                  id="checkin"
                  type="date"
                  value={searchParams.checkInDate}
                  onChange={(e) => setSearchParams({ ...searchParams, checkInDate: e.target.value })}
                  data-testid="input-checkin"
                />
              </div>
              <div>
                <Label htmlFor="checkout">Check-out Date</Label>
                <Input
                  id="checkout"
                  type="date"
                  value={searchParams.checkOutDate}
                  onChange={(e) => setSearchParams({ ...searchParams, checkOutDate: e.target.value })}
                  data-testid="input-checkout"
                />
              </div>
              <div>
                <Label htmlFor="guests">Guests & Rooms</Label>
                <Select
                  value={`${searchParams.guests}-${searchParams.rooms}`}
                  onValueChange={(value) => {
                    const [guests, rooms] = value.split('-').map(Number);
                    setSearchParams({ ...searchParams, guests, rooms });
                  }}
                >
                  <SelectTrigger data-testid="select-guests">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2-1">2 Guests, 1 Room</SelectItem>
                    <SelectItem value="4-2">4 Guests, 2 Rooms</SelectItem>
                    <SelectItem value="6-3">6 Guests, 3 Rooms</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button 
                  onClick={handleSearch} 
                  className="w-full bg-snap-orange hover:bg-orange-600"
                  disabled={searchMutation.isPending}
                  data-testid="button-search"
                >
                  {searchMutation.isPending ? "Searching..." : "Search Hotels"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search Results */}
        {hasSearched && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Available Hotels</h2>
            
            {searchMutation.isPending ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i}>
                    <CardContent className="p-6">
                      <Skeleton className="h-32 w-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : searchMutation.data && searchMutation.data.length > 0 ? (
              <div className="space-y-4">
                {searchMutation.data.map((hotel: Hotel) => {
                  const nights = calculateNights();
                  const totalPrice = parseFloat(hotel.pricePerNight) * nights;
                  
                  return (
                    <Card key={hotel.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                          {/* Hotel Image */}
                          <div className="lg:col-span-1">
                            <img
                              src={hotel.imageUrl || `data:image/svg+xml;base64,${btoa(`
                                <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
                                  <defs>
                                    <linearGradient id="hotel-bg" x1="0%" y1="0%" x2="100%" y2="100%">
                                      <stop offset="0%" style="stop-color:#f59e0b;stop-opacity:1" />
                                      <stop offset="100%" style="stop-color:#d97706;stop-opacity:1" />
                                    </linearGradient>
                                  </defs>
                                  <rect width="100%" height="100%" fill="url(#hotel-bg)"/>
                                  <rect x="50" y="80" width="300" height="140" rx="12" fill="white" opacity="0.9"/>
                                  <rect x="70" y="100" width="50" height="30" rx="4" fill="#f59e0b"/>
                                  <rect x="70" y="140" width="50" height="30" rx="4" fill="#f59e0b"/>
                                  <rect x="70" y="180" width="50" height="30" rx="4" fill="#f59e0b"/>
                                  <rect x="140" y="100" width="50" height="30" rx="4" fill="#f59e0b"/>
                                  <rect x="140" y="140" width="50" height="30" rx="4" fill="#f59e0b"/>
                                  <rect x="140" y="180" width="50" height="30" rx="4" fill="#f59e0b"/>
                                  <text x="200" y="250" text-anchor="middle" fill="white" font-family="Arial" font-size="18" font-weight="bold">${hotel.name || 'Hotel'}</text>
                                </svg>
                              `)}`}
                              alt={hotel.name}
                              className="w-full h-32 lg:h-24 object-cover rounded-lg"
                            />
                          </div>
                          
                          {/* Hotel Details */}
                          <div className="lg:col-span-2">
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="text-xl font-semibold">{hotel.name}</h3>
                              {hotel.rating && (
                                <div className="flex items-center gap-1">
                                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                  <span className="text-sm font-medium">{hotel.rating}</span>
                                </div>
                              )}
                            </div>
                            
                            <div className="flex items-center gap-1 text-gray-600 mb-3">
                              <MapPin className="w-4 h-4" />
                              <span className="text-sm">{hotel.address}</span>
                            </div>
                            
                            {hotel.description && (
                              <p className="text-gray-600 text-sm mb-3 line-clamp-2">{hotel.description}</p>
                            )}
                            
                            {hotel.amenities && hotel.amenities.length > 0 && (
                              <div className="flex flex-wrap gap-2">
                                {hotel.amenities.slice(0, 3).map((amenity, index) => (
                                  <Badge key={index} variant="secondary" className="text-xs">
                                    {amenity}
                                  </Badge>
                                ))}
                                {hotel.amenities.length > 3 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{hotel.amenities.length - 3} more
                                  </Badge>
                                )}
                              </div>
                            )}
                          </div>
                          
                          {/* Pricing and Booking */}
                          <div className="lg:col-span-1 text-right">
                            <div className="mb-4">
                              <p className="text-sm text-gray-600">Per night</p>
                              <div className="flex items-center justify-end gap-1">
                                <IndianRupee className="w-4 h-4" />
                                <span className="text-lg font-semibold">{hotel.pricePerNight}</span>
                              </div>
                              <p className="text-sm text-gray-600">
                                Total ({nights} night{nights > 1 ? 's' : ''}): ₹{totalPrice.toLocaleString()}
                              </p>
                            </div>
                            
                            <div className="text-sm text-gray-600 mb-4">
                              {hotel.availableRooms} rooms available
                            </div>
                            
                            <Button
                              onClick={() => handleBook(hotel.id)}
                              className="w-full bg-snap-blue hover:bg-blue-700"
                              disabled={bookingMutation.isPending}
                              data-testid={`button-book-${hotel.id}`}
                            >
                              {bookingMutation.isPending ? "Booking..." : "Book Now"}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-gray-600">No hotels found for your search criteria.</p>
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

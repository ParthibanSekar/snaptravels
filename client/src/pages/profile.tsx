import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Booking } from "@shared/schema";
import { User, Calendar, IndianRupee, Phone, Mail } from "lucide-react";

export default function Profile() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
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
  }, [isAuthenticated, authLoading, toast]);

  const { data: bookings, isLoading } = useQuery<Booking[]>({
    queryKey: ["/api/bookings"],
    enabled: !!user,
  });

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Skeleton className="h-32 w-full mb-8" />
          <Skeleton className="h-64 w-full" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null; // Will redirect in useEffect
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTravelTypeIcon = (type: string) => {
    switch (type) {
      case "flight":
        return "✈️";
      case "hotel":
        return "🏨";
      case "train":
        return "🚆";
      case "bus":
        return "🚌";
      default:
        return "🎫";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex items-center gap-6">
              <Avatar className="w-20 h-20">
                <AvatarImage src={user.profileImageUrl || ""} alt={user.firstName || "User"} />
                <AvatarFallback className="text-2xl">
                  {user.firstName?.[0] || user.email?.[0]?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2" data-testid="profile-name">
                  {user.firstName} {user.lastName}
                </h1>
                
                <div className="space-y-2">
                  {user.email && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail className="w-4 h-4" />
                      <span data-testid="profile-email">{user.email}</span>
                    </div>
                  )}
                  
                  {user.phone && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span data-testid="profile-phone">{user.phone}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>Member since {new Date(user.createdAt).toLocaleDateString("en-IN", { month: "long", year: "numeric" })}</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <Button variant="outline" data-testid="button-edit-profile">
                  Edit Profile
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Booking History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-6 h-6" />
              Booking History
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-24 w-full" />
                ))}
              </div>
            ) : bookings && bookings.length > 0 ? (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                    data-testid={`booking-${booking.id}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-2xl">{getTravelTypeIcon(booking.travelType)}</span>
                          <div>
                            <h3 className="text-lg font-semibold capitalize">
                              {booking.travelType} Booking
                            </h3>
                            <p className="text-sm text-gray-600 font-mono">
                              Booking ID: {booking.id}
                            </p>
                          </div>
                          <Badge className={getStatusColor(booking.status)}>
                            {booking.status}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Travel Date:</span>
                            <p className="font-medium">
                              {new Date(booking.travelDate).toLocaleDateString("en-IN")}
                            </p>
                          </div>
                          
                          <div>
                            <span className="text-gray-600">Booking Date:</span>
                            <p className="font-medium">
                              {new Date(booking.bookingDate).toLocaleDateString("en-IN")}
                            </p>
                          </div>
                          
                          <div>
                            <span className="text-gray-600">Amount:</span>
                            <div className="flex items-center gap-1">
                              <IndianRupee className="w-4 h-4" />
                              <span className="font-medium text-green-600">
                                {booking.totalAmount}
                              </span>
                            </div>
                          </div>
                        </div>

                        {booking.checkInDate && booking.checkOutDate && (
                          <div className="mt-2 text-sm">
                            <span className="text-gray-600">Stay Duration:</span>
                            <p className="font-medium">
                              {new Date(booking.checkInDate).toLocaleDateString()} - {new Date(booking.checkOutDate).toLocaleDateString()}
                            </p>
                          </div>
                        )}
                      </div>
                      
                      <div className="ml-6">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => window.location.href = `/booking/confirmation/${booking.id}`}
                          data-testid={`button-view-${booking.id}`}
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No Bookings Yet</h3>
                <p className="text-gray-500 mb-6">Start planning your next trip with SnapTravels!</p>
                <Button 
                  onClick={() => window.location.href = "/"}
                  data-testid="button-start-booking"
                >
                  Start Booking
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}

import { useEffect } from "react";
import { useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { Booking } from "@shared/schema";
import { CheckCircle, Calendar, IndianRupee, User, MapPin } from "lucide-react";

export default function BookingConfirmation() {
  const [match, params] = useRoute("/booking/confirmation/:id");
  const { toast } = useToast();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

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

  const { data: booking, isLoading, error } = useQuery<Booking>({
    queryKey: ["/api/bookings", params?.id],
    enabled: !!params?.id && isAuthenticated,
  });

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <CardContent className="p-8">
              <Skeleton className="h-32 w-full" />
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-600">Booking not found or failed to load.</p>
              <Button className="mt-4" onClick={() => window.location.href = "/"}>
                Go Home
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
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

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2" data-testid="confirmation-title">
            Booking Confirmed!
          </h1>
          <p className="text-gray-600" data-testid="confirmation-subtitle">
            Your {booking.travelType} booking has been successfully processed.
          </p>
        </div>

        {/* Booking Details */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">{getTravelTypeIcon(booking.travelType)}</span>
              Booking Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Booking ID</label>
                  <p className="text-lg font-mono" data-testid="booking-id">{booking.id}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-600">Travel Type</label>
                  <p className="text-lg capitalize flex items-center gap-2">
                    <span>{booking.travelType}</span>
                    <Badge className={getStatusColor(booking.status)}>
                      {booking.status}
                    </Badge>
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">Travel Date</label>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <p className="text-lg" data-testid="travel-date">
                      {new Date(booking.travelDate).toLocaleDateString("en-IN", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric"
                      })}
                    </p>
                  </div>
                </div>

                {booking.checkInDate && booking.checkOutDate && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Stay Duration</label>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <p className="text-lg">
                        {new Date(booking.checkInDate).toLocaleDateString()} - {new Date(booking.checkOutDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Total Amount</label>
                  <div className="flex items-center gap-1">
                    <IndianRupee className="w-5 h-5 text-green-600" />
                    <p className="text-2xl font-bold text-green-600" data-testid="total-amount">
                      {booking.totalAmount}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">Booking Date</label>
                  <p className="text-lg">
                    {booking.bookingDate ? new Date(booking.bookingDate).toLocaleDateString("en-IN") : "Not available"}
                  </p>
                </div>

                {booking.paymentId && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Payment ID</label>
                    <p className="text-lg font-mono">{booking.paymentId}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Passenger Details */}
            {booking.passengerDetails && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Passenger Details
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                    {typeof booking.passengerDetails === 'string' 
                      ? booking.passengerDetails 
                      : JSON.stringify(booking.passengerDetails, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Actions */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="outline" 
                onClick={() => window.print()}
                data-testid="button-print"
              >
                Print Booking
              </Button>
              <Button 
                onClick={() => window.location.href = "/profile"}
                data-testid="button-view-bookings"
              >
                View All Bookings
              </Button>
              <Button 
                variant="outline" 
                onClick={() => window.location.href = "/"}
                data-testid="button-home"
              >
                Book Another Trip
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Important Information */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Important Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm text-gray-600">
              <p>• Please carry a valid government-issued photo ID during your travel.</p>
              <p>• Arrive at the departure point at least 30 minutes before scheduled departure time.</p>
              <p>• Keep this booking confirmation handy during your journey.</p>
              <p>• For any queries or cancellations, please contact our customer support.</p>
              <p>• Check our terms and conditions for cancellation and refund policies.</p>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}

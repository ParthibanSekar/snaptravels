import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Plane, 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Phone, 
  Mail,
  CreditCard,
  Download,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Search
} from "lucide-react";
import { format } from "date-fns";

interface BookingDetails {
  id: string;
  pnr: string;
  status: "confirmed" | "cancelled" | "pending";
  flight: {
    flightNumber: string;
    airline: string;
    from: string;
    to: string;
    departureTime: string;
    arrivalTime: string;
    duration: number;
    seatClass: string;
  };
  passengers: Array<{
    name: string;
    age: number;
    seatNumber?: string;
  }>;
  totalAmount: number;
  bookingDate: string;
  contactInfo: {
    email: string;
    phone: string;
  };
}

export default function ManageBookingPage() {
  const { user, isAuthenticated } = useAuth();
  const [pnrNumber, setPnrNumber] = useState("");
  const [searchPnr, setSearchPnr] = useState("");

  // Fetch user's bookings if authenticated
  const { data: userBookings = [] } = useQuery<BookingDetails[]>({
    queryKey: ['/api/bookings'],
    enabled: isAuthenticated,
  });

  // Fetch specific booking by PNR
  const { data: pnrBooking, isLoading: isPnrLoading, error: pnrError } = useQuery<BookingDetails>({
    queryKey: ['/api/bookings/pnr', searchPnr],
    enabled: !!searchPnr,
  });

  const handlePnrSearch = () => {
    if (pnrNumber.trim()) {
      setSearchPnr(pnrNumber.trim().toUpperCase());
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-4 h-4" />;
      case 'cancelled':
        return <AlertCircle className="w-4 h-4" />;
      case 'pending':
        return <RefreshCw className="w-4 h-4" />;
      default:
        return null;
    }
  };

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

  const BookingCard = ({ booking }: { booking: BookingDetails }) => (
    <Card className="mb-6 hover:shadow-lg transition-shadow">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold">
              {booking.flight.airline} {booking.flight.flightNumber}
            </CardTitle>
            <p className="text-gray-600">PNR: {booking.pnr}</p>
          </div>
          <div className="text-right">
            <Badge className={`${getStatusColor(booking.status)} flex items-center gap-1 mb-2`}>
              {getStatusIcon(booking.status)}
              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
            </Badge>
            <p className="text-2xl font-bold text-blue-600">₹{booking.totalAmount.toLocaleString()}</p>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Flight Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {formatTime(booking.flight.departureTime)}
            </div>
            <div className="text-gray-600 text-sm mb-1">{booking.flight.from}</div>
            <div className="text-xs text-gray-500">
              {format(new Date(booking.flight.departureTime), 'dd MMM yyyy')}
            </div>
          </div>

          <div className="text-center relative">
            <div className="flex items-center justify-center mb-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1 h-px bg-gray-300 mx-3"></div>
              <Plane className="w-4 h-4 text-blue-500" />
              <div className="flex-1 h-px bg-gray-300 mx-3"></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            </div>
            <div className="text-gray-700 text-sm font-medium">
              {formatDuration(booking.flight.duration)}
            </div>
            <div className="text-xs text-gray-500">Non-stop</div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {formatTime(booking.flight.arrivalTime)}
            </div>
            <div className="text-gray-600 text-sm mb-1">{booking.flight.to}</div>
            <div className="text-xs text-gray-500">
              {format(new Date(booking.flight.arrivalTime), 'dd MMM yyyy')}
            </div>
          </div>
        </div>

        <Separator className="my-6" />

        {/* Passenger Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
              <User className="w-4 h-4 mr-2" />
              Passengers ({booking.passengers.length})
            </h4>
            <div className="space-y-2">
              {booking.passengers.map((passenger, index) => (
                <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="font-medium">{passenger.name}</span>
                  <div className="text-sm text-gray-600">
                    Age: {passenger.age}
                    {passenger.seatNumber && ` • Seat: ${passenger.seatNumber}`}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Contact Information</h4>
            <div className="space-y-2">
              <div className="flex items-center text-gray-600">
                <Mail className="w-4 h-4 mr-2" />
                <span className="text-sm">{booking.contactInfo.email}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Phone className="w-4 h-4 mr-2" />
                <span className="text-sm">{booking.contactInfo.phone}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Calendar className="w-4 h-4 mr-2" />
                <span className="text-sm">
                  Booked on {format(new Date(booking.bookingDate), 'dd MMM yyyy')}
                </span>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-6" />

        {/* Actions */}
        <div className="flex flex-wrap gap-4">
          <Button variant="outline" className="flex items-center">
            <Download className="w-4 h-4 mr-2" />
            Download Ticket
          </Button>
          
          {booking.status === 'confirmed' && (
            <>
              <Button variant="outline" className="flex items-center">
                <RefreshCw className="w-4 h-4 mr-2" />
                Modify Booking
              </Button>
              <Button variant="outline" className="flex items-center text-red-600 hover:text-red-700">
                <AlertCircle className="w-4 h-4 mr-2" />
                Cancel Booking
              </Button>
            </>
          )}
          
          <Button variant="outline" className="flex items-center">
            <Clock className="w-4 h-4 mr-2" />
            Check-in Online
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="container-main py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Your Bookings</h1>
          <p className="text-gray-600">View, modify, and manage your flight bookings</p>
        </div>

        {/* PNR Search */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Search className="w-5 h-5 mr-2" />
              Search by PNR
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="pnr" className="text-gray-700">PNR Number</Label>
                <Input
                  id="pnr"
                  placeholder="Enter your 6-digit PNR number"
                  value={pnrNumber}
                  onChange={(e) => setPnrNumber(e.target.value.toUpperCase())}
                  maxLength={6}
                  className="mt-2"
                  data-testid="input-pnr-search"
                />
              </div>
              <div className="flex items-end">
                <Button 
                  onClick={handlePnrSearch}
                  disabled={pnrNumber.length !== 6}
                  data-testid="button-search-pnr"
                >
                  Search
                </Button>
              </div>
            </div>
            
            {isPnrLoading && (
              <div className="mt-4 text-center">
                <div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
                <p className="text-gray-600 mt-2">Searching for booking...</p>
              </div>
            )}
            
            {pnrError && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600">No booking found with PNR: {searchPnr}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* PNR Search Result */}
        {pnrBooking && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Booking Details</h2>
            <BookingCard booking={pnrBooking} />
          </div>
        )}

        {/* User's Bookings */}
        {isAuthenticated && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Recent Bookings</h2>
            
            {userBookings.length === 0 ? (
              <Card className="text-center py-12">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Plane className="w-10 h-10 text-blue-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">No Bookings Found</h3>
                <p className="text-gray-600 mb-6">
                  You don't have any flight bookings yet. Start planning your next trip!
                </p>
                <Button onClick={() => window.location.href = '/flights'}>
                  Book a Flight
                </Button>
              </Card>
            ) : (
              <div>
                {userBookings.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Login Prompt for Non-Authenticated Users */}
        {!isAuthenticated && !pnrBooking && (
          <Card className="text-center py-12">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <User className="w-10 h-10 text-blue-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Sign In for More Features</h3>
            <p className="text-gray-600 mb-6">
              Log in to view all your bookings, get personalized recommendations, and access exclusive deals.
            </p>
            <Button onClick={() => window.location.href = '/api/login'}>
              Sign In
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}
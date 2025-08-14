import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  CheckCircle2, 
  Plane, 
  Download, 
  Mail, 
  Calendar, 
  Users, 
  CreditCard,
  Home,
  User,
  Check
} from "lucide-react";

interface BookingConfirmationData {
  bookingId: string;
  flight: {
    id: string;
    flightNumber: string;
    airline: {
      name: string;
      code: string;
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
    duration: number;
    seatClass: string;
  };
  passengers: Array<{
    title: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    gender: string;
    nationality: string;
    seat?: string;
  }>;
  contact: {
    email: string;
    phone: string;
    emergencyContact: string;
  };
  totalAmount: number;
  paymentMethod: string;
  bookingDate: string;
  status: string;
}

export default function BookingConfirmation() {
  const [location, setLocation] = useLocation();
  const [booking, setBooking] = useState<BookingConfirmationData | null>(null);

  useEffect(() => {
    // Get booking confirmation data from sessionStorage
    const storedConfirmation = sessionStorage.getItem('bookingConfirmation');
    if (!storedConfirmation) {
      setLocation('/flights/search');
      return;
    }

    const confirmationData = JSON.parse(storedConfirmation) as BookingConfirmationData;
    setBooking(confirmationData);
  }, [setLocation]);

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (timeString: string) => {
    return new Date(timeString).toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const handleDownloadTicket = () => {
    alert("Ticket download feature will be implemented with PDF generation");
  };

  const handleEmailTicket = () => {
    alert("Email ticket feature will be implemented with email service");
  };

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const taxAmount = Math.round(booking.totalAmount * 0.1);
  const totalWithTax = booking.totalAmount + taxAmount;

  return (
    <div className="min-h-screen px-6 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Progress Indicator */}
        <div className="flex items-center justify-center mb-12">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
              <span className="text-green-400 font-medium">Passenger Details</span>
            </div>
            <div className="w-12 h-px bg-green-400"></div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
              <span className="text-green-400 font-medium">Payment</span>
            </div>
            <div className="w-12 h-px bg-green-400"></div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
              <span className="text-green-400 font-medium">Confirmation</span>
            </div>
          </div>
        </div>

        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 glow-green">
            <CheckCircle2 className="w-12 h-12 text-white" />
          </div>
          <h1 className="heading-lg text-white mb-4">Booking Confirmed!</h1>
          <p className="text-white/60 text-lg mb-6">
            Your flight has been successfully booked. Details have been sent to your email.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={handleDownloadTicket} 
              className="modern-button hover-lift"
              data-testid="button-download-ticket"
            >
              <Download className="w-5 h-5 mr-2" />
              Download Ticket
            </Button>
            <Button 
              onClick={handleEmailTicket} 
              variant="outline" 
              className="modern-button-outline"
              data-testid="button-email-ticket"
            >
              <Mail className="w-5 h-5 mr-2" />
              Email Ticket
            </Button>
          </div>
        </div>

        {/* Booking Details */}
        <div className="glass p-8 rounded-3xl mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Booking Details</h2>
              <div className="flex items-center space-x-4">
                <span className="text-white/60">Booking ID:</span>
                <span className="font-mono text-purple-400 font-semibold" data-testid="text-booking-id">
                  {booking.bookingId}
                </span>
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </Badge>
              </div>
            </div>
            <div className="text-right mt-4 lg:mt-0">
              <p className="text-white/60 text-sm">Booked on</p>
              <p className="text-white font-medium">{formatDate(booking.bookingDate)}</p>
            </div>
          </div>

          {/* Flight Information */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
              <Plane className="w-5 h-5 mr-2 text-purple-400" />
              Flight Information
            </h3>
            
            <div className="bg-black/30 rounded-2xl p-6 border border-white/10">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h4 className="text-lg font-semibold text-white">{booking.flight.airline.name}</h4>
                  <p className="text-purple-400 font-medium">{booking.flight.flightNumber}</p>
                </div>
                <Badge variant="outline" className="border-purple-500/30 text-purple-400">
                  {booking.flight.seatClass}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {/* Departure */}
                <div className="text-center">
                  <div className="text-2xl font-bold text-white mb-1">
                    {formatTime(booking.flight.departureTime)}
                  </div>
                  <div className="text-white/60 text-sm mb-2">{booking.flight.fromDestination.city}</div>
                  <div className="text-xs text-white/40 mt-1">{booking.flight.fromDestination.name}</div>
                </div>

                {/* Duration */}
                <div className="text-center relative">
                  <div className="flex items-center justify-center mb-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <div className="flex-1 h-px bg-gradient-to-r from-purple-400 to-pink-400 mx-4"></div>
                    <Plane className="w-5 h-5 text-purple-400 transform rotate-90" />
                    <div className="flex-1 h-px bg-gradient-to-r from-pink-400 to-purple-400 mx-4"></div>
                    <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                  </div>
                  <div className="text-white/70 text-sm font-medium">
                    {formatDuration(booking.flight.duration)}
                  </div>
                  <div className="text-xs text-white/40">Non-stop</div>
                </div>

                {/* Arrival */}
                <div className="text-center">
                  <div className="text-2xl font-bold text-white mb-1">
                    {formatTime(booking.flight.arrivalTime)}
                  </div>
                  <div className="text-white/60 text-sm mb-2">{booking.flight.toDestination.city}</div>
                  <div className="text-xs text-white/40 mt-1">{booking.flight.toDestination.name}</div>
                </div>
              </div>

              <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
                <div className="flex items-center space-x-2 text-purple-400 mb-2">
                  <Calendar className="w-4 h-4" />
                  <span className="font-medium">Travel Date</span>
                </div>
                <p className="text-white font-semibold">{formatDate(booking.flight.departureTime)}</p>
              </div>
            </div>
          </div>

          {/* Passenger Information */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
              <Users className="w-5 h-5 mr-2 text-purple-400" />
              Passenger Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {booking.passengers.map((passenger, index) => (
                <div key={index} className="bg-black/30 rounded-2xl p-4 border border-white/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-white" data-testid={`text-passenger-${index}`}>
                        {passenger.title} {passenger.firstName} {passenger.lastName}
                      </h4>
                      <p className="text-white/60 text-sm">Passenger {index + 1}</p>
                      <p className="text-white/60 text-xs">{passenger.nationality}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-purple-400 font-medium">
                        Seat {passenger.seat || `${12 + index}${String.fromCharCode(65 + index)}`}
                      </p>
                      <p className="text-white/60 text-sm">{booking.flight.seatClass}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact & Payment */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact Information */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                <Mail className="w-5 h-5 mr-2 text-purple-400" />
                Contact Information
              </h3>
              <div className="bg-black/30 rounded-2xl p-6 border border-white/10 space-y-4">
                <div>
                  <p className="text-white/60 text-sm">Email</p>
                  <p className="text-white font-medium" data-testid="text-contact-email">{booking.contact.email}</p>
                </div>
                <div>
                  <p className="text-white/60 text-sm">Phone</p>
                  <p className="text-white font-medium" data-testid="text-contact-phone">{booking.contact.phone}</p>
                </div>
                <div>
                  <p className="text-white/60 text-sm">Emergency Contact</p>
                  <p className="text-white font-medium">{booking.contact.emergencyContact}</p>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                <CreditCard className="w-5 h-5 mr-2 text-purple-400" />
                Payment Information
              </h3>
              <div className="bg-black/30 rounded-2xl p-6 border border-white/10 space-y-4">
                <div>
                  <p className="text-white/60 text-sm">Payment Method</p>
                  <p className="text-white font-medium">{booking.paymentMethod}</p>
                </div>
                <Separator className="bg-white/20" />
                <div className="space-y-2">
                  <div className="flex justify-between text-white/80">
                    <span>Base fare × {booking.passengers.length}</span>
                    <span>₹{booking.totalAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-white/80">
                    <span>Taxes & fees</span>
                    <span>₹{taxAmount.toLocaleString()}</span>
                  </div>
                  <Separator className="bg-white/20" />
                  <div className="flex justify-between text-xl font-bold text-white">
                    <span>Total Paid</span>
                    <span data-testid="text-total-paid">₹{totalWithTax.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={() => setLocation('/')} 
            className="modern-button hover-lift"
            data-testid="button-home"
          >
            <Home className="w-5 h-5 mr-2" />
            Back to Home
          </Button>
          <Button 
            onClick={() => setLocation('/profile')} 
            variant="outline" 
            className="modern-button-outline"
            data-testid="button-profile"
          >
            <User className="w-5 h-5 mr-2" />
            View My Bookings
          </Button>
        </div>
      </div>
    </div>
  );
}
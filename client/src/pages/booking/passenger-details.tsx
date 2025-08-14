import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Plane, User, Mail, Phone, Calendar, MapPin, ArrowRight, ArrowLeft, Users, CreditCard, Shield } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";

// Passenger details schema
const passengerSchema = z.object({
  title: z.enum(["Mr", "Ms", "Mrs", "Dr"]),
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  gender: z.enum(["male", "female", "other"]),
  passportNumber: z.string().optional(),
  nationality: z.string().min(1, "Nationality is required"),
});

const contactSchema = z.object({
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  emergencyContact: z.string().min(10, "Emergency contact is required"),
});

const bookingFormSchema = z.object({
  passengers: z.array(passengerSchema).min(1),
  contact: contactSchema,
});

type BookingFormData = z.infer<typeof bookingFormSchema>;

interface BookingDetails {
  type: 'flight' | 'hotel' | 'train' | 'bus';
  
  // Flight details
  id?: string;
  flightNumber?: string;
  airline?: {
    name: string;
    code: string;
  };
  
  // Hotel details
  hotelId?: string;
  hotelName?: string;
  checkInDate?: string;
  checkOutDate?: string;
  rooms?: string;
  guests?: string;
  pricePerNight?: string;
  
  // Train details
  trainId?: string;
  trainNumber?: string;
  trainName?: string;
  
  // Bus details
  busId?: string;
  operatorName?: string;
  busType?: string;
  
  // Common details
  fromDestination?: {
    name: string;
    city: string;
  };
  toDestination?: {
    name: string;
    city: string;
  };
  from?: string;
  to?: string;
  departureTime?: string;
  arrivalTime?: string;
  price?: string;
  duration?: number;
  seatClass?: string;
  journeyDate?: string;
  passengers?: string;
  
  searchParams?: {
    from?: string;
    to?: string;
    date?: string;
    passengers?: string;
    destination?: string;
    checkInDate?: string;
    checkOutDate?: string;
    guests?: string;
    rooms?: string;
    journeyDate?: string;
    seatClass?: string;
  };
}

export default function PassengerDetails() {
  const [location, setLocation] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const { isModernTheme } = useTheme();
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null);
  const [currentPassenger, setCurrentPassenger] = useState(0);

  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      passengers: [],
      contact: {
        email: user?.email || "",
        phone: "",
        emergencyContact: "",
      },
    },
  });

  useEffect(() => {
    console.log('PassengerDetails useEffect running...');
    
    // Get booking details from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const type = urlParams.get('type') as 'flight' | 'hotel' | 'train' | 'bus';
    
    if (!type) {
      console.log('No booking type found, redirecting to home...');
      setLocation('/');
      return;
    }

    // Build booking details from URL parameters
    const details: BookingDetails = {
      type,
      id: urlParams.get('flightId') || urlParams.get('hotelId') || urlParams.get('trainId') || urlParams.get('busId') || '',
      flightNumber: urlParams.get('flightNumber') || '',
      hotelName: urlParams.get('hotelName') || '',
      trainNumber: urlParams.get('trainNumber') || '',
      trainName: urlParams.get('trainName') || '',
      operatorName: urlParams.get('operatorName') || '',
      busType: urlParams.get('busType') || '',
      from: urlParams.get('from') || '',
      to: urlParams.get('to') || '',
      departureTime: urlParams.get('departureTime') || '',
      arrivalTime: urlParams.get('arrivalTime') || '',
      price: urlParams.get('price') || urlParams.get('pricePerNight') || '',
      seatClass: urlParams.get('seatClass') || '',
      checkInDate: urlParams.get('checkInDate') || '',
      checkOutDate: urlParams.get('checkOutDate') || '',
      journeyDate: urlParams.get('journeyDate') || '',
      passengers: urlParams.get('passengers') || urlParams.get('guests') || '1',
      rooms: urlParams.get('rooms') || '1',
    };
    
    console.log('Parsed booking details:', details);
    setBookingDetails(details);

    // Initialize passengers array based on passenger/guest count
    const passengerCount = parseInt(details.passengers || '1');
    const passengers = Array.from({ length: passengerCount }, () => ({
      title: "Mr" as const,
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      gender: "male" as const,
      passportNumber: "",
      nationality: "Indian",
    }));

    form.setValue('passengers', passengers);
  }, [form, setLocation]);

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

  const onSubmit = (data: BookingFormData) => {
    // Store booking data and proceed to payment
    const bookingData = {
      booking: bookingDetails,
      passengers: data.passengers,
      contact: data.contact,
      totalAmount: bookingDetails ? parseInt(bookingDetails.price || '0') * data.passengers.length : 0,
    };

    sessionStorage.setItem('bookingData', JSON.stringify(bookingData));
    setLocation('/booking/payment');
  };

  const handlePreviousPassenger = () => {
    if (currentPassenger > 0) {
      setCurrentPassenger(currentPassenger - 1);
    }
  };

  const handleNextPassenger = () => {
    const passengerCount = bookingDetails ? parseInt(bookingDetails.passengers || '1') : 1;
    if (currentPassenger < passengerCount - 1) {
      setCurrentPassenger(currentPassenger + 1);
    }
  };

  if (!bookingDetails) {
    return (
      <div className={cn("min-h-screen flex items-center justify-center", isModernTheme ? "bg-gradient-modern" : "bg-gray-50")}>
        <div className={cn("animate-spin w-8 h-8 border-4 border-t-transparent rounded-full", isModernTheme ? "border-purple-500" : "border-blue-500")}></div>
      </div>
    );
  }

  const passengerCount = parseInt(bookingDetails.passengers || '1');
  const totalPrice = parseInt(bookingDetails.price || '0') * passengerCount;

  return (
    <div className={cn("min-h-screen pt-16", isModernTheme ? "bg-gradient-modern" : "bg-gray-50")}>
      <div className="container-main py-8">
        {/* Progress Indicator */}
        <div className={cn("booking-card mb-6", 
          isModernTheme && "bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-3xl p-6"
        )}>
          <div className="flex items-center justify-center space-x-8">
            <div className="flex items-center space-x-2">
              <div className={cn("w-8 h-8 rounded-full flex items-center justify-center", isModernTheme ? "bg-purple-600" : "bg-blue-600")}>
                <span className="text-white text-sm font-bold">1</span>
              </div>
              <span className={cn("font-medium", isModernTheme ? "text-white" : "text-gray-900")}>Passenger Details</span>
            </div>
            <div className={cn("w-16 h-px", isModernTheme ? "bg-purple-300/30" : "bg-gray-300")}></div>
            <div className="flex items-center space-x-2">
              <div className={cn("w-8 h-8 rounded-full flex items-center justify-center", isModernTheme ? "bg-purple-300/30" : "bg-gray-300")}>
                <span className={cn("text-sm font-bold", isModernTheme ? "text-purple-300" : "text-gray-600")}>2</span>
              </div>
              <span className={cn(isModernTheme ? "text-purple-300" : "text-gray-600")}>Payment</span>
            </div>
            <div className={cn("w-16 h-px", isModernTheme ? "bg-purple-300/30" : "bg-gray-300")}></div>
            <div className="flex items-center space-x-2">
              <div className={cn("w-8 h-8 rounded-full flex items-center justify-center", isModernTheme ? "bg-purple-300/30" : "bg-gray-300")}>
                <span className={cn("text-sm font-bold", isModernTheme ? "text-purple-300" : "text-gray-600")}>3</span>
              </div>
              <span className={cn(isModernTheme ? "text-purple-300" : "text-gray-600")}>Confirmation</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <div className={cn("booking-card", 
              isModernTheme && "bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-3xl p-8"
            )}>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className={cn("text-2xl font-bold mb-2", isModernTheme ? "text-white" : "text-gray-900")}>Passenger Details</h1>
                  <p className={cn(isModernTheme ? "text-purple-300" : "text-gray-600")}>Please provide accurate information as per your ID</p>
                </div>
                <div className={cn("flex items-center space-x-2", isModernTheme ? "text-purple-400" : "text-blue-600")}>
                  <Users className="w-5 h-5" />
                  <span className="font-medium">
                    {currentPassenger + 1} of {passengerCount}
                  </span>
                </div>
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  {/* Passenger Details */}
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className={cn("text-xl font-semibold flex items-center", isModernTheme ? "text-white" : "text-gray-900")}>
                        <User className={cn("w-5 h-5 mr-2", isModernTheme ? "text-purple-400" : "text-blue-600")} />
                        Passenger {currentPassenger + 1}
                      </h3>
                      {passengerCount > 1 && (
                        <div className="flex space-x-2">
                          <button
                            type="button"
                            onClick={handlePreviousPassenger}
                            disabled={currentPassenger === 0}
                            className="booking-button-secondary"
                          >
                            <ArrowLeft className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={handleNextPassenger}
                            disabled={currentPassenger === passengerCount - 1}
                            className="booking-button-secondary"
                          >
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <FormField
                        control={form.control}
                        name={`passengers.${currentPassenger}.title`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={cn(isModernTheme ? "text-white" : "text-gray-700")}>Title</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="booking-input" data-testid={`select-title-${currentPassenger}`}>
                                  <SelectValue placeholder="Select title" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Mr">Mr</SelectItem>
                                <SelectItem value="Ms">Ms</SelectItem>
                                <SelectItem value="Mrs">Mrs</SelectItem>
                                <SelectItem value="Dr">Dr</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`passengers.${currentPassenger}.firstName`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={cn(isModernTheme ? "text-white" : "text-gray-700")}>First Name</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Enter first name" 
                                className="modern-input" 
                                data-testid={`input-firstName-${currentPassenger}`}
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`passengers.${currentPassenger}.lastName`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={cn(isModernTheme ? "text-white" : "text-gray-700")}>Last Name</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Enter last name" 
                                className="modern-input" 
                                data-testid={`input-lastName-${currentPassenger}`}
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`passengers.${currentPassenger}.dateOfBirth`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={cn(isModernTheme ? "text-white" : "text-gray-700")}>Date of Birth</FormLabel>
                            <FormControl>
                              <Input 
                                type="date" 
                                className="modern-input" 
                                data-testid={`input-dateOfBirth-${currentPassenger}`}
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`passengers.${currentPassenger}.gender`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={cn(isModernTheme ? "text-white" : "text-gray-700")}>Gender</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="modern-input" data-testid={`select-gender-${currentPassenger}`}>
                                  <SelectValue placeholder="Select gender" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="male">Male</SelectItem>
                                <SelectItem value="female">Female</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`passengers.${currentPassenger}.nationality`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={cn(isModernTheme ? "text-white" : "text-gray-700")}>Nationality</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Enter nationality" 
                                className="modern-input" 
                                data-testid={`input-nationality-${currentPassenger}`}
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name={`passengers.${currentPassenger}.passportNumber`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={cn(isModernTheme ? "text-white" : "text-gray-700")}>Passport Number (Optional)</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Enter passport number (if applicable)" 
                              className="modern-input" 
                              data-testid={`input-passportNumber-${currentPassenger}`}
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Contact Information */}
                  {currentPassenger === 0 && (
                    <>
                      <Separator className="bg-gray-200" />
                      <div className="space-y-6">
                        <h3 className={cn("text-xl font-semibold flex items-center", isModernTheme ? "text-white" : "text-gray-900")}>
                          <Mail className={cn("w-5 h-5 mr-2", isModernTheme ? "text-purple-400" : "text-blue-600")} />
                          Contact Information
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="contact.email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className={cn(isModernTheme ? "text-white" : "text-gray-700")}>Email Address</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="email" 
                                    placeholder="Enter email address" 
                                    className="modern-input" 
                                    data-testid="input-email"
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="contact.phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className={cn(isModernTheme ? "text-white" : "text-gray-700")}>Phone Number</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="tel" 
                                    placeholder="Enter phone number" 
                                    className="modern-input" 
                                    data-testid="input-phone"
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="contact.emergencyContact"
                            render={({ field }) => (
                              <FormItem className="md:col-span-2">
                                <FormLabel className={cn(isModernTheme ? "text-white" : "text-gray-700")}>Emergency Contact</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="tel" 
                                    placeholder="Enter emergency contact number" 
                                    className="modern-input" 
                                    data-testid="input-emergencyContact"
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {/* Action Buttons */}
                  <div className="flex justify-between pt-6">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setLocation('/flights/search')}
                      className="modern-button-outline"
                      data-testid="button-back"
                    >
                      <ArrowLeft className="w-5 h-5 mr-2" />
                      Back to Flights
                    </Button>

                    <Button
                      type="submit"
                      className="modern-button hover-lift px-8"
                      data-testid="button-continue"
                    >
                      Continue to Payment
                      <CreditCard className="w-5 h-5 ml-2" />
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <div className={cn("p-6 rounded-3xl sticky top-6", 
              isModernTheme 
                ? "bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl" 
                : "booking-card"
            )}>
              <h3 className={cn("text-xl font-semibold mb-6 flex items-center", isModernTheme ? "text-white" : "text-gray-900")}>
                {bookingDetails.type === 'flight' && <Plane className={cn("w-5 h-5 mr-2", isModernTheme ? "text-purple-400" : "text-blue-600")} />}
                {bookingDetails.type === 'hotel' && <MapPin className={cn("w-5 h-5 mr-2", isModernTheme ? "text-purple-400" : "text-blue-600")} />}
                {bookingDetails.type === 'train' && <Calendar className={cn("w-5 h-5 mr-2", isModernTheme ? "text-purple-400" : "text-blue-600")} />}
                {bookingDetails.type === 'bus' && <User className={cn("w-5 h-5 mr-2", isModernTheme ? "text-purple-400" : "text-blue-600")} />}
                {bookingDetails.type === 'flight' && 'Flight Summary'}
                {bookingDetails.type === 'hotel' && 'Hotel Summary'}
                {bookingDetails.type === 'train' && 'Train Summary'}
                {bookingDetails.type === 'bus' && 'Bus Summary'}
              </h3>

              <div className="space-y-6">
                {/* Flight Info */}
                <div className={cn("p-4 rounded-2xl border", 
                  isModernTheme 
                    ? "bg-white/10 backdrop-blur-lg border-white/20 shadow-lg" 
                    : "bg-gray-50 border-gray-200"
                )}>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className={cn("font-semibold", isModernTheme ? "text-white" : "text-gray-900")}>
                      {bookingDetails.type === 'flight' && (bookingDetails.airline?.name || 'Airline')}
                      {bookingDetails.type === 'hotel' && (bookingDetails.hotelName || 'Hotel')}
                      {bookingDetails.type === 'train' && (bookingDetails.trainName || 'Train')}
                      {bookingDetails.type === 'bus' && (bookingDetails.operatorName || 'Bus Operator')}
                    </h4>
                    <span className={cn("font-medium", isModernTheme ? "text-purple-400" : "text-blue-600")}>
                      {bookingDetails.type === 'flight' && bookingDetails.flightNumber}
                      {bookingDetails.type === 'train' && bookingDetails.trainNumber}
                      {bookingDetails.type === 'bus' && bookingDetails.busType}
                    </span>
                  </div>

                  <div className="space-y-4">
                    {(bookingDetails.type === 'flight' || bookingDetails.type === 'train' || bookingDetails.type === 'bus') && bookingDetails.departureTime && bookingDetails.arrivalTime && (
                      <div className="flex items-center justify-between">
                        <div>
                          <div className={cn("text-xl font-bold", isModernTheme ? "text-white" : "text-gray-900")}>
                            {formatTime(bookingDetails.departureTime)}
                          </div>
                          <div className={cn("text-sm", isModernTheme ? "text-white/60" : "text-gray-600")}>
                            {bookingDetails.from}
                          </div>
                        </div>
                        <div className="text-center">
                          {bookingDetails.duration && (
                            <div className={cn("text-sm mb-1", isModernTheme ? "text-white/60" : "text-gray-600")}>
                              {formatDuration(bookingDetails.duration)}
                            </div>
                          )}
                          <div className="flex items-center">
                            <div className={cn("w-2 h-2 rounded-full", isModernTheme ? "bg-purple-400" : "bg-blue-500")}></div>
                            <div className={cn("flex-1 h-px mx-2", isModernTheme ? "bg-purple-400" : "bg-blue-500")}></div>
                            <ArrowRight className={cn("w-4 h-4", isModernTheme ? "text-purple-400" : "text-blue-500")} />
                            <div className={cn("flex-1 h-px mx-2", isModernTheme ? "bg-purple-400" : "bg-blue-500")}></div>
                            <div className={cn("w-2 h-2 rounded-full", isModernTheme ? "bg-purple-400" : "bg-blue-500")}></div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={cn("text-xl font-bold", isModernTheme ? "text-white" : "text-gray-900")}>
                            {formatTime(bookingDetails.arrivalTime)}
                          </div>
                          <div className={cn("text-sm", isModernTheme ? "text-white/60" : "text-gray-600")}>
                            {bookingDetails.to}
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {bookingDetails.type === 'hotel' && (
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className={cn("text-sm", isModernTheme ? "text-white/60" : "text-gray-600")}>Check-in</span>
                          <span className={cn("font-medium", isModernTheme ? "text-white" : "text-gray-900")}>
                            {bookingDetails.checkInDate && new Date(bookingDetails.checkInDate).toLocaleDateString('en-IN')}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className={cn("text-sm", isModernTheme ? "text-white/60" : "text-gray-600")}>Check-out</span>
                          <span className={cn("font-medium", isModernTheme ? "text-white" : "text-gray-900")}>
                            {bookingDetails.checkOutDate && new Date(bookingDetails.checkOutDate).toLocaleDateString('en-IN')}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className={cn("text-sm", isModernTheme ? "text-white/60" : "text-gray-600")}>Rooms & Guests</span>
                          <span className={cn("font-medium", isModernTheme ? "text-white" : "text-gray-900")}>
                            {bookingDetails.rooms} rooms, {bookingDetails.passengers} guests
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-4">
                  <h4 className={cn("font-semibold", isModernTheme ? "text-white" : "text-gray-900")}>Price Breakdown</h4>
                  <div className="space-y-2">
                    <div className={cn("flex justify-between", isModernTheme ? "text-white/80" : "text-gray-700")}>
                      <span>
                        {bookingDetails.type === 'hotel' ? `Per night × ${passengerCount}` : `Base fare × ${passengerCount}`}
                      </span>
                      <span>₹{parseInt(bookingDetails.price || '0').toLocaleString()}</span>
                    </div>
                    <div className={cn("flex justify-between", isModernTheme ? "text-white/80" : "text-gray-700")}>
                      <span>Taxes & fees</span>
                      <span>₹{Math.round(totalPrice * 0.1).toLocaleString()}</span>
                    </div>
                    <Separator className={cn(isModernTheme ? "bg-white/20" : "bg-gray-200")} />
                    <div className={cn("flex justify-between text-xl font-bold", isModernTheme ? "text-white" : "text-gray-900")}>
                      <span>Total Amount</span>
                      <span>₹{Math.round(totalPrice * 1.1).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Security Badge */}
                <div className={cn("flex items-center space-x-2 text-sm", isModernTheme ? "text-green-400" : "text-green-600")}>
                  <Shield className="w-4 h-4" />
                  <span>Your information is secure</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
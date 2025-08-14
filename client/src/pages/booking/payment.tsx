import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  CreditCard, 
  Plane, 
  Shield, 
  ArrowLeft, 
  Lock, 
  Smartphone, 
  Wallet, 
  Check,
  Calendar,
  User,
  CheckCircle2
} from "lucide-react";

// Payment form schemas
const cardPaymentSchema = z.object({
  cardNumber: z.string().min(16, "Card number must be 16 digits").max(19, "Invalid card number"),
  expiryMonth: z.string().min(1, "Expiry month is required"),
  expiryYear: z.string().min(1, "Expiry year is required"),
  cvv: z.string().min(3, "CVV must be at least 3 digits").max(4, "CVV must be at most 4 digits"),
  cardHolder: z.string().min(2, "Cardholder name is required"),
});

const upiPaymentSchema = z.object({
  upiId: z.string().email("Invalid UPI ID format"),
});

type CardPaymentData = z.infer<typeof cardPaymentSchema>;
type UpiPaymentData = z.infer<typeof upiPaymentSchema>;

interface BookingData {
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
    price: string;
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
    passportNumber?: string;
  }>;
  contact: {
    email: string;
    phone: string;
    emergencyContact: string;
  };
  totalAmount: number;
}

export default function PaymentPage() {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [processing, setProcessing] = useState(false);

  const cardForm = useForm<CardPaymentData>({
    resolver: zodResolver(cardPaymentSchema),
    defaultValues: {
      cardNumber: "",
      expiryMonth: "",
      expiryYear: "",
      cvv: "",
      cardHolder: "",
    },
  });

  const upiForm = useForm<UpiPaymentData>({
    resolver: zodResolver(upiPaymentSchema),
    defaultValues: {
      upiId: "",
    },
  });

  useEffect(() => {
    // Get booking data from sessionStorage
    const storedBookingData = sessionStorage.getItem('bookingData');
    if (!storedBookingData) {
      setLocation('/flights/search');
      return;
    }

    const data = JSON.parse(storedBookingData) as BookingData;
    setBookingData(data);
  }, [setLocation]);

  const createBookingMutation = useMutation({
    mutationFn: async (paymentData: any) => {
      const response = await apiRequest('POST', '/api/bookings/create', {
        ...bookingData,
        paymentMethod,
        paymentData,
      });
      return response.json();
    },
    onSuccess: (data) => {
      sessionStorage.setItem('bookingConfirmation', JSON.stringify(data));
      sessionStorage.removeItem('selectedFlight');
      sessionStorage.removeItem('bookingData');
      setLocation('/booking/confirmation');
    },
    onError: (error) => {
      toast({
        title: "Payment Failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive",
      });
      setProcessing(false);
    },
  });

  const handleCardPayment = (data: CardPaymentData) => {
    setProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      createBookingMutation.mutate({
        type: 'card',
        ...data,
      });
    }, 2000);
  };

  const handleUpiPayment = (data: UpiPaymentData) => {
    setProcessing(true);
    
    // Simulate UPI payment processing
    setTimeout(() => {
      createBookingMutation.mutate({
        type: 'upi',
        ...data,
      });
    }, 2000);
  };

  const handleWalletPayment = (walletType: string) => {
    setProcessing(true);
    
    // Simulate wallet payment processing
    setTimeout(() => {
      createBookingMutation.mutate({
        type: 'wallet',
        walletType,
      });
    }, 1500);
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

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  if (!bookingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const totalAmount = Math.round(bookingData.totalAmount * 1.1); // Including taxes

  return (
    <div className="min-h-screen px-6 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Progress Indicator */}
        <div className="flex items-center justify-center mb-12">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
              <span className="text-green-400 font-medium">Passenger Details</span>
            </div>
            <div className="w-12 h-px bg-purple-400"></div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">2</span>
              </div>
              <span className="text-purple-400 font-medium">Payment</span>
            </div>
            <div className="w-12 h-px bg-white/30"></div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white/20 border border-white/30 rounded-full flex items-center justify-center">
                <span className="text-white/60 text-sm font-bold">3</span>
              </div>
              <span className="text-white/60 font-medium">Confirmation</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2">
            <div className="glass p-8 rounded-3xl">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="heading-lg text-white mb-2">Payment Details</h1>
                  <p className="text-white/60">Choose your preferred payment method</p>
                </div>
                <div className="flex items-center space-x-2 text-green-400">
                  <Shield className="w-5 h-5" />
                  <span className="text-sm font-medium">Secure Payment</span>
                </div>
              </div>

              {processing ? (
                <div className="text-center py-20">
                  <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                    <CreditCard className="w-8 h-8 text-purple-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Processing Payment...</h3>
                  <p className="text-white/60">Please do not refresh or close this page</p>
                </div>
              ) : (
                <Tabs value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-6">
                  <TabsList className="grid w-full grid-cols-3 bg-black/30 border border-white/20">
                    <TabsTrigger value="card" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white">
                      <CreditCard className="w-4 h-4 mr-2" />
                      Card
                    </TabsTrigger>
                    <TabsTrigger value="upi" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white">
                      <Smartphone className="w-4 h-4 mr-2" />
                      UPI
                    </TabsTrigger>
                    <TabsTrigger value="wallet" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white">
                      <Wallet className="w-4 h-4 mr-2" />
                      Wallet
                    </TabsTrigger>
                  </TabsList>

                  {/* Card Payment */}
                  <TabsContent value="card" className="space-y-6">
                    <Form {...cardForm}>
                      <form onSubmit={cardForm.handleSubmit(handleCardPayment)} className="space-y-6">
                        <FormField
                          control={cardForm.control}
                          name="cardNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white">Card Number</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="1234 5678 9012 3456"
                                  className="modern-input text-lg"
                                  data-testid="input-cardNumber"
                                  value={formatCardNumber(field.value)}
                                  onChange={(e) => field.onChange(e.target.value.replace(/\s/g, ''))}
                                  maxLength={19}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={cardForm.control}
                          name="cardHolder"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white">Cardholder Name</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter name as on card"
                                  className="modern-input"
                                  data-testid="input-cardHolder"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-3 gap-4">
                          <FormField
                            control={cardForm.control}
                            name="expiryMonth"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-white">Month</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                  <FormControl>
                                    <SelectTrigger className="modern-input" data-testid="select-expiryMonth">
                                      <SelectValue placeholder="MM" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {Array.from({ length: 12 }, (_, i) => (
                                      <SelectItem key={i + 1} value={String(i + 1).padStart(2, '0')}>
                                        {String(i + 1).padStart(2, '0')}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={cardForm.control}
                            name="expiryYear"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-white">Year</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                  <FormControl>
                                    <SelectTrigger className="modern-input" data-testid="select-expiryYear">
                                      <SelectValue placeholder="YYYY" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {Array.from({ length: 10 }, (_, i) => {
                                      const year = new Date().getFullYear() + i;
                                      return (
                                        <SelectItem key={year} value={String(year)}>
                                          {year}
                                        </SelectItem>
                                      );
                                    })}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={cardForm.control}
                            name="cvv"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-white">CVV</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="123"
                                    type="password"
                                    className="modern-input"
                                    data-testid="input-cvv"
                                    maxLength={4}
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <Button
                          type="submit"
                          className="w-full modern-button hover-lift text-lg py-6"
                          data-testid="button-pay-card"
                        >
                          <Lock className="w-5 h-5 mr-2" />
                          Pay ₹{totalAmount.toLocaleString()}
                        </Button>
                      </form>
                    </Form>
                  </TabsContent>

                  {/* UPI Payment */}
                  <TabsContent value="upi" className="space-y-6">
                    <Form {...upiForm}>
                      <form onSubmit={upiForm.handleSubmit(handleUpiPayment)} className="space-y-6">
                        <FormField
                          control={upiForm.control}
                          name="upiId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white">UPI ID</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="example@paytm"
                                  className="modern-input text-lg"
                                  data-testid="input-upiId"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <Button
                          type="submit"
                          className="w-full modern-button hover-lift text-lg py-6"
                          data-testid="button-pay-upi"
                        >
                          <Smartphone className="w-5 h-5 mr-2" />
                          Pay ₹{totalAmount.toLocaleString()} via UPI
                        </Button>
                      </form>
                    </Form>
                  </TabsContent>

                  {/* Wallet Payment */}
                  <TabsContent value="wallet" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { name: "Paytm", icon: "💰" },
                        { name: "PhonePe", icon: "📱" },
                        { name: "Google Pay", icon: "🎯" },
                        { name: "Amazon Pay", icon: "📦" },
                      ].map((wallet) => (
                        <Button
                          key={wallet.name}
                          variant="outline"
                          className="modern-button-outline p-6 h-auto"
                          onClick={() => handleWalletPayment(wallet.name)}
                          data-testid={`button-wallet-${wallet.name.toLowerCase().replace(' ', '')}`}
                        >
                          <div className="text-center">
                            <div className="text-2xl mb-2">{wallet.icon}</div>
                            <div className="font-medium">{wallet.name}</div>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              )}

              {/* Security Info */}
              <div className="mt-8 p-4 bg-green-500/10 border border-green-500/30 rounded-2xl">
                <div className="flex items-center space-x-2 text-green-400 mb-2">
                  <Shield className="w-4 h-4" />
                  <span className="font-medium">Secure Payment</span>
                </div>
                <p className="text-white/60 text-sm">
                  Your payment information is encrypted and secure. We use industry-standard SSL encryption to protect your data.
                </p>
              </div>
            </div>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <div className="glass p-6 rounded-3xl sticky top-6">
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                <Plane className="w-5 h-5 mr-2 text-purple-400" />
                Booking Summary
              </h3>

              <div className="space-y-6">
                {/* Flight Info */}
                <div className="p-4 bg-black/30 rounded-2xl border border-white/10">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-white">{bookingData.flight.airline.name}</h4>
                    <span className="text-purple-400 font-medium">{bookingData.flight.flightNumber}</span>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xl font-bold text-white">
                          {formatTime(bookingData.flight.departureTime)}
                        </div>
                        <div className="text-white/60 text-sm">
                          {bookingData.flight.fromDestination.city}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-white/60 text-sm mb-1">
                          {formatDuration(bookingData.flight.duration)}
                        </div>
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                          <div className="flex-1 h-px bg-purple-400 mx-2"></div>
                          <Plane className="w-4 h-4 text-purple-400" />
                          <div className="flex-1 h-px bg-purple-400 mx-2"></div>
                          <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-white">
                          {formatTime(bookingData.flight.arrivalTime)}
                        </div>
                        <div className="text-white/60 text-sm">
                          {bookingData.flight.toDestination.city}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Passengers */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-white flex items-center">
                    <User className="w-4 h-4 mr-2 text-purple-400" />
                    Passengers ({bookingData.passengers.length})
                  </h4>
                  {bookingData.passengers.map((passenger, index) => (
                    <div key={index} className="text-white/80 text-sm">
                      {passenger.title} {passenger.firstName} {passenger.lastName}
                    </div>
                  ))}
                </div>

                <Separator className="bg-white/20" />

                {/* Price Breakdown */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-white">Price Breakdown</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-white/80">
                      <span>Base fare × {bookingData.passengers.length}</span>
                      <span>₹{bookingData.totalAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-white/80">
                      <span>Taxes & fees</span>
                      <span>₹{Math.round(bookingData.totalAmount * 0.1).toLocaleString()}</span>
                    </div>
                    <Separator className="bg-white/20" />
                    <div className="flex justify-between text-xl font-bold text-white">
                      <span>Total Amount</span>
                      <span>₹{totalAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="flex justify-start mt-8">
          <Button
            variant="outline"
            onClick={() => setLocation('/booking/passenger-details')}
            className="modern-button-outline"
            data-testid="button-back-passenger"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Passenger Details
          </Button>
        </div>
      </div>
    </div>
  );
}